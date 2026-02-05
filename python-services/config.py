"""
Configurações do serviço MediaPipe.
"""

import os
from typing import Dict, Any


class Config:
    """Configuração base"""

    # Flask
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    HOST = os.getenv('HOST', '0.0.0.0')
    PORT = int(os.getenv('PORT', 5000))

    # MediaPipe Model Settings
    MODEL_COMPLEXITY = int(os.getenv('MODEL_COMPLEXITY', 1))  # 0=lite, 1=full, 2=heavy
    MIN_DETECTION_CONFIDENCE = float(os.getenv('MIN_DETECTION_CONFIDENCE', 0.7))
    MIN_TRACKING_CONFIDENCE = float(os.getenv('MIN_TRACKING_CONFIDENCE', 0.7))

    # Performance
    MAX_WORKERS = int(os.getenv('MAX_WORKERS', 4))
    TIMEOUT_SECONDS = int(os.getenv('TIMEOUT_SECONDS', 30))
    MAX_FRAMES_PER_REQUEST = int(os.getenv('MAX_FRAMES_PER_REQUEST', 20))

    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FORMAT = os.getenv(
        'LOG_FORMAT',
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    # Cache (opcional)
    ENABLE_CACHE = os.getenv('ENABLE_CACHE', 'False').lower() == 'true'
    REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
    REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
    REDIS_DB = int(os.getenv('REDIS_DB', 0))
    CACHE_TTL = int(os.getenv('CACHE_TTL', 3600))  # 1 hora

    # Limites de segurança
    MAX_IMAGE_SIZE_MB = int(os.getenv('MAX_IMAGE_SIZE_MB', 10))
    ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'bmp'}

    # Diretórios temporários
    TEMP_DIR = os.getenv('TEMP_DIR', '/tmp/mediapipe')

    # Métricas Prometheus
    ENABLE_METRICS = os.getenv('ENABLE_METRICS', 'False').lower() == 'true'
    METRICS_PORT = int(os.getenv('METRICS_PORT', 8000))

    @classmethod
    def to_dict(cls) -> Dict[str, Any]:
        """Converte configurações para dict"""
        return {
            key: getattr(cls, key)
            for key in dir(cls)
            if not key.startswith('_') and key.isupper()
        }

    @classmethod
    def validate(cls) -> bool:
        """Valida configurações"""
        # Verificar model complexity
        if cls.MODEL_COMPLEXITY not in [0, 1, 2]:
            raise ValueError(f"Invalid MODEL_COMPLEXITY: {cls.MODEL_COMPLEXITY}")

        # Verificar confidence thresholds
        if not 0 <= cls.MIN_DETECTION_CONFIDENCE <= 1:
            raise ValueError(f"Invalid MIN_DETECTION_CONFIDENCE: {cls.MIN_DETECTION_CONFIDENCE}")

        if not 0 <= cls.MIN_TRACKING_CONFIDENCE <= 1:
            raise ValueError(f"Invalid MIN_TRACKING_CONFIDENCE: {cls.MIN_TRACKING_CONFIDENCE}")

        return True


class DevelopmentConfig(Config):
    """Configuração de desenvolvimento"""
    DEBUG = True
    LOG_LEVEL = 'DEBUG'
    MODEL_COMPLEXITY = 1  # Full model


class ProductionConfig(Config):
    """Configuração de produção"""
    DEBUG = False
    LOG_LEVEL = 'INFO'
    MODEL_COMPLEXITY = 1  # Full model, balanceado
    ENABLE_METRICS = True


class TestingConfig(Config):
    """Configuração de testes"""
    DEBUG = True
    LOG_LEVEL = 'DEBUG'
    MODEL_COMPLEXITY = 0  # Lite model para testes rápidos
    MAX_FRAMES_PER_REQUEST = 5


# Mapeamento de ambientes
config_map = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
}


def get_config(env: str = None) -> Config:
    """
    Retorna configuração baseado no ambiente.

    Args:
        env: Environment name (development, production, testing)

    Returns:
        Config class
    """
    if env is None:
        env = os.getenv('FLASK_ENV', 'development')

    config_class = config_map.get(env, DevelopmentConfig)
    config_class.validate()

    return config_class
