"""
Engine de cálculos biomecânicos.
Calcula ângulos articulares e detecta fases do movimento para diferentes exercícios.
"""

import numpy as np
from typing import List, Dict, Any, Tuple, Optional
import logging
import math

logger = logging.getLogger(__name__)


class BiomechanicsEngine:
    """
    Engine para cálculos biomecânicos de análise de movimento.
    Suporta múltiplos exercícios com cálculos específicos de ângulos.
    """

    # Mapeamento de IDs de landmarks do MediaPipe
    LANDMARK_IDS = {
        'nose': 0,
        'left_shoulder': 11,
        'right_shoulder': 12,
        'left_elbow': 13,
        'right_elbow': 14,
        'left_wrist': 15,
        'right_wrist': 16,
        'left_hip': 23,
        'right_hip': 24,
        'left_knee': 25,
        'right_knee': 26,
        'left_ankle': 27,
        'right_ankle': 28,
        'left_heel': 29,
        'right_heel': 30,
        'left_foot_index': 31,
        'right_foot_index': 32,
    }

    def __init__(self):
        """Inicializa o engine biomecânico."""
        logger.info("BiomechanicsEngine initialized")

    def calculate_angles(
        self,
        landmarks: List[Dict[str, Any]],
        exercise_type: str
    ) -> Dict[str, float]:
        """
        Calcula todos os ângulos relevantes para o exercício.

        Args:
            landmarks: Lista de landmarks 3D do MediaPipe
            exercise_type: Tipo de exercício (squat, deadlift, etc)

        Returns:
            Dict com ângulos calculados
        """
        try:
            if exercise_type in ['squat', 'back-squat', 'front-squat', 'goblet-squat']:
                return self._calculate_squat_angles(landmarks)
            elif exercise_type in ['deadlift', 'romanian-deadlift']:
                return self._calculate_deadlift_angles(landmarks)
            elif exercise_type in ['bench-press']:
                return self._calculate_bench_press_angles(landmarks)
            elif exercise_type in ['overhead-press', 'military-press']:
                return self._calculate_overhead_press_angles(landmarks)
            else:
                logger.warning(f"Unknown exercise type: {exercise_type}, using squat angles")
                return self._calculate_squat_angles(landmarks)

        except Exception as e:
            logger.error(f"Error calculating angles: {str(e)}")
            return self._get_default_angles()

    def _calculate_squat_angles(self, landmarks: List[Dict]) -> Dict[str, float]:
        """
        Calcula ângulos específicos para agachamento.

        Returns:
            Dict com: knee_left, knee_right, hip, trunk, ankle_left, ankle_right,
                     knee_valgus_left, knee_valgus_right, pelvic_tilt
        """
        angles = {}

        # Ângulos de joelho (esquerdo e direito)
        angles['knee_left'] = self.calculate_knee_angle(landmarks, side='left')
        angles['knee_right'] = self.calculate_knee_angle(landmarks, side='right')

        # Ângulo de quadril
        angles['hip'] = self.calculate_hip_angle(landmarks)

        # Ângulo do tronco (inclinação para frente)
        angles['trunk'] = self.calculate_trunk_angle(landmarks)

        # Ângulos de tornozelo
        angles['ankle_left'] = self.calculate_ankle_angle(landmarks, side='left')
        angles['ankle_right'] = self.calculate_ankle_angle(landmarks, side='right')

        # Valgo de joelho (indicador de knee valgus)
        angles['knee_valgus_left'] = self.calculate_valgus_angle(landmarks, side='left')
        angles['knee_valgus_right'] = self.calculate_valgus_angle(landmarks, side='right')

        # Inclinação pélvica (butt wink detection)
        angles['pelvic_tilt'] = self.calculate_pelvic_tilt(landmarks)

        return angles

    def _calculate_deadlift_angles(self, landmarks: List[Dict]) -> Dict[str, float]:
        """Calcula ângulos para levantamento terra."""
        angles = {}

        angles['knee_left'] = self.calculate_knee_angle(landmarks, side='left')
        angles['knee_right'] = self.calculate_knee_angle(landmarks, side='right')
        angles['hip'] = self.calculate_hip_angle(landmarks)
        angles['trunk'] = self.calculate_trunk_angle(landmarks)
        angles['back_angle'] = self.calculate_back_angle(landmarks)

        return angles

    def _calculate_bench_press_angles(self, landmarks: List[Dict]) -> Dict[str, float]:
        """Calcula ângulos para supino."""
        angles = {}

        angles['elbow_left'] = self.calculate_elbow_angle(landmarks, side='left')
        angles['elbow_right'] = self.calculate_elbow_angle(landmarks, side='right')
        angles['shoulder_left'] = self.calculate_shoulder_angle(landmarks, side='left')
        angles['shoulder_right'] = self.calculate_shoulder_angle(landmarks, side='right')

        return angles

    def _calculate_overhead_press_angles(self, landmarks: List[Dict]) -> Dict[str, float]:
        """Calcula ângulos para desenvolvimento."""
        angles = {}

        angles['elbow_left'] = self.calculate_elbow_angle(landmarks, side='left')
        angles['elbow_right'] = self.calculate_elbow_angle(landmarks, side='right')
        angles['shoulder_left'] = self.calculate_shoulder_angle(landmarks, side='left')
        angles['shoulder_right'] = self.calculate_shoulder_angle(landmarks, side='right')
        angles['trunk'] = self.calculate_trunk_angle(landmarks)

        return angles

    def calculate_knee_angle(self, landmarks: List[Dict], side: str) -> float:
        """
        Calcula ângulo do joelho (hip -> knee -> ankle).

        Args:
            landmarks: Lista de landmarks
            side: 'left' ou 'right'

        Returns:
            Ângulo em graus (0-180)
        """
        hip = self._get_landmark(landmarks, f'{side}_hip')
        knee = self._get_landmark(landmarks, f'{side}_knee')
        ankle = self._get_landmark(landmarks, f'{side}_ankle')

        if not all([hip, knee, ankle]):
            return 0.0

        angle = self._calculate_angle_3d(
            [hip['x'], hip['y'], hip['z']],
            [knee['x'], knee['y'], knee['z']],
            [ankle['x'], ankle['y'], ankle['z']]
        )

        return round(angle, 1)

    def calculate_hip_angle(self, landmarks: List[Dict]) -> float:
        """
        Calcula ângulo do quadril (shoulder -> hip -> knee).
        Usa média dos dois lados.

        Returns:
            Ângulo em graus (0-180)
        """
        left_shoulder = self._get_landmark(landmarks, 'left_shoulder')
        left_hip = self._get_landmark(landmarks, 'left_hip')
        left_knee = self._get_landmark(landmarks, 'left_knee')

        right_shoulder = self._get_landmark(landmarks, 'right_shoulder')
        right_hip = self._get_landmark(landmarks, 'right_hip')
        right_knee = self._get_landmark(landmarks, 'right_knee')

        if not all([left_shoulder, left_hip, left_knee, right_shoulder, right_hip, right_knee]):
            return 0.0

        angle_left = self._calculate_angle_3d(
            [left_shoulder['x'], left_shoulder['y'], left_shoulder['z']],
            [left_hip['x'], left_hip['y'], left_hip['z']],
            [left_knee['x'], left_knee['y'], left_knee['z']]
        )

        angle_right = self._calculate_angle_3d(
            [right_shoulder['x'], right_shoulder['y'], right_shoulder['z']],
            [right_hip['x'], right_hip['y'], right_hip['z']],
            [right_knee['x'], right_knee['y'], right_knee['z']]
        )

        # Média dos dois lados
        return round((angle_left + angle_right) / 2, 1)

    def calculate_trunk_angle(self, landmarks: List[Dict]) -> float:
        """
        Calcula ângulo do tronco em relação à vertical.
        0° = vertical, 90° = horizontal

        Returns:
            Ângulo em graus (0-90)
        """
        # Usar média dos ombros e quadris para linha do tronco
        left_shoulder = self._get_landmark(landmarks, 'left_shoulder')
        right_shoulder = self._get_landmark(landmarks, 'right_shoulder')
        left_hip = self._get_landmark(landmarks, 'left_hip')
        right_hip = self._get_landmark(landmarks, 'right_hip')

        if not all([left_shoulder, right_shoulder, left_hip, right_hip]):
            return 0.0

        # Ponto médio dos ombros
        shoulder_mid = {
            'x': (left_shoulder['x'] + right_shoulder['x']) / 2,
            'y': (left_shoulder['y'] + right_shoulder['y']) / 2,
            'z': (left_shoulder['z'] + right_shoulder['z']) / 2
        }

        # Ponto médio dos quadris
        hip_mid = {
            'x': (left_hip['x'] + right_hip['x']) / 2,
            'y': (left_hip['y'] + right_hip['y']) / 2,
            'z': (left_hip['z'] + right_hip['z']) / 2
        }

        # Vetor do tronco
        trunk_vector = np.array([
            shoulder_mid['x'] - hip_mid['x'],
            shoulder_mid['y'] - hip_mid['y'],
            0  # Ignorar profundidade para ângulo 2D
        ])

        # Vetor vertical (eixo Y aponta para baixo no OpenCV)
        vertical_vector = np.array([0, -1, 0])

        # Calcular ângulo
        angle = self._angle_between_vectors(trunk_vector, vertical_vector)

        return round(angle, 1)

    def calculate_ankle_angle(self, landmarks: List[Dict], side: str) -> float:
        """
        Calcula ângulo do tornozelo (knee -> ankle -> foot_index).

        Args:
            landmarks: Lista de landmarks
            side: 'left' ou 'right'

        Returns:
            Ângulo em graus (0-180)
        """
        knee = self._get_landmark(landmarks, f'{side}_knee')
        ankle = self._get_landmark(landmarks, f'{side}_ankle')
        foot = self._get_landmark(landmarks, f'{side}_foot_index')

        if not all([knee, ankle, foot]):
            return 90.0  # Default para ângulo neutro

        angle = self._calculate_angle_3d(
            [knee['x'], knee['y'], knee['z']],
            [ankle['x'], ankle['y'], ankle['z']],
            [foot['x'], foot['y'], foot['z']]
        )

        return round(angle, 1)

    def calculate_valgus_angle(self, landmarks: List[Dict], side: str) -> float:
        """
        Calcula ângulo de valgo do joelho (indicador de knee valgus).
        Mede desvio medial do joelho em relação ao quadril e tornozelo.

        Args:
            landmarks: Lista de landmarks
            side: 'left' ou 'right'

        Returns:
            Ângulo de valgo em graus (0 = alinhado, positivo = valgo)
        """
        hip = self._get_landmark(landmarks, f'{side}_hip')
        knee = self._get_landmark(landmarks, f'{side}_knee')
        ankle = self._get_landmark(landmarks, f'{side}_ankle')

        if not all([hip, knee, ankle]):
            return 0.0

        # Calcular desvio lateral (eixo X)
        # Se joelho estiver mais medial que a linha hip-ankle, há valgo
        hip_ankle_x = (hip['x'] + ankle['x']) / 2
        knee_deviation = abs(knee['x'] - hip_ankle_x)

        # Normalizar pelo tamanho da perna (distância hip-ankle)
        leg_length = np.sqrt(
            (hip['x'] - ankle['x'])**2 +
            (hip['y'] - ankle['y'])**2
        )

        if leg_length == 0:
            return 0.0

        # Converter desvio para ângulo aproximado
        valgus_ratio = knee_deviation / leg_length
        valgus_angle = math.degrees(math.atan(valgus_ratio))

        return round(valgus_angle, 1)

    def calculate_pelvic_tilt(self, landmarks: List[Dict]) -> float:
        """
        Calcula inclinação pélvica (indicador de butt wink).
        Mede ângulo entre linha dos quadris e horizontal.

        Returns:
            Ângulo de inclinação em graus (0 = neutro, positivo = posterior tilt)
        """
        left_hip = self._get_landmark(landmarks, 'left_hip')
        right_hip = self._get_landmark(landmarks, 'right_hip')

        if not all([left_hip, right_hip]):
            return 0.0

        # Vetor da linha dos quadris
        hip_vector = np.array([
            right_hip['x'] - left_hip['x'],
            right_hip['y'] - left_hip['y'],
            0
        ])

        # Vetor horizontal
        horizontal = np.array([1, 0, 0])

        # Calcular ângulo
        angle = self._angle_between_vectors(hip_vector, horizontal)

        return round(angle, 1)

    def calculate_elbow_angle(self, landmarks: List[Dict], side: str) -> float:
        """Calcula ângulo do cotovelo (shoulder -> elbow -> wrist)."""
        shoulder = self._get_landmark(landmarks, f'{side}_shoulder')
        elbow = self._get_landmark(landmarks, f'{side}_elbow')
        wrist = self._get_landmark(landmarks, f'{side}_wrist')

        if not all([shoulder, elbow, wrist]):
            return 0.0

        angle = self._calculate_angle_3d(
            [shoulder['x'], shoulder['y'], shoulder['z']],
            [elbow['x'], elbow['y'], elbow['z']],
            [wrist['x'], wrist['y'], wrist['z']]
        )

        return round(angle, 1)

    def calculate_shoulder_angle(self, landmarks: List[Dict], side: str) -> float:
        """Calcula ângulo do ombro (hip -> shoulder -> elbow)."""
        hip = self._get_landmark(landmarks, f'{side}_hip')
        shoulder = self._get_landmark(landmarks, f'{side}_shoulder')
        elbow = self._get_landmark(landmarks, f'{side}_elbow')

        if not all([hip, shoulder, elbow]):
            return 0.0

        angle = self._calculate_angle_3d(
            [hip['x'], hip['y'], hip['z']],
            [shoulder['x'], shoulder['y'], shoulder['z']],
            [elbow['x'], elbow['y'], elbow['z']]
        )

        return round(angle, 1)

    def calculate_back_angle(self, landmarks: List[Dict]) -> float:
        """
        Calcula ângulo da coluna (para deadlift).
        Mede ângulo entre linha shoulder-hip e vertical.
        """
        return self.calculate_trunk_angle(landmarks)

    def detect_phase(
        self,
        angles: Dict[str, float],
        exercise_type: str,
        frame_number: int,
        total_frames: int
    ) -> str:
        """
        Detecta fase do movimento baseado nos ângulos.

        Args:
            angles: Dict com ângulos calculados
            exercise_type: Tipo de exercício
            frame_number: Número do frame atual
            total_frames: Total de frames

        Returns:
            Fase do movimento: 'eccentric', 'bottom', 'concentric', 'top'
        """
        try:
            if exercise_type in ['squat', 'back-squat', 'front-squat', 'goblet-squat']:
                return self._detect_squat_phase(angles, frame_number, total_frames)
            elif exercise_type in ['deadlift', 'romanian-deadlift']:
                return self._detect_deadlift_phase(angles, frame_number, total_frames)
            else:
                return self._detect_generic_phase(frame_number, total_frames)

        except Exception as e:
            logger.error(f"Error detecting phase: {str(e)}")
            return 'unknown'

    def _detect_squat_phase(
        self,
        angles: Dict[str, float],
        frame_number: int,
        total_frames: int
    ) -> str:
        """
        Detecta fase do agachamento baseado no ângulo do joelho.

        Fases:
        - top: Posição inicial/final (joelho > 150°)
        - eccentric: Descida (joelho diminuindo)
        - bottom: Ponto mais baixo (joelho < 100°)
        - concentric: Subida (joelho aumentando)
        """
        knee_angle = (angles.get('knee_left', 0) + angles.get('knee_right', 0)) / 2

        # Heurística simples baseada em thresholds
        if knee_angle > 150:
            return 'top'
        elif knee_angle < 100:
            return 'bottom'
        else:
            # Usar posição relativa no vídeo como aproximação
            relative_position = frame_number / total_frames
            if relative_position < 0.4:
                return 'eccentric'
            elif relative_position < 0.6:
                return 'bottom'
            else:
                return 'concentric'

    def _detect_deadlift_phase(
        self,
        angles: Dict[str, float],
        frame_number: int,
        total_frames: int
    ) -> str:
        """Detecta fase do deadlift."""
        hip_angle = angles.get('hip', 0)

        if hip_angle > 150:
            return 'top'
        elif hip_angle < 90:
            return 'bottom'
        else:
            relative_position = frame_number / total_frames
            if relative_position < 0.5:
                return 'concentric'  # Subida
            else:
                return 'eccentric'   # Descida

    def _detect_generic_phase(self, frame_number: int, total_frames: int) -> str:
        """Detecção genérica baseada apenas na posição relativa."""
        relative_position = frame_number / total_frames

        if relative_position < 0.25:
            return 'eccentric'
        elif relative_position < 0.5:
            return 'bottom'
        elif relative_position < 0.75:
            return 'concentric'
        else:
            return 'top'

    # ========== Funções Auxiliares ==========

    def _get_landmark(self, landmarks: List[Dict], name: str) -> Optional[Dict]:
        """Busca landmark por nome."""
        for landmark in landmarks:
            if landmark.get('name') == name:
                return landmark
        return None

    def _calculate_angle_3d(
        self,
        point_a: List[float],
        point_b: List[float],
        point_c: List[float]
    ) -> float:
        """
        Calcula ângulo formado por 3 pontos no espaço 3D (A -> B -> C).

        Args:
            point_a: Primeiro ponto [x, y, z]
            point_b: Ponto do vértice [x, y, z]
            point_c: Terceiro ponto [x, y, z]

        Returns:
            Ângulo em graus (0-180)
        """
        a = np.array(point_a)
        b = np.array(point_b)
        c = np.array(point_c)

        # Vetores BA e BC
        ba = a - b
        bc = c - b

        # Calcular ângulo
        angle = self._angle_between_vectors(ba, bc)

        return angle

    def _angle_between_vectors(self, v1: np.ndarray, v2: np.ndarray) -> float:
        """
        Calcula ângulo entre dois vetores.

        Args:
            v1: Primeiro vetor
            v2: Segundo vetor

        Returns:
            Ângulo em graus (0-180)
        """
        # Normalizar vetores
        v1_norm = np.linalg.norm(v1)
        v2_norm = np.linalg.norm(v2)

        if v1_norm == 0 or v2_norm == 0:
            return 0.0

        v1_unit = v1 / v1_norm
        v2_unit = v2 / v2_norm

        # Produto escalar
        dot_product = np.dot(v1_unit, v2_unit)

        # Clamp para evitar erros numéricos
        dot_product = np.clip(dot_product, -1.0, 1.0)

        # Calcular ângulo
        angle_rad = np.arccos(dot_product)
        angle_deg = np.degrees(angle_rad)

        return float(angle_deg)

    def _get_default_angles(self) -> Dict[str, float]:
        """Retorna ângulos padrão em caso de erro."""
        return {
            'knee_left': 0.0,
            'knee_right': 0.0,
            'hip': 0.0,
            'trunk': 0.0,
            'ankle_left': 90.0,
            'ankle_right': 90.0,
            'knee_valgus_left': 0.0,
            'knee_valgus_right': 0.0,
            'pelvic_tilt': 0.0
        }
