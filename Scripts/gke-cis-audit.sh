#!/bin/bash
# scripts/gke-cis-audit.sh
# Static Analysis of the IoT Microservices repository against CIS GKE Benchmarking standards.

set -e

echo "🔎 Starting CIS GKE Benchmarking Static Audit..."
echo "=============================================="

# 1. Check for non-root users in Dockerfiles
echo "[1/4] User Privilege Audit:"
DOCKERFILES=$(find . -name "Dockerfile")
for df in $DOCKERFILES; do
    if grep -q "USER" "$df"; then
        echo "  ✅ $df uses explicit USER"
    else
        echo "  ❌ $df runs as root (CIS Violation 4.1.1)"
    fi
done

# 2. Check for SecurityContexts in Kubernetes Manifests
echo -e "\n[2/4] Workload SecurityContext Audit:"
MANIFESTS=$(find manifests-k8s -name "*.yaml")
for mf in $MANIFESTS; do
    if grep -q "securityContext" "$mf"; then
        echo "  ✅ $mf defines securityContext"
    else
        # Skip config maps and services
        if grep -q "kind: Deployment\|kind: StatefulSet" "$mf"; then
            echo "  ❌ $mf missing securityContext (CIS Violation 5.7.1)"
        fi
    fi
done

# 3. Check for Network Policies
echo -e "\n[3/4] Network Isolation Audit:"
if [ -f "manifests-k8s/security/gke-hardening-baseline.yaml" ]; then
    echo "  ✅ Network hardening baseline found."
else
    echo "  ❌ Global Network Hardening Baseline missing (CIS Violation 5.6.1)"
fi

# 4. Check for GCP-level hardening in setup scripts
echo -e "\n[4/4] Infrastructure Hardening Audit:"
if grep -q "enable-network-policy" setup_gcp_infra.sh; then
    echo "  ✅ Network policy enabled at cluster level."
else
    echo "  ❌ Network policy NOT explicitly enabled in setup_gcp_infra.sh"
fi

echo -e "\n=============================================="
echo "Audit Sample Complete. Proceeding to fix violations..."
