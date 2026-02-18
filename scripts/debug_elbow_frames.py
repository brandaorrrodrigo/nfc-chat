#!/usr/bin/env python3
"""
Script para debugar valores de cotovelo em cada frame da remada.
Extrai 6 frames e mostra todos os ângulos relevantes por frame.
"""

import sys
import os
import json
import subprocess
import tempfile
import shutil

# Importar para baixar do Supabase
sys.path.insert(0, os.path.dirname(__file__))

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
ANALYZE_SCRIPT = os.path.join(SCRIPT_DIR, 'mediapipe_analyze_frame.py')

def extract_frames(video_path, output_dir, count=6):
    """Extrai N frames do vídeo usando ffmpeg."""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Calcular intervalo: pega frames uniformemente distribuídos
    cmd = [
        'ffmpeg',
        '-i', video_path,
        '-vf', f'fps=1/{count-1}',  # Pega frames equidistantes
        '-vframes', str(count),
        os.path.join(output_dir, 'frame_%02d.jpg'),
        '-y'  # Sobrescreve sem perguntar
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"[ERROR] FFmpeg failed: {result.stderr}")
        return []

    # Encontrar frames gerados
    frames = sorted([
        os.path.join(output_dir, f)
        for f in os.listdir(output_dir)
        if f.endswith('.jpg')
    ])

    print(f"[DEBUG] Extracted {len(frames)} frames")
    for i, f in enumerate(frames):
        print(f"  Frame {i+1}: {os.path.basename(f)}")

    return frames

def analyze_frames(frame_paths):
    """Analisa frames com MediaPipe."""
    if not frame_paths:
        return None

    cmd = ['python3', ANALYZE_SCRIPT] + frame_paths
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"[ERROR] MediaPipe analysis failed: {result.stderr}")
        return None

    return json.loads(result.stdout)

def print_frame_analysis(media_result):
    """Imprime análise detalhada de cada frame."""
    if not media_result or not media_result.get('success'):
        print("[ERROR] Analysis failed")
        return

    print("\n" + "="*100)
    print("ANÁLISE DETALHADA POR FRAME - REMADA (PUXADAS)")
    print("="*100)

    frames = media_result.get('frames', [])

    for i, frame in enumerate(frames, 1):
        print(f"\n📸 FRAME {i}: {frame.get('frame', '?')}")

        if not frame.get('success'):
            print(f"  ❌ FALHA: {frame.get('error', 'Unknown error')}")
            continue

        # Usar world_angles se disponível (mais preciso em 3D)
        angles = frame.get('world_angles') or frame.get('angles', {})

        print(f"  ✅ Detectado")
        print(f"\n  Cotovelos:")
        print(f"    - Esquerdo (elbow_left):  {angles.get('elbow_left', '?')}°")
        print(f"    - Direito  (elbow_right): {angles.get('elbow_right', '?')}°")

        print(f"\n  Ombros:")
        print(f"    - Esquerdo (shoulder_left):  {angles.get('shoulder_left', '?')}°")
        print(f"    - Direito  (shoulder_right): {angles.get('shoulder_right', '?')}°")

        print(f"\n  Quadril/Tronco:")
        print(f"    - Hip (média):     {angles.get('hip_avg', '?')}°")
        print(f"    - Trunk inclination: {angles.get('trunk_inclination', '?')}°")

        print(f"\n  Confiança: {angles.get('confidence', '?')}")
        print("-" * 100)

    # Resumo por métrica
    print("\n" + "="*100)
    print("RESUMO - VALORES MÍNIMOS E MÁXIMOS POR ARTICULAÇÃO")
    print("="*100)

    all_angles = []
    for frame in frames:
        if frame.get('success'):
            angles = frame.get('world_angles') or frame.get('angles', {})
            all_angles.append(angles)

    if all_angles:
        metrics = ['elbow_left', 'elbow_right', 'shoulder_left', 'shoulder_right', 'hip_avg', 'hip_left', 'hip_right', 'knee_left', 'knee_right', 'trunk_inclination']

        for metric in metrics:
            values = [a.get(metric) for a in all_angles if metric in a and a[metric] is not None]
            if values:
                min_val = min(values)
                max_val = max(values)
                avg_val = sum(values) / len(values)

                # Ícone baseado na métrica
                icon = "🎯" if 'elbow' in metric or 'shoulder' in metric else "📊"

                print(f"{icon} {metric:20s}: min={min_val:6.1f}°  max={max_val:6.1f}°  avg={avg_val:6.1f}°")

def main():
    if len(sys.argv) < 2:
        print("Uso: python debug_elbow_frames.py <video_path>")
        print("Exemplo: python debug_elbow_frames.py /caminho/para/remada.mp4")
        sys.exit(1)

    video_path = sys.argv[1]

    if not os.path.exists(video_path):
        print(f"[ERROR] Video not found: {video_path}")
        sys.exit(1)

    # Criar diretório temporário
    with tempfile.TemporaryDirectory(prefix='debug_elbow_') as tmpdir:
        print(f"[DEBUG] Usando diretório temp: {tmpdir}")

        # Extrair 6 frames
        frames_dir = os.path.join(tmpdir, 'frames')
        frame_paths = extract_frames(video_path, frames_dir, count=6)

        if not frame_paths:
            print("[ERROR] Falha ao extrair frames")
            sys.exit(1)

        # Analisar com MediaPipe
        print("\n[DEBUG] Analisando frames com MediaPipe...")
        result = analyze_frames(frame_paths)

        # Imprimir resultados
        if result:
            print_frame_analysis(result)
        else:
            print("[ERROR] Análise falhou")

if __name__ == '__main__':
    main()
