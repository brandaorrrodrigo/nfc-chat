"""
Testes unitários e de integração para MediaPipe Service.
"""

import pytest
import json
import os
import tempfile
import numpy as np
from unittest.mock import Mock, patch, MagicMock
import cv2

# Import dos módulos
from mediapipe_service import app
from pose_detector import PoseDetector
from biomechanics_engine import BiomechanicsEngine
from utils import (
    validate_frame_data,
    calculate_confidence_score,
    calculate_bilateral_symmetry,
    validate_angle_ranges
)
from config import get_config


# ========== Fixtures ==========

@pytest.fixture
def client():
    """Flask test client"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def sample_landmarks():
    """Sample landmarks data"""
    return [
        {'id': 23, 'name': 'left_hip', 'x': 100, 'y': 200, 'z': -0.1, 'visibility': 0.95},
        {'id': 24, 'name': 'right_hip', 'x': 150, 'y': 200, 'z': -0.1, 'visibility': 0.93},
        {'id': 25, 'name': 'left_knee', 'x': 95, 'y': 350, 'z': 0.0, 'visibility': 0.98},
        {'id': 26, 'name': 'right_knee', 'x': 155, 'y': 350, 'z': 0.0, 'visibility': 0.97},
        {'id': 27, 'name': 'left_ankle', 'x': 90, 'y': 500, 'z': 0.1, 'visibility': 0.96},
        {'id': 28, 'name': 'right_ankle', 'x': 160, 'y': 500, 'z': 0.1, 'visibility': 0.94},
        {'id': 11, 'name': 'left_shoulder', 'x': 105, 'y': 50, 'z': -0.2, 'visibility': 0.92},
        {'id': 12, 'name': 'right_shoulder', 'x': 145, 'y': 50, 'z': -0.2, 'visibility': 0.91},
    ]


@pytest.fixture
def sample_frame_image():
    """Cria uma imagem de teste temporária"""
    # Criar imagem 640x480 preta
    img = np.zeros((480, 640, 3), dtype=np.uint8)

    # Desenhar um "corpo" simples (círculo para cabeça, retângulo para corpo)
    cv2.circle(img, (320, 100), 30, (255, 255, 255), -1)  # Cabeça
    cv2.rectangle(img, (280, 130), (360, 300), (255, 255, 255), -1)  # Torso
    cv2.rectangle(img, (280, 300), (310, 450), (255, 255, 255), -1)  # Perna esquerda
    cv2.rectangle(img, (330, 300), (360, 450), (255, 255, 255), -1)  # Perna direita

    # Salvar em arquivo temporário
    with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp:
        cv2.imwrite(tmp.name, img)
        yield tmp.name

    # Cleanup
    os.unlink(tmp.name)


# ========== Testes de Config ==========

def test_get_config_development():
    """Testa configuração de desenvolvimento"""
    config = get_config('development')
    assert config.DEBUG == True
    assert config.LOG_LEVEL == 'DEBUG'
    assert config.MODEL_COMPLEXITY == 1


def test_get_config_production():
    """Testa configuração de produção"""
    config = get_config('production')
    assert config.DEBUG == False
    assert config.LOG_LEVEL == 'INFO'
    assert config.ENABLE_METRICS == True


def test_get_config_testing():
    """Testa configuração de testes"""
    config = get_config('testing')
    assert config.MODEL_COMPLEXITY == 0  # Lite model
    assert config.MAX_FRAMES_PER_REQUEST == 5


# ========== Testes de Utils ==========

def test_validate_frame_data_valid():
    """Testa validação de frame data válido"""
    valid_frame = {
        'path': '/tmp/frame.jpg',
        'timestamp_ms': 1000
    }
    assert validate_frame_data(valid_frame) == True


def test_validate_frame_data_invalid():
    """Testa validação de frame data inválido"""
    invalid_frames = [
        {},  # Vazio
        {'path': '/tmp/frame.jpg'},  # Falta timestamp
        {'timestamp_ms': 1000},  # Falta path
        {'path': 123, 'timestamp_ms': 1000},  # Tipo errado
    ]

    for frame in invalid_frames:
        assert validate_frame_data(frame) == False


def test_calculate_confidence_score(sample_landmarks):
    """Testa cálculo de confidence score"""
    score = calculate_confidence_score(sample_landmarks)
    assert 0.0 <= score <= 1.0
    assert score > 0.9  # Sample tem boa visibilidade


def test_calculate_confidence_score_empty():
    """Testa confidence score com lista vazia"""
    score = calculate_confidence_score([])
    assert score == 0.0


def test_calculate_bilateral_symmetry():
    """Testa cálculo de simetria bilateral"""
    result = calculate_bilateral_symmetry(120.0, 118.0, tolerance=5.0)

    assert 'difference' in result
    assert 'is_symmetric' in result
    assert 'asymmetry_percentage' in result

    assert result['difference'] == 2.0
    assert result['is_symmetric'] == True  # Dentro da tolerância


def test_calculate_bilateral_symmetry_asymmetric():
    """Testa detecção de assimetria"""
    result = calculate_bilateral_symmetry(120.0, 100.0, tolerance=5.0)

    assert result['difference'] == 20.0
    assert result['is_symmetric'] == False  # Fora da tolerância


def test_validate_angle_ranges_valid():
    """Testa validação de ângulos válidos"""
    valid_angles = {
        'knee_left': 120.0,
        'knee_right': 118.0,
        'hip': 95.0,
        'trunk': 25.0,
        'ankle_left': 85.0,
        'ankle_right': 87.0
    }

    result = validate_angle_ranges(valid_angles)
    assert result['valid'] == True
    assert len(result['invalid_angles']) == 0


def test_validate_angle_ranges_invalid():
    """Testa detecção de ângulos inválidos"""
    invalid_angles = {
        'knee_left': 200.0,  # Fora do range (0-180)
        'trunk': 100.0,      # Fora do range (0-90)
    }

    result = validate_angle_ranges(invalid_angles)
    assert result['valid'] == False
    assert len(result['invalid_angles']) == 2


# ========== Testes de BiomechanicsEngine ==========

def test_biomechanics_engine_initialization():
    """Testa inicialização do engine"""
    engine = BiomechanicsEngine()
    assert engine is not None


def test_calculate_knee_angle(sample_landmarks):
    """Testa cálculo de ângulo do joelho"""
    engine = BiomechanicsEngine()
    angle = engine.calculate_knee_angle(sample_landmarks, side='left')

    assert isinstance(angle, float)
    assert 0 <= angle <= 180


def test_calculate_hip_angle(sample_landmarks):
    """Testa cálculo de ângulo do quadril"""
    engine = BiomechanicsEngine()
    angle = engine.calculate_hip_angle(sample_landmarks)

    assert isinstance(angle, float)
    assert 0 <= angle <= 180


def test_calculate_trunk_angle(sample_landmarks):
    """Testa cálculo de ângulo do tronco"""
    engine = BiomechanicsEngine()
    angle = engine.calculate_trunk_angle(sample_landmarks)

    assert isinstance(angle, float)
    assert 0 <= angle <= 90


def test_calculate_angles_squat(sample_landmarks):
    """Testa cálculo completo de ângulos para squat"""
    engine = BiomechanicsEngine()
    angles = engine.calculate_angles(sample_landmarks, 'squat')

    # Verificar que todos os ângulos esperados existem
    expected_keys = [
        'knee_left', 'knee_right', 'hip', 'trunk',
        'ankle_left', 'ankle_right',
        'knee_valgus_left', 'knee_valgus_right',
        'pelvic_tilt'
    ]

    for key in expected_keys:
        assert key in angles
        assert isinstance(angles[key], float)


def test_detect_phase_squat():
    """Testa detecção de fase do squat"""
    engine = BiomechanicsEngine()

    # Top position (joelhos estendidos)
    angles_top = {'knee_left': 170, 'knee_right': 168}
    phase = engine.detect_phase(angles_top, 'squat', frame_number=1, total_frames=10)
    assert phase == 'top'

    # Bottom position (joelhos flexionados)
    angles_bottom = {'knee_left': 80, 'knee_right': 82}
    phase = engine.detect_phase(angles_bottom, 'squat', frame_number=5, total_frames=10)
    assert phase == 'bottom'


# ========== Testes de PoseDetector ==========

@patch('mediapipe.solutions.pose.Pose')
def test_pose_detector_initialization(mock_pose):
    """Testa inicialização do PoseDetector"""
    detector = PoseDetector(
        model_complexity=1,
        min_detection_confidence=0.7,
        min_tracking_confidence=0.7
    )

    assert detector.model_complexity == 1
    assert detector.min_detection_confidence == 0.7
    assert detector.min_tracking_confidence == 0.7


@patch('cv2.imread')
@patch('mediapipe.solutions.pose.Pose')
def test_pose_detector_process_image_no_file(mock_pose, mock_imread):
    """Testa processo quando arquivo não existe"""
    mock_imread.return_value = None

    detector = PoseDetector()
    result = detector.process_image('/fake/path.jpg')

    assert result['success'] == False
    assert 'error' in result


@patch('cv2.imread')
@patch('mediapipe.solutions.pose.Pose')
def test_pose_detector_process_image_no_pose(mock_pose, mock_imread):
    """Testa processo quando nenhuma pose é detectada"""
    # Mock imagem válida
    mock_imread.return_value = np.zeros((480, 640, 3), dtype=np.uint8)

    # Mock MediaPipe sem resultados
    mock_pose_instance = MagicMock()
    mock_pose_instance.process.return_value = MagicMock(pose_landmarks=None)
    mock_pose.return_value = mock_pose_instance

    detector = PoseDetector()
    result = detector.process_image('/fake/path.jpg')

    assert result['success'] == False
    assert 'No pose detected' in result['error']


# ========== Testes de API Flask ==========

def test_health_endpoint(client):
    """Testa endpoint /health"""
    response = client.get('/health')
    data = json.loads(response.data)

    assert response.status_code == 200
    assert data['status'] == 'healthy'
    assert data['service'] == 'mediapipe-biomechanics'
    assert 'config' in data


def test_config_endpoint(client):
    """Testa endpoint /config"""
    response = client.get('/config')
    data = json.loads(response.data)

    assert response.status_code == 200
    assert 'model_complexity' in data
    assert 'max_frames_per_request' in data


def test_analyze_frames_missing_data(client):
    """Testa endpoint /analyze-frames sem dados"""
    response = client.post('/analyze-frames',
                          data=json.dumps({}),
                          content_type='application/json')
    data = json.loads(response.data)

    assert response.status_code == 400
    assert data['success'] == False
    assert 'Missing frames data' in data['error']


def test_analyze_frames_too_many_frames(client):
    """Testa endpoint /analyze-frames com muitos frames"""
    frames = [{'path': f'/tmp/frame_{i}.jpg', 'timestamp_ms': i*100} for i in range(50)]

    response = client.post('/analyze-frames',
                          data=json.dumps({'frames': frames}),
                          content_type='application/json')
    data = json.loads(response.data)

    assert response.status_code == 400
    assert data['success'] == False
    assert 'Too many frames' in data['error']


def test_analyze_single_frame_missing_path(client):
    """Testa endpoint /analyze-single-frame sem path"""
    response = client.post('/analyze-single-frame',
                          data=json.dumps({}),
                          content_type='application/json')
    data = json.loads(response.data)

    assert response.status_code == 400
    assert data['success'] == False
    assert 'Missing frame_path' in data['error']


def test_analyze_single_frame_file_not_found(client):
    """Testa endpoint /analyze-single-frame com arquivo inexistente"""
    response = client.post('/analyze-single-frame',
                          data=json.dumps({'frame_path': '/fake/path.jpg'}),
                          content_type='application/json')
    data = json.loads(response.data)

    assert response.status_code == 404
    assert data['success'] == False
    assert 'not found' in data['error']


def test_404_handler(client):
    """Testa handler de 404"""
    response = client.get('/nonexistent-endpoint')
    data = json.loads(response.data)

    assert response.status_code == 404
    assert 'not found' in data['error']


# ========== Testes de Integração ==========

@pytest.mark.integration
@patch('pose_detector.PoseDetector.process_image')
def test_analyze_frames_integration(mock_process_image, client, sample_landmarks):
    """Teste de integração completo do pipeline"""
    # Mock do resultado do PoseDetector
    mock_process_image.return_value = {
        'success': True,
        'landmarks_3d': sample_landmarks,
        'landmarks_normalized': np.array([[0.5, 0.5, 0, 0.9]] * 33)
    }

    # Request
    frames_input = [
        {'path': '/tmp/frame_001.jpg', 'timestamp_ms': 0},
        {'path': '/tmp/frame_002.jpg', 'timestamp_ms': 500}
    ]

    response = client.post('/analyze-frames',
                          data=json.dumps({
                              'frames': frames_input,
                              'exercise_type': 'squat'
                          }),
                          content_type='application/json')

    data = json.loads(response.data)

    # Validações
    assert response.status_code == 200
    assert data['success'] == True
    assert len(data['frames']) == 2

    # Verificar primeiro frame
    frame1 = data['frames'][0]
    assert frame1['frame_number'] == 1
    assert frame1['timestamp_ms'] == 0
    assert 'phase' in frame1
    assert 'confidence' in frame1
    assert 'angles' in frame1
    assert 'knee_left' in frame1['angles']

    # Verificar estatísticas
    assert 'statistics' in data
    assert data['statistics']['frames_processed'] == 2


# ========== Testes de Performance ==========

@pytest.mark.performance
def test_angle_calculation_performance(sample_landmarks):
    """Testa performance do cálculo de ângulos"""
    import time

    engine = BiomechanicsEngine()

    start = time.time()
    for _ in range(1000):
        engine.calculate_angles(sample_landmarks, 'squat')
    end = time.time()

    avg_time = (end - start) / 1000
    assert avg_time < 0.001  # Menos de 1ms por frame


if __name__ == '__main__':
    pytest.main([__file__, '-v', '--cov=.', '--cov-report=term-missing'])
