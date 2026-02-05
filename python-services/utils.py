"""
Funções auxiliares para o serviço MediaPipe.
"""

import numpy as np
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)


def validate_frame_data(frame_data: Dict[str, Any]) -> bool:
    """
    Valida estrutura de dados de um frame.

    Args:
        frame_data: Dict com dados do frame

    Returns:
        True se válido, False caso contrário
    """
    if not isinstance(frame_data, dict):
        logger.warning("Frame data is not a dict")
        return False

    required_fields = ['path', 'timestamp_ms']
    for field in required_fields:
        if field not in frame_data:
            logger.warning(f"Missing required field: {field}")
            return False

    # Validar tipos
    if not isinstance(frame_data['path'], str):
        logger.warning("Frame path must be a string")
        return False

    if not isinstance(frame_data['timestamp_ms'], (int, float)):
        logger.warning("Frame timestamp_ms must be a number")
        return False

    return True


def calculate_confidence_score(landmarks: List[Dict[str, Any]]) -> float:
    """
    Calcula score de confiança baseado na visibilidade dos landmarks.

    Args:
        landmarks: Lista de landmarks 3D

    Returns:
        Score de confiança (0.0-1.0)
    """
    if not landmarks:
        return 0.0

    # Landmarks críticos para análise biomecânica
    critical_landmarks = [
        'left_shoulder', 'right_shoulder',
        'left_hip', 'right_hip',
        'left_knee', 'right_knee',
        'left_ankle', 'right_ankle'
    ]

    total_visibility = 0.0
    count = 0

    for landmark in landmarks:
        name = landmark.get('name', '')
        visibility = landmark.get('visibility', 0.0)

        # Dar peso maior aos landmarks críticos
        if name in critical_landmarks:
            total_visibility += visibility * 1.5  # 50% mais peso
            count += 1.5
        else:
            total_visibility += visibility
            count += 1

    if count == 0:
        return 0.0

    confidence = total_visibility / count

    # Normalizar para 0-1
    confidence = min(1.0, max(0.0, confidence))

    return confidence


def normalize_landmarks(
    landmarks: List[Dict[str, Any]],
    image_width: int,
    image_height: int
) -> List[Dict[str, Any]]:
    """
    Normaliza coordenadas de landmarks para range 0-1.

    Args:
        landmarks: Lista de landmarks com coordenadas em pixels
        image_width: Largura da imagem
        image_height: Altura da imagem

    Returns:
        Lista de landmarks normalizados
    """
    normalized = []

    for landmark in landmarks:
        normalized_landmark = landmark.copy()

        # Normalizar x e y
        if 'x' in landmark:
            normalized_landmark['x_norm'] = landmark['x'] / image_width
        if 'y' in landmark:
            normalized_landmark['y_norm'] = landmark['y'] / image_height

        normalized.append(normalized_landmark)

    return normalized


def calculate_bilateral_symmetry(
    left_angle: float,
    right_angle: float,
    tolerance: float = 5.0
) -> Dict[str, Any]:
    """
    Calcula simetria bilateral entre ângulos esquerdo e direito.

    Args:
        left_angle: Ângulo do lado esquerdo
        right_angle: Ângulo do lado direito
        tolerance: Tolerância em graus para considerar simétrico

    Returns:
        Dict com:
            - difference: Diferença absoluta
            - is_symmetric: True se dentro da tolerância
            - asymmetry_percentage: Percentual de assimetria
    """
    difference = abs(left_angle - right_angle)

    # Calcular percentual de assimetria
    avg_angle = (left_angle + right_angle) / 2
    if avg_angle > 0:
        asymmetry_percentage = (difference / avg_angle) * 100
    else:
        asymmetry_percentage = 0.0

    return {
        'difference': round(difference, 2),
        'is_symmetric': difference <= tolerance,
        'asymmetry_percentage': round(asymmetry_percentage, 2)
    }


def filter_low_confidence_landmarks(
    landmarks: List[Dict[str, Any]],
    min_confidence: float = 0.5
) -> List[Dict[str, Any]]:
    """
    Filtra landmarks com baixa confiança.

    Args:
        landmarks: Lista de landmarks
        min_confidence: Confiança mínima (0.0-1.0)

    Returns:
        Lista filtrada de landmarks
    """
    filtered = []

    for landmark in landmarks:
        visibility = landmark.get('visibility', 0.0)
        if visibility >= min_confidence:
            filtered.append(landmark)
        else:
            logger.debug(f"Filtered out landmark {landmark.get('name')} with visibility {visibility}")

    return filtered


def smooth_angle_sequence(
    angles: List[float],
    window_size: int = 3
) -> List[float]:
    """
    Suaviza sequência de ângulos usando média móvel.

    Args:
        angles: Lista de ângulos
        window_size: Tamanho da janela de suavização

    Returns:
        Lista de ângulos suavizados
    """
    if len(angles) < window_size:
        return angles

    smoothed = []

    for i in range(len(angles)):
        start = max(0, i - window_size // 2)
        end = min(len(angles), i + window_size // 2 + 1)

        window = angles[start:end]
        smoothed_value = sum(window) / len(window)
        smoothed.append(smoothed_value)

    return smoothed


def calculate_movement_speed(
    angle_sequence: List[float],
    timestamps_ms: List[int]
) -> Dict[str, float]:
    """
    Calcula velocidade do movimento baseado em mudanças de ângulo.

    Args:
        angle_sequence: Sequência de ângulos
        timestamps_ms: Timestamps em milissegundos

    Returns:
        Dict com:
            - avg_speed: Velocidade média (graus/segundo)
            - max_speed: Velocidade máxima
            - min_speed: Velocidade mínima
    """
    if len(angle_sequence) < 2 or len(timestamps_ms) < 2:
        return {'avg_speed': 0.0, 'max_speed': 0.0, 'min_speed': 0.0}

    speeds = []

    for i in range(1, len(angle_sequence)):
        angle_diff = abs(angle_sequence[i] - angle_sequence[i-1])
        time_diff_sec = (timestamps_ms[i] - timestamps_ms[i-1]) / 1000.0

        if time_diff_sec > 0:
            speed = angle_diff / time_diff_sec
            speeds.append(speed)

    if not speeds:
        return {'avg_speed': 0.0, 'max_speed': 0.0, 'min_speed': 0.0}

    return {
        'avg_speed': round(sum(speeds) / len(speeds), 2),
        'max_speed': round(max(speeds), 2),
        'min_speed': round(min(speeds), 2)
    }


def detect_outliers(
    values: List[float],
    threshold: float = 2.0
) -> List[int]:
    """
    Detecta outliers em uma sequência de valores usando z-score.

    Args:
        values: Lista de valores
        threshold: Threshold de z-score (padrão: 2.0)

    Returns:
        Lista de índices dos outliers
    """
    if len(values) < 3:
        return []

    values_array = np.array(values)
    mean = np.mean(values_array)
    std = np.std(values_array)

    if std == 0:
        return []

    z_scores = np.abs((values_array - mean) / std)
    outlier_indices = np.where(z_scores > threshold)[0].tolist()

    return outlier_indices


def interpolate_missing_landmarks(
    landmarks: List[Dict[str, Any]],
    required_landmarks: List[str]
) -> List[Dict[str, Any]]:
    """
    Interpola landmarks faltantes baseado em landmarks vizinhos.

    Args:
        landmarks: Lista de landmarks
        required_landmarks: Lista de nomes de landmarks necessários

    Returns:
        Lista de landmarks com interpolações
    """
    # Criar mapa de landmarks existentes
    landmark_map = {lm.get('name'): lm for lm in landmarks if lm.get('name')}

    # Verificar landmarks faltantes
    missing = [name for name in required_landmarks if name not in landmark_map]

    if not missing:
        return landmarks

    # Interpolação simples: usar média de landmarks relacionados
    interpolated = landmarks.copy()

    for missing_name in missing:
        logger.debug(f"Interpolating missing landmark: {missing_name}")

        # Exemplo: interpolar joelho esquerdo faltante
        if missing_name == 'left_knee':
            left_hip = landmark_map.get('left_hip')
            left_ankle = landmark_map.get('left_ankle')

            if left_hip and left_ankle:
                interpolated_landmark = {
                    'id': -1,
                    'name': missing_name,
                    'x': (left_hip['x'] + left_ankle['x']) / 2,
                    'y': (left_hip['y'] + left_ankle['y']) / 2,
                    'z': (left_hip['z'] + left_ankle['z']) / 2,
                    'visibility': min(left_hip['visibility'], left_ankle['visibility']),
                    'interpolated': True
                }
                interpolated.append(interpolated_landmark)

    return interpolated


def format_error_response(
    error: Exception,
    stage: str = 'unknown',
    include_traceback: bool = False
) -> Dict[str, Any]:
    """
    Formata resposta de erro padronizada.

    Args:
        error: Exception
        stage: Estágio onde ocorreu o erro
        include_traceback: Se deve incluir traceback completo

    Returns:
        Dict com informações do erro
    """
    import traceback

    error_response = {
        'success': False,
        'error': str(error),
        'error_type': type(error).__name__,
        'stage': stage
    }

    if include_traceback:
        error_response['traceback'] = traceback.format_exc()

    return error_response


def validate_angle_ranges(angles: Dict[str, float]) -> Dict[str, Any]:
    """
    Valida se ângulos estão em ranges biomecânicos válidos.

    Args:
        angles: Dict de ângulos

    Returns:
        Dict com:
            - valid: True se todos válidos
            - invalid_angles: Lista de ângulos inválidos
    """
    # Ranges biomecânicos esperados (min, max)
    expected_ranges = {
        'knee_left': (0, 180),
        'knee_right': (0, 180),
        'hip': (0, 180),
        'trunk': (0, 90),
        'ankle_left': (0, 180),
        'ankle_right': (0, 180),
        'knee_valgus_left': (0, 45),
        'knee_valgus_right': (0, 45),
        'pelvic_tilt': (-30, 30),
    }

    invalid_angles = []

    for angle_name, angle_value in angles.items():
        if angle_name in expected_ranges:
            min_val, max_val = expected_ranges[angle_name]
            if not (min_val <= angle_value <= max_val):
                invalid_angles.append({
                    'name': angle_name,
                    'value': angle_value,
                    'expected_range': (min_val, max_val)
                })
                logger.warning(
                    f"Angle {angle_name} = {angle_value}° outside expected range [{min_val}, {max_val}]"
                )

    return {
        'valid': len(invalid_angles) == 0,
        'invalid_angles': invalid_angles
    }


def calculate_frame_quality_score(
    landmarks: List[Dict[str, Any]],
    image_width: int,
    image_height: int
) -> Dict[str, Any]:
    """
    Calcula score de qualidade do frame para análise.

    Args:
        landmarks: Lista de landmarks
        image_width: Largura da imagem
        image_height: Altura da imagem

    Returns:
        Dict com:
            - quality_score: Score 0-1
            - factors: Fatores que influenciaram o score
    """
    factors = {}
    weights = {}

    # Fator 1: Confiança média dos landmarks
    confidence = calculate_confidence_score(landmarks)
    factors['confidence'] = confidence
    weights['confidence'] = 0.4

    # Fator 2: Completude (% de landmarks detectados)
    expected_landmark_count = 33  # MediaPipe Pose tem 33 landmarks
    completeness = len(landmarks) / expected_landmark_count
    factors['completeness'] = completeness
    weights['completeness'] = 0.3

    # Fator 3: Tamanho do corpo no frame (deve ser ~50-80% da imagem)
    if landmarks:
        y_coords = [lm['y'] for lm in landmarks if 'y' in lm]
        if y_coords:
            body_height = max(y_coords) - min(y_coords)
            body_height_ratio = body_height / image_height

            # Ideal: 0.5-0.8
            if 0.5 <= body_height_ratio <= 0.8:
                size_score = 1.0
            else:
                size_score = max(0, 1.0 - abs(body_height_ratio - 0.65) / 0.65)

            factors['body_size'] = size_score
            weights['body_size'] = 0.3
        else:
            factors['body_size'] = 0.0
            weights['body_size'] = 0.3
    else:
        factors['body_size'] = 0.0
        weights['body_size'] = 0.3

    # Calcular score ponderado
    quality_score = sum(factors[k] * weights[k] for k in factors.keys())

    return {
        'quality_score': round(quality_score, 3),
        'factors': factors
    }
