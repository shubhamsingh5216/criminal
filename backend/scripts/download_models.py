"""Pre-download InsightFace models used by the app.

This script initializes FaceAnalysis briefly which causes the library to
download the required model files into the local cache (~/.insightface).
Running at Docker build time ensures models are available in the image.
"""
import sys

try:
    from insightface.app import FaceAnalysis
except Exception as e:
    print('InsightFace not installed or failed to import:', e)
    sys.exit(1)

print('Initializing InsightFace to download models...')
fa = FaceAnalysis()
fa.prepare(ctx_id=-1)
print('InsightFace models prepared.')
