#!/bin/sh
set -eu

cat >/srv/runtime-config.js <<EOF
window.__RUNTIME_CONFIG__ = {
  VITE_API_BASE_URL: '${VITE_API_BASE_URL:-/v1/orchestrator}',
  VITE_API_ENV: '${VITE_API_ENV:-production}',
  VITE_SESSION_REPLAY_PRIVACY: '${VITE_SESSION_REPLAY_PRIVACY:-strict}',
  LD_CLIENT_ID: '${LD_CLIENT_ID:-}',
};
EOF

httpd -f -p 127.0.0.1:8081 -h /srv &
exec haproxy -db -f /usr/local/etc/haproxy/haproxy.cfg
