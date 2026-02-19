"""
MediaPipe Pose Landmarker: Analisa frame(s) e retorna angulos articulares.
Usa a API Tasks (mediapipe >= 0.10.x) com PoseLandmarker.

GPU: tenta Delegate.GPU primeiro (NVIDIA via CUDA/OpenCL), fallback para CPU.
Paralelismo: CPU usa ProcessPoolExecutor com N_CPU//2 workers.

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
from concurrent.futures import ProcessPoolExecutor, as_completed
import multiprocessing

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
    # IMPORTANTE: Valgo so e confiavel em vista FRONTAL.
    # hip_width_norm < 0.12 indica vista lateral (quadris sobrepostos) => skip
    # Tambem limita a 15cm max (nenhum humano tem valgo > 15cm)
    MIN_HIP_WIDTH_FOR_VALGUS = 0.12
    MAX_VALGUS_CM = 15.0

    if hip_width_norm and hip_width_norm >= MIN_HIP_WIDTH_FOR_VALGUS:
        for side in ['left', 'right']:
            hp = lm_xyz(landmarks, f'{side}_hip')
            kn = lm_xyz(landmarks, f'{side}_knee')
            ak = lm_xyz(landmarks, f'{side}_ankle')
            if all(v is not None for v in [hp, kn, ak]):
                # Posicao X esperada do joelho = media entre quadril e tornozelo
                expected_x = (hp[0] + ak[0]) / 2
                deviation_norm = abs(kn[0] - expected_x)

                estimated_cm = round(deviation_norm * (REFERENCE_HIP_WIDTH_CM / hip_width_norm), 1)
                # Cap: nenhum valgo real > 15cm
                estimated_cm = min(estimated_cm, MAX_VALGUS_CM)

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

def resolve_model_path():
    """Retorna o caminho do modelo disponivel ou encerra com erro."""
    if os.path.exists(MODEL_PATH):
        return MODEL_PATH
    for fp in FALLBACK_PATHS:
        if os.path.exists(fp):
            return fp
    print(json.dumps({'error': f'Model not found. Expected: {MODEL_PATH}'}), file=sys.stderr)
    sys.exit(1)


def create_landmarker(delegate=None):
    """Cria PoseLandmarker com o modelo disponivel e delegate especificado."""
    model_path = resolve_model_path()
    base_opts = BaseOptions(model_asset_path=model_path, delegate=delegate)
    options = vision.PoseLandmarkerOptions(
        base_options=base_opts,
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
    world_landmarks_raw = {}
    if result.pose_world_landmarks and len(result.pose_world_landmarks) > 0:
        world_lm = result.pose_world_landmarks[0]
        world_angles = calculate_angles(world_lm)
        # Exportar coordenadas brutas dos world landmarks (metros) para engines TypeScript
        for name, idx in LM.items():
            if idx < len(world_lm):
                l = world_lm[idx]
                world_landmarks_raw[name] = {
                    'x': round(l.x, 6),
                    'y': round(l.y, 6),
                    'z': round(l.z, 6),
                    'visibility': round(getattr(l, 'visibility', 0.0), 3),
                }

    # Exportar coordenadas brutas dos landmarks normalizados (0-1) para engines TypeScript
    landmarks_raw = {}
    for name, idx in LM.items():
        if idx < len(landmarks):
            l = landmarks[idx]
            landmarks_raw[name] = {
                'x': round(l.x, 6),
                'y': round(l.y, 6),
                'z': round(l.z, 6),
                'visibility': round(getattr(l, 'visibility', 0.0), 3),
            }

    return {
        'success': True,
        'frame': os.path.basename(frame_path),
        'angles': angles,
        'world_angles': world_angles,
        'landmarks': landmarks_raw,
        'world_landmarks': world_landmarks_raw,
    }


# ============================
# Workers para CPU paralelo
# (ProcessPoolExecutor requer funcoes picklable no nivel de modulo)
# ============================

_worker_landmarker = None
_worker_model_path = None


def _worker_init(model_path):
    """Inicializa landmarker CPU em cada worker process."""
    global _worker_landmarker, _worker_model_path
    _worker_model_path = model_path
    base_opts = BaseOptions(
        model_asset_path=model_path,
        delegate=BaseOptions.Delegate.CPU,
    )
    options = vision.PoseLandmarkerOptions(
        base_options=base_opts,
        num_poses=1,
        min_pose_detection_confidence=0.5,
        min_pose_presence_confidence=0.5,
        min_tracking_confidence=0.5,
    )
    _worker_landmarker = vision.PoseLandmarker.create_from_options(options)


def _worker_process_frame(frame_path):
    """Processa um frame no worker process usando o landmarker local."""
    global _worker_landmarker
    return process_frame(frame_path, _worker_landmarker)


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

    model_path = resolve_model_path()
    device_used = 'cpu'
    results = []

    # --- Tentar GPU primeiro ---
    gpu_ok = False
    try:
        landmarker = create_landmarker(delegate=BaseOptions.Delegate.GPU)
        # Teste rapido com o primeiro frame para confirmar GPU funciona
        test_result = process_frame(frame_paths[0], landmarker)
        gpu_ok = True
        device_used = 'gpu'
        print(f'[mediapipe] Usando GPU (CUDA/OpenCL)', file=sys.stderr)

        # GPU: processar sequencialmente (contexto unico)
        results.append(test_result)
        for fp in frame_paths[1:]:
            results.append(process_frame(fp, landmarker))

        landmarker.close()

    except Exception as gpu_err:
        print(f'[mediapipe] GPU indisponivel ({gpu_err}), usando CPU paralelo', file=sys.stderr)

    # --- Fallback CPU paralelo ---
    if not gpu_ok:
        n_workers = max(1, multiprocessing.cpu_count() // 2)
        print(f'[mediapipe] CPU paralelo com {n_workers} workers', file=sys.stderr)

        results_map = {}
        with ProcessPoolExecutor(
            max_workers=n_workers,
            initializer=_worker_init,
            initargs=(model_path,),
        ) as executor:
            futures = {executor.submit(_worker_process_frame, fp): fp for fp in frame_paths}
            for future in as_completed(futures):
                fp = futures[future]
                try:
                    results_map[fp] = future.result()
                except Exception as e:
                    results_map[fp] = {
                        'success': False,
                        'error': str(e),
                        'frame': os.path.basename(fp),
                    }

        # Reordenar para manter ordem original dos frames
        results = [results_map[fp] for fp in frame_paths]

    output = {
        'success': True,
        'device': device_used,
        'frames_total': len(frame_paths),
        'frames_processed': sum(1 for r in results if r.get('success')),
        'frames': results,
    }

    print(json.dumps(output))


if __name__ == '__main__':
    main()
