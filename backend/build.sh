#!/usr/bin/env bash
set -eux

# Install required system dependencies
apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    gcc \
    gfortran \
    libopenblas-dev \
    liblapack-dev

# Now install Python dependencies
pip install --no-cache-dir -r requirements.txt
