"""
MediaPipe Pose Landmarker: Analisa frame(s) e retorna angulos articulares.
Usa a API Tasks (mediapipe >= 0.10.x) com PoseLandmarker.

Uso:
  python scripts/mediapipe_analyze_frame.py <frame1.jpg> [frame2.jpg ...]
  python scripts/mediapipe_analyze_frame.py --dir <frames_dir>

Saida: JSON para stdout com angulos de TODAS as articulacoes relevantes.
"""

import sys
import os
import json
import math
import glob
import numpy as np
import cv2
import mediapipe as mp
from mediapipe.tasks.python import BaseOptions, vision

# ============================
# Paths
# ============================

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
MODEL_PATH = os.path.join(PROJECT_DIR, 'models', 'pose_landmarker_heavy.task')

# Fallback paths
FALLBACK_PATHS = [
    os.path.join(PROJECT_DIR, 'models', 'pose_landmarker_full.task'),
    os.path.join(PROJECT_DIR, 'models', 'pose_landmarker_lite.task'),
]

# ============================
# Landmark indices (MediaPipe Pose Landmarker - 33 landmarks)
# ============================

LM = {
    'nose': 0,
    'left_shoulder': 11, 'right_shoulder': 12,
    'left_elbow': 13, 'right_elbow': 14,
    'left_wrist': 15, 'right_wrist': 16,
    'left_hip': 23, 'right_hip': 24,
    'left_knee': 25, 'right_knee': 26,
    'left_ankle': 27, 'right_ankle': 28,
    'left_heel': 29, 'right_heel': 30,
    'left_foot_index': 31, 'right_foot_index': 32,
}


# ============================
# Geometria
# ============================

def angle_3d(a, b, c):
    """Angulo em graus no ponto B formado por A-B-C."""
    ba = np.array(a) - np.array(b)
    bc = np.array(c) - np.array(b)
    cos_a = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-8)
    return round(math.degrees(math.acos(np.clip(cos_a, -1.0, 1.0))), 1)


def angle_to_vertical(bottom, top):
    """Angulo de vetor bottom->top em relacao a vertical (0=ereto, 90=deitado)."""
    vec = np.array([top[0] - bottom[0], top[1] - bottom[1], 0])
    vertical = np.array([0, -1, 0])  # Y aponta para baixo
    cos_a = np.dot(vec, vertical) / (np.linalg.norm(vec) + 1e-8)
    return round(math.degrees(math.acos(np.clip(cos_a, -1.0, 1.0))), 1)


# ============================
# Extracao de angulos
# ============================

def lm_xyz(landmarks, name):
    """Retorna [x, y, z] de um landmark ou None."""
    idx = LM.get(name)
    if idx is None or idx >= len(landmarks):
        return None
    l = landmarks[idx]
    return [l.x, l.y, l.z]


def lm_vis(landmarks, name):
    """Retorna visibility de um landmark."""
    idx = LM.get(name)
    if idx is None or idx >= len(landmarks):
        return 0
    return landmarks[idx].visibility


def calculate_angles(landmarks):
    """Calcula todos os angulos articulares a partir dos 33 landmarks."""
    angles = {}

    # --- Joelhos (hip -> knee -> ankle) ---
    for side in ['left', 'right']:
        hip = lm_xyz(landmarks, f'{side}_hip')
        knee = lm_xyz(landmarks, f'{side}_knee')
        ankle = lm_xyz(landmarks, f'{side}_ankle')
        if all(v is not None for v in [hip, knee, ankle]):
            angles[f'knee_{side}'] = angle_3d(hip, knee, ankle)

    # --- Quadril (shoulder -> hip -> knee) ---
    for side in ['left', 'right']:
        sh = lm_xyz(landmarks, f'{side}_shoulder')
        hp = lm_xyz(landmarks, f'{side}_hip')
        kn = lm_xyz(landmarks, f'{side}_knee')
        if all(v is not None for v in [sh, hp, kn]):
            angles[f'hip_{side}'] = angle_3d(sh, hp, kn)

    if 'hip_left' in angles and 'hip_right' in angles:
        angles['hip_avg'] = round((angles['hip_left'] + angles['hip_right']) / 2, 1)

    # --- Cotovelos (shoulder -> elbow -> wrist) ---
    for side in ['left', 'right']:
        sh = lm_xyz(landmarks, f'{side}_shoulder')
        el = lm_xyz(landmarks, f'{side}_elbow')
        wr = lm_xyz(landmarks, f'{side}_wrist')
        if all(v is not None for v in [sh, el, wr]):
            angles[f'elbow_{side}'] = angle_3d(sh, el, wr)

    # --- Ombro flexao/extensao (elbow -> shoulder -> hip) ---
    for side in ['left', 'right']:
        el = lm_xyz(landmarks, f'{side}_elbow')
        sh = lm_xyz(landmarks, f'{side}_shoulder')
        hp = lm_xyz(landmarks, f'{side}_hip')
        if all(v is not None for v in [el, sh, hp]):
            angles[f'shoulder_{side}'] = angle_3d(el, sh, hp)

    # --- Tornozelos (knee -> ankle -> foot_index) ---
    for side in ['left', 'right']:
        kn = lm_xyz(landmarks, f'{side}_knee')
        ak = lm_xyz(landmarks, f'{side}_ankle')
        ft = lm_xyz(landmarks, f'{side}_foot_index')
        if all(v is not None for v in [kn, ak, ft]):
            raw = angle_3d(kn, ak, ft)
            angles[f'ankle_raw_{side}'] = raw
            angles[f'ankle_dorsiflexion_{side}'] = round(max(0, 90 - raw), 1)

    # --- Tronco (inclinacao em relacao a vertical) ---
    l_sh = lm_xyz(landmarks, 'left_shoulder')
    r_sh = lm_xyz(landmarks, 'right_shoulder')
    l_hp = lm_xyz(landmarks, 'left_hip')
    r_hp = lm_xyz(landmarks, 'right_hip')

    if all(v is not None for v in [l_sh, r_sh, l_hp, r_hp]):
        sh_mid = [(l_sh[i] + r_sh[i]) / 2 for i in range(3)]
        hp_mid = [(l_hp[i] + r_hp[i]) / 2 for i in range(3)]
        angles['trunk_inclination'] = angle_to_vertical(hp_mid, sh_mid)

    # --- Distancia inter-quadril (referencia para calibracao) ---
    # Largura media do quadril humano ~ 35cm
    # Usamos essa distancia como regua para converter coordenadas normalizadas em cm
    REFERENCE_HIP_WIDTH_CM = 35.0
    hip_width_norm = None
    if l_hp and r_hp:
        hip_width_norm = math.sqrt((l_hp[0] - r_hp[0])**2 + (l_hp[1] - r_hp[1])**2)
        angles['hip_width_norm'] = round(hip_width_norm, 4)
        angles['calibration_factor'] = round(REFERENCE_HIP_WIDTH_CM / hip_width_norm, 2) if hip_width_norm > 0.001 else 0

    # --- Valgo de joelho (desvio medial em cm CALIBRADO) ---
    for side in ['left', 'right']:
        hp = lm_xyz(landmarks, f'{side}_hip')
        kn = lm_xyz(landmarks, f'{side}_knee')
        ak = lm_xyz(landmarks, f'{side}_ankle')
        if all(v is not None for v in [hp, kn, ak]):
            # Posicao X esperada do joelho = media entre quadril e tornozelo
            expected_x = (hp[0] + ak[0]) / 2
            deviation_norm = abs(kn[0] - expected_x)

            if hip_width_norm and hip_width_norm > 0.001:
                # Calibrado: converter usando largura do quadril como referencia
                estimated_cm = round(deviation_norm * (REFERENCE_HIP_WIDTH_CM / hip_width_norm), 1)
            else:
                # Fallback: estimativa grosseira
                estimated_cm = round(deviation_norm * 100, 1)

            angles[f'knee_valgus_{side}_cm'] = estimated_cm

    # --- Shoulder elevation (distancia vertical ombro-quadril normalizada) ---
    for side in ['left', 'right']:
        sh = lm_xyz(landmarks, f'{side}_shoulder')
        hp = lm_xyz(landmarks, f'{side}_hip')
        if sh and hp:
            angles[f'shoulder_elevation_{side}'] = round(abs(sh[1] - hp[1]) * 100, 1)

    # --- Wrist deviation (angulo pulso) ---
    for side in ['left', 'right']:
        el = lm_xyz(landmarks, f'{side}_elbow')
        wr = lm_xyz(landmarks, f'{side}_wrist')
        if el and wr:
            # Diferenca angular simples como proxy
            angles[f'wrist_angle_{side}'] = round(abs(el[0] - wr[0]) * 100, 1)

    # --- Confidence ---
    vis_list = []
    for name in LM:
        v = lm_vis(landmarks, name)
        vis_list.append(v)
    if vis_list:
        angles['confidence'] = round(sum(vis_list) / len(vis_list), 3)

    return angles


# ============================
# Processar Frame
# ============================

def create_landmarker():
    """Cria PoseLandmarker com o modelo disponivel."""
    model_path = MODEL_PATH
    if not os.path.exists(model_path):
        for fp in FALLBACK_PATHS:
            if os.path.exists(fp):
                model_path = fp
                break
        else:
            print(json.dumps({'error': f'Model not found. Expected: {MODEL_PATH}'}), file=sys.stderr)
            sys.exit(1)

    options = vision.PoseLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=model_path),
        num_poses=1,
        min_pose_detection_confidence=0.5,
        min_pose_presence_confidence=0.5,
        min_tracking_confidence=0.5,
    )
    return vision.PoseLandmarker.create_from_options(options)


def process_frame(frame_path, landmarker):
    """Processa um frame com PoseLandmarker e retorna angulos."""
    if not os.path.exists(frame_path):
        return {'success': False, 'error': f'File not found: {frame_path}'}

    # Carregar imagem via MediaPipe Image
    mp_image = mp.Image.create_from_file(frame_path)

    # Detectar pose
    result = landmarker.detect(mp_image)

    if not result.pose_landmarks or len(result.pose_landmarks) == 0:
        return {
            'success': False,
            'error': 'No pose detected',
            'frame': os.path.basename(frame_path),
        }

    # Usar primeiro pose detectado
    landmarks = result.pose_landmarks[0]
    angles = calculate_angles(landmarks)

    # Tambem incluir world landmarks se disponiveis (coordenadas metricas)
    world_angles = {}
    if result.pose_world_landmarks and len(result.pose_world_landmarks) > 0:
        world_lm = result.pose_world_landmarks[0]
        world_angles = calculate_angles(world_lm)

    return {
        'success': True,
        'frame': os.path.basename(frame_path),
        'angles': angles,
        'world_angles': world_angles,
    }


# ============================
# Main
# ============================

def main():
    args = sys.argv[1:]

    if not args or args[0] in ['-h', '--help']:
        print(json.dumps({
            'usage': 'python mediapipe_analyze_frame.py <frame1.jpg> [frame2.jpg ...] OR --dir <frames_dir>',
            'output': 'JSON with angles for each frame',
        }))
        sys.exit(0)

    # Coletar frame paths
    frame_paths = []
    if args[0] == '--dir':
        if len(args) < 2:
            print(json.dumps({'error': '--dir requires a directory path'}))
            sys.exit(1)
        frames_dir = args[1]
        frame_paths = sorted(glob.glob(os.path.join(frames_dir, '*.jpg')))
        frame_paths += sorted(glob.glob(os.path.join(frames_dir, '*.png')))
        frame_paths = sorted(set(frame_paths))
    else:
        frame_paths = [p for p in args if not p.startswith('--')]

    if not frame_paths:
        print(json.dumps({'error': 'No frames to process'}))
        sys.exit(1)

    # Inicializar PoseLandmarker
    landmarker = create_landmarker()

    results = []
    for fp in frame_paths:
        result = process_frame(fp, landmarker)
        results.append(result)

    landmarker.close()

    output = {
        'success': True,
        'frames_total': len(frame_paths),
        'frames_processed': sum(1 for r in results if r.get('success')),
        'frames': results,
    }

    print(json.dumps(output))


if __name__ == '__main__':
    main()
