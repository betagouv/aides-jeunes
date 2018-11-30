import os

bind = os.getenv('OPENFISCA_BIND_HOST', '127.0.0.1:2000')
timeout = 120
workers = os.getenv('OPENFISCA_WORKERS', 4)
