"""
Serviço Flask para processamento de vídeos com MediaPipe Pose.
Extrai landmarks, calcula ângulos e detecta fase do movimento.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from typing import List, Dict, Any
import time
import traceback
import os

from pose_detector import PoseDetector
from biomechanics_engine import BiomechanicsEngine
from utils import validate_frame_data, calculate_confidence_score
from config import get_config

# Configurar ambiente
env = os.getenv('FLASK_ENV', 'development')
config = get_config(env)

# Configurar logging
logging.basicConfig(
    level=getattr(logging, config.LOG_LEVEL),
    format=config.LOG_FORMAT
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Inicializar serviços
logger.info(f"Initializing PoseDetector with model_complexity={config.MODEL_COMPLEXITY}")
pose_detector = PoseDetector(
    model_complexity=config.MODEL_COMPLEXITY,
    min_detection_confidence=config.MIN_DETECTION_CONFIDENCE,
    min_tracking_confidence=config.MIN_TRACKING_CONFIDENCE
)

biomechanics_engine = BiomechanicsEngine()

# Métricas (opcional)
if config.ENABLE_METRICS:
    try:
        from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST

        REQUEST_COUNT = Counter('mediapipe_requests_total', 'Total requests', ['endpoint', 'status'])
        REQUEST_DURATION = Histogram('mediapipe_request_duration_seconds', 'Request duration')
        FRAMES_PROCESSED = Counter('mediapipe_frames_processed_total', 'Total frames processed')

        @app.route('/metrics', methods=['GET'])
        def metrics():
            return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}

        logger.info("Prometheus metrics enabled")
    except ImportError:
        logger.warning("prometheus_client not installed, metrics disabled")
        config.ENABLE_METRICS = False


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'mediapipe-biomechanics',
        'version': '1.0.0',
        'config': {
            'model_complexity': config.MODEL_COMPLEXITY,
            'max_frames': config.MAX_FRAMES_PER_REQUEST
        }
    }), 200


@app.route('/analyze-frames', methods=['POST'])
def analyze_frames():
    """
    Analisa múltiplos frames de vídeo.

    Input JSON:
    {
        "frames": [
            {"path": "/tmp/frame_001.jpg", "timestamp_ms": 1000},
            {"path": "/tmp/frame_002.jpg", "timestamp_ms": 2000}
        ],
        "exercise_type": "squat"
    }

    Output JSON:
    {
        "success": true,
        "frames": [
            {
                "frame_number": 1,
                "timestamp_ms": 1000,
                "phase": "eccentric",
                "confidence": 0.95,
                "landmarks_3d": [...],
                "angles": {
                    "knee_left": 120,
                    "knee_right": 117,
                    "hip": 110,
                    "trunk": 15,
                    "ankle_left": 75,
                    "ankle_right": 73
                }
            }
        ],
        "duration_ms": 3000,
        "processing_time_ms": 1234
    }
    """
    start_time = time.time()

    try:
        data = request.get_json()

        if not data or 'frames' not in data:
            if config.ENABLE_METRICS:
                REQUEST_COUNT.labels(endpoint='analyze_frames', status='error').inc()
            return jsonify({
                'success': False,
                'error': 'Missing frames data'
            }), 400

        frames_input = data['frames']
        exercise_type = data.get('exercise_type', 'squat')

        # Validar limite de frames
        if len(frames_input) > config.MAX_FRAMES_PER_REQUEST:
            return jsonify({
                'success': False,
                'error': f'Too many frames. Maximum {config.MAX_FRAMES_PER_REQUEST} allowed.'
            }), 400

        logger.info(f"Processing {len(frames_input)} frames for exercise: {exercise_type}")

        processed_frames = []
        total_confidence = 0

        for idx, frame_data in enumerate(frames_input):
            # Validar frame data
            if not validate_frame_data(frame_data):
                logger.warning(f"Invalid frame data at index {idx}")
                continue

            frame_path = frame_data['path']
            timestamp_ms = frame_data['timestamp_ms']

            # Verificar se arquivo existe
            if not os.path.exists(frame_path):
                logger.warning(f"Frame file not found: {frame_path}")
                continue

            # 1. Detectar pose com MediaPipe
            pose_result = pose_detector.process_image(frame_path)

            if not pose_result['success']:
                logger.warning(f"Failed to detect pose in frame {idx + 1}: {pose_result.get('error')}")
                continue

            # 2. Calcular ângulos biomecânicos
            angles = biomechanics_engine.calculate_angles(
                pose_result['landmarks_3d'],
                exercise_type
            )

            # 3. Detectar fase do movimento
            phase = biomechanics_engine.detect_phase(
                angles,
                exercise_type,
                frame_number=idx + 1,
                total_frames=len(frames_input)
            )

            # 4. Calcular confidence score
            confidence = calculate_confidence_score(pose_result['landmarks_3d'])
            total_confidence += confidence

            processed_frame = {
                'frame_number': idx + 1,
                'timestamp_ms': timestamp_ms,
                'phase': phase,
                'confidence': round(confidence, 3),
                'landmarks_3d': pose_result['landmarks_3d'],
                'landmarks_normalized': pose_result['landmarks_normalized'].tolist() if hasattr(pose_result['landmarks_normalized'], 'tolist') else pose_result['landmarks_normalized'],
                'angles': angles,
                'world_landmarks': pose_result.get('world_landmarks', None)
            }

            processed_frames.append(processed_frame)

            if config.ENABLE_METRICS:
                FRAMES_PROCESSED.inc()

        if len(processed_frames) == 0:
            if config.ENABLE_METRICS:
                REQUEST_COUNT.labels(endpoint='analyze_frames', status='error').inc()
            return jsonify({
                'success': False,
                'error': 'No frames could be processed'
            }), 400

        # Calcular duração total
        duration_ms = frames_input[-1]['timestamp_ms'] - frames_input[0]['timestamp_ms']

        # Estatísticas
        avg_confidence = total_confidence / len(processed_frames)
        processing_time = int((time.time() - start_time) * 1000)

        result = {
            'success': True,
            'frames': processed_frames,
            'duration_ms': duration_ms,
            'processing_time_ms': processing_time,
            'statistics': {
                'frames_processed': len(processed_frames),
                'frames_total': len(frames_input),
                'success_rate': round(len(processed_frames) / len(frames_input), 3),
                'average_confidence': round(avg_confidence, 3)
            }
        }

        logger.info(f"Processing completed: {len(processed_frames)}/{len(frames_input)} frames in {processing_time}ms")

        if config.ENABLE_METRICS:
            REQUEST_COUNT.labels(endpoint='analyze_frames', status='success').inc()
            REQUEST_DURATION.observe(time.time() - start_time)

        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Error processing frames: {str(e)}")
        logger.error(traceback.format_exc())

        if config.ENABLE_METRICS:
            REQUEST_COUNT.labels(endpoint='analyze_frames', status='error').inc()

        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc() if config.DEBUG else None
        }), 500


@app.route('/analyze-single-frame', methods=['POST'])
def analyze_single_frame():
    """
    Analisa um único frame (útil para debug/teste).
    """
    start_time = time.time()

    try:
        data = request.get_json()

        if not data or 'frame_path' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing frame_path'
            }), 400

        frame_path = data['frame_path']
        exercise_type = data.get('exercise_type', 'squat')

        # Verificar arquivo
        if not os.path.exists(frame_path):
            return jsonify({
                'success': False,
                'error': f'Frame file not found: {frame_path}'
            }), 404

        # Processar
        pose_result = pose_detector.process_image(frame_path)

        if not pose_result['success']:
            return jsonify({
                'success': False,
                'error': pose_result.get('error', 'Failed to detect pose')
            }), 400

        angles = biomechanics_engine.calculate_angles(
            pose_result['landmarks_3d'],
            exercise_type
        )

        confidence = calculate_confidence_score(pose_result['landmarks_3d'])
        processing_time = int((time.time() - start_time) * 1000)

        return jsonify({
            'success': True,
            'landmarks': pose_result['landmarks_3d'],
            'angles': angles,
            'confidence': round(confidence, 3),
            'processing_time_ms': processing_time
        }), 200

    except Exception as e:
        logger.error(f"Error processing single frame: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc() if config.DEBUG else None
        }), 500


@app.route('/config', methods=['GET'])
def get_current_config():
    """Retorna configuração atual (sem dados sensíveis)"""
    return jsonify({
        'model_complexity': config.MODEL_COMPLEXITY,
        'min_detection_confidence': config.MIN_DETECTION_CONFIDENCE,
        'min_tracking_confidence': config.MIN_TRACKING_CONFIDENCE,
        'max_frames_per_request': config.MAX_FRAMES_PER_REQUEST,
        'environment': env
    }), 200


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    logger.info(f"Starting MediaPipe service on {config.HOST}:{config.PORT}")
    logger.info(f"Configuration: {config.to_dict()}")

    app.run(
        host=config.HOST,
        port=config.PORT,
        debug=config.DEBUG
    )
