#!/bin/bash
#
# register_fake_iot.sh — Idempotent fake-device registration
#
# Registers the 6 fake IoT microcontrollers used for local / CI testing.
# Safe to run multiple times — uses INSERT IGNORE so existing rows are
# preserved unchanged.
#
# Prerequisites:
#   • kubectl must be configured and pointing at the right cluster / context.
#   • The MySQL pod (mysql-0) must be Running and Ready.
#   • The user login is derived from a SHA-256 hash:
#       echo -n "testpassword123" | sha256sum
#     → b55c8792d1ce458e279308835f8a97b580263503e76e1998e279703e35ad0c2e
#
# Usage:
#   ./register_fake_iot.sh [username]
#
# Examples:
#   ./register_fake_iot.sh              # registers as "testuser"
#   ./register_fake_iot.sh myuser       # registers as "myuser"
#
# The fake devices listen on host.docker.internal at ports 3000–3005:
#   3000 → temperature  (Fake Grove - Temperature)
#   3001 → humidity     (Fake Grove - Moisture)
#   3002 → temperature  (Fake Grove - Temperature)
#   3003 → humidity     (Fake Grove - Moisture)
#   3004 → temperature  (Fake Grove - Temperature)
#   3005 → pictures     (Fake Camera)

set -euo pipefail

# ─── Configuration ───────────────────────────────────────────────────────────
USER="${1:-testuser}"
DB_PASS="f001de9f90e1eae14f8eff7782c2f811"
MYSQL_POD="mysql-0"

# ─── Pre-flight checks ───────────────────────────────────────────────────────
echo "🔍 Checking cluster connectivity..."
if ! kubectl cluster-info &>/dev/null; then
  echo "❌ Cannot reach Kubernetes cluster. Check your kubeconfig / VPN."
  exit 1
fi

echo "🔍 Waiting for MySQL pod '$MYSQL_POD' to be Ready..."
kubectl wait pod/"$MYSQL_POD" --for=condition=Ready --timeout=60s || {
  echo "❌ MySQL pod is not Ready after 60 s. Aborting."
  exit 1
}

echo ""
echo "📝 Registering fake IoT devices for user: $USER"

# ─── Helper —————————————————————————————————————————————————————————————────
run_sql() {
  kubectl exec "$MYSQL_POD" -- mysql -u root -p"$DB_PASS" -e "$1"
}

# ─── User ────────────────────────────────────────────────────────────────────
echo "👤 Ensuring user '$USER' exists..."
# Password hash is SHA-256 of 'testpassword123'
run_sql "INSERT IGNORE INTO iot.users (username, password, refresh_token) \
VALUES ('$USER', 'b55c8792d1ce458e279308835f8a97b580263503e76e1998e279703e35ad0c2e', '');"

# ─── Microcontrollers ────────────────────────────────────────────────────────
echo "📡 Registering microcontrollers..."

run_sql "INSERT IGNORE INTO iot.microcontrollers VALUES ('$USER', 'host.docker.internal:3000', 'temperature', 'Fake Grove - Temperature');"
run_sql "INSERT IGNORE INTO iot.microcontrollers VALUES ('$USER', 'host.docker.internal:3001', 'humidity',    'Fake Grove - Moisture');"
run_sql "INSERT IGNORE INTO iot.microcontrollers VALUES ('$USER', 'host.docker.internal:3002', 'temperature', 'Fake Grove - Temperature');"
run_sql "INSERT IGNORE INTO iot.microcontrollers VALUES ('$USER', 'host.docker.internal:3003', 'humidity',    'Fake Grove - Moisture');"
run_sql "INSERT IGNORE INTO iot.microcontrollers VALUES ('$USER', 'host.docker.internal:3004', 'temperature', 'Fake Grove - Temperature');"
run_sql "INSERT IGNORE INTO iot.microcontrollers VALUES ('$USER', 'host.docker.internal:3005', 'pictures',   'Fake Camera');"

# ─── Summary ─────────────────────────────────────────────────────────────────
echo ""
echo "✅ Registration complete for user '$USER'."
echo ""
echo "   Login credentials:"
echo "     username : $USER"
echo "     password : testpassword123"
echo ""
echo "   Tip: log in at http://localhost:31600 (NodePort) or whatever"
echo "        host/port the angular-ms service exposes."
