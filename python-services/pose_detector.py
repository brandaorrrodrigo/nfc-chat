"""
Wrapper para MediaPipe Pose Detection.
Encapsula a lógica de detecção de pose e extração de landmarks.
"""

import mediapipe as mp
import cv2
import numpy as np
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)


class PoseDetector:
    """
    Wrapper para MediaPipe Pose que facilita detecção de landmarks 3D.
    """

    # Mapeamento de landmarks do MediaPipe
    LANDMARK_NAMES = {
        0: 'nose',
        11: 'left_shoulder',
        12: 'right_shoulder',
        13: 'left_elbow',
        14: 'right_elbow',
        15: 'left_wrist',
        16: 'right_wrist',
        23: 'left_hip',
        24: 'right_hip',
        25: 'left_knee',
        26: 'right_knee',
        27: 'left_ankle',
        28: 'right_ankle',
        29: 'left_heel',
        30: 'right_heel',
        31: 'left_foot_index',
        32: 'right_foot_index',
    }

    def __init__(
        self,
        model_complexity: int = 1,
        min_detection_confidence: float = 0.7,
        min_tracking_confidence: float = 0.7
    ):
        """
        Inicializa MediaPipe Pose.

        Args:
            model_complexity: 0 (lite), 1 (full), 2 (heavy)
            min_detection_confidence: Confiança mínima para detecção (0.0-1.0)
            min_tracking_confidence: Confiança mínima para tracking (0.0-1.0)
        """
        self.model_complexity = model_complexity
        self.min_detection_confidence = min_detection_confidence
        self.min_tracking_confidence = min_tracking_confidence

        # Inicializar MediaPipe Pose
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=True,  # Processar cada imagem independentemente
            model_complexity=model_complexity,
            enable_segmentation=False,  # Não precisamos de segmentação
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )

        logger.info(f"PoseDetector initialized with model_complexity={model_complexity}")

    def process_image(self, image_path: str) -> Dict[str, Any]:
        """
        Processa uma imagem e extrai landmarks de pose.

        Args:
            image_path: Caminho para a imagem

        Returns:
            Dict contendo:
                - success: bool
                - landmarks_3d: List de landmarks com coordenadas 3D
                - landmarks_normalized: Array numpy normalizado
                - world_landmarks: Landmarks em coordenadas do mundo real
                - error: Mensagem de erro (se falhar)
        """
        try:
            # Carregar imagem
            image = cv2.imread(image_path)
            if image is None:
                return {
                    'success': False,
                    'error': f'Failed to load image: {image_path}'
                }

            # Converter BGR (OpenCV) para RGB (MediaPipe)
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Processar com MediaPipe
            results = self.pose.process(image_rgb)

            if not results.pose_landmarks:
                return {
                    'success': False,
                    'error': 'No pose detected in image'
                }

            # Extrair landmarks normalizados (0-1)
            landmarks_normalized = self._extract_landmarks_normalized(results.pose_landmarks)

            # Extrair landmarks 3D (com coordenadas de imagem + profundidade)
            landmarks_3d = self._extract_landmarks_3d(
                results.pose_landmarks,
                image.shape[1],  # width
                image.shape[0]   # height
            )

            # Extrair world landmarks (coordenadas do mundo real em metros)
            world_landmarks = None
            if results.pose_world_landmarks:
                world_landmarks = self._extract_world_landmarks(results.pose_world_landmarks)

            return {
                'success': True,
                'landmarks_3d': landmarks_3d,
                'landmarks_normalized': landmarks_normalized,
                'world_landmarks': world_landmarks,
                'image_shape': {
                    'width': image.shape[1],
                    'height': image.shape[0]
                }
            }

        except Exception as e:
            logger.error(f"Error processing image {image_path}: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

    def _extract_landmarks_normalized(self, pose_landmarks) -> np.ndarray:
        """
        Extrai landmarks normalizados (0-1) como array numpy.

        Args:
            pose_landmarks: MediaPipe pose landmarks

        Returns:
            Array numpy de shape (33, 4) com [x, y, z, visibility]
        """
        landmarks = []
        for landmark in pose_landmarks.landmark:
            landmarks.append([
                landmark.x,
                landmark.y,
                landmark.z,
                landmark.visibility
            ])
        return np.array(landmarks, dtype=np.float32)

    def _extract_landmarks_3d(
        self,
        pose_landmarks,
        image_width: int,
        image_height: int
    ) -> List[Dict[str, Any]]:
        """
        Extrai landmarks 3D com coordenadas em pixels + profundidade relativa.

        Args:
            pose_landmarks: MediaPipe pose landmarks
            image_width: Largura da imagem
            image_height: Altura da imagem

        Returns:
            Lista de dicts com landmarks
        """
        landmarks = []
        for idx, landmark in enumerate(pose_landmarks.landmark):
            landmark_dict = {
                'id': idx,
                'name': self.LANDMARK_NAMES.get(idx, f'landmark_{idx}'),
                'x': landmark.x * image_width,  # Converter para pixels
                'y': landmark.y * image_height,
                'z': landmark.z,  # Profundidade relativa ao centro do quadril
                'visibility': landmark.visibility,
                # Coordenadas normalizadas (útil para comparação)
                'x_norm': landmark.x,
                'y_norm': landmark.y,
                'z_norm': landmark.z
            }
            landmarks.append(landmark_dict)
        return landmarks

    def _extract_world_landmarks(self, world_landmarks) -> List[Dict[str, Any]]:
        """
        Extrai world landmarks (coordenadas do mundo real em metros).

        Args:
            world_landmarks: MediaPipe world landmarks

        Returns:
            Lista de dicts com world landmarks
        """
        landmarks = []
        for idx, landmark in enumerate(world_landmarks.landmark):
            landmark_dict = {
                'id': idx,
                'name': self.LANDMARK_NAMES.get(idx, f'landmark_{idx}'),
                'x': landmark.x,  # Metros
                'y': landmark.y,
                'z': landmark.z,
                'visibility': landmark.visibility
            }
            landmarks.append(landmark_dict)
        return landmarks

    def get_landmark_by_name(self, landmarks: List[Dict], name: str) -> Optional[Dict]:
        """
        Busca landmark por nome.

        Args:
            landmarks: Lista de landmarks
            name: Nome do landmark (ex: 'left_knee')

        Returns:
            Dict do landmark ou None se não encontrado
        """
        for landmark in landmarks:
            if landmark.get('name') == name:
                return landmark
        return None

    def __del__(self):
        """Cleanup MediaPipe resources"""
        if hasattr(self, 'pose'):
            self.pose.close()
            logger.debug("PoseDetector resources released")
