#!/bin/bash
export PIP_BREAK_SYSTEM_PACKAGES=1

if command -v python3 &>/dev/null; then
    PYTHON_CMD=python3
else
    PYTHON_CMD=python
fi

$PYTHON_CMD -m pip install --break-system-packages -r requirements.txt
$PYTHON_CMD manage.py collectstatic --noinput --clear
