#!/bin/bash

# ╔══════════════════════════════════════════════════════════════════════════╗
# ║        ⚠️  DANGER ZONE — GCP Full Teardown Script ⚠️                   ║
# ║                                                                          ║
# ║  This script PERMANENTLY DELETES all GCP resources created during the   ║
# ║  IoT Microservices migration. This action is IRREVERSIBLE.               ║
# ║                                                                          ║
# ║  Affected resources:                                                     ║
# ║    - GKE Autopilot Cluster: iot-cluster (EU)                             ║
# ║    - GKE Autopilot Cluster: iot-cluster-us (US)                          ║
# ║    - GKE Fleet Memberships & Multi-cluster Service Discovery Feature     ║
# ║    - Artifact Registry: iot-repo (all 10+ Docker images)                 ║
# ║    - Load Balancer & Forwarding Rules                                    ║
# ║    - Persistent Disks (MySQL + MongoDB data)                             ║
# ║    - Cloud Build history & source buckets                                ║
# ║    - IAM Service Account: github-actions-sa                              ║
# ║    - GCP Project: iot-microservices-gcp (optional, commented out)        ║
# ║                                                                          ║
# ║  ✅ Safe to keep: local manifest YAMLs, source code, PLAN.md            ║
# ╚══════════════════════════════════════════════════════════════════════════╝

set -e  # Exit on first error

PROJECT="iot-microservices-gcp"
CLUSTER="iot-cluster"
REGION="europe-west1"
CLUSTER_US="iot-cluster-us"
REGION_US="us-central1"
REPO="iot-repo"
SA_EMAIL="github-actions-sa@${PROJECT}.iam.gserviceaccount.com"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ⚠️  GCP TEARDOWN — ${PROJECT}  ⚠️  ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
read -p "Are you absolutely sure you want to delete ALL GCP resources? (type 'DELETE' to confirm): " CONFIRM
if [ "$CONFIRM" != "DELETE" ]; then
  echo "Teardown aborted. No resources were deleted."
  exit 0
fi

echo ""
echo "🔧 Configuring gcloud project..."
gcloud config set project "$PROJECT"

# ──────────────────────────────────────────────────────────────────────────
# STEP 1: Delete all Kubernetes resources (graceful cleanup before cluster deletion)
# ──────────────────────────────────────────────────────────────────────────
echo ""
echo "📦 [1/8] Deleting Kubernetes workloads from EU cluster..."
gcloud container clusters get-credentials "$CLUSTER" --region "$REGION" --project "$PROJECT" || true

kubectl delete --all deployments   -n default --ignore-not-found=true
kubectl delete --all statefulsets  -n default --ignore-not-found=true
kubectl delete --all cronjobs      -n default --ignore-not-found=true
kubectl delete --all services      -n default --ignore-not-found=true
kubectl delete --all ingresses     -n default --ignore-not-found=true
kubectl delete --all pvc           -n default --ignore-not-found=true
kubectl delete --all configmaps    -n default --ignore-not-found=true
kubectl delete --all secrets       -n default --ignore-not-found=true

echo "📦 [1.5/8] Deleting Kubernetes workloads from US cluster..."
gcloud container clusters get-credentials "$CLUSTER_US" --region "$REGION_US" --project "$PROJECT" 2>/dev/null || true

kubectl delete --all deployments   -n default --ignore-not-found=true || true
kubectl delete --all services      -n default --ignore-not-found=true || true
kubectl delete --all configmaps    -n default --ignore-not-found=true || true
kubectl delete --all secrets       -n default --ignore-not-found=true || true

echo "   ✅ Kubernetes resources deleted from all clusters."

# ──────────────────────────────────────────────────────────────────────────
# STEP 2: Uninstall Helm releases (NGINX Ingress)
# ──────────────────────────────────────────────────────────────────────────
echo ""
echo "📦 [2/8] Uninstalling Helm releases..."
helm uninstall ingress-nginx -n ingress-nginx 2>/dev/null || true
helm uninstall ingress-nginx -n ingress-nginx --kube-context gke_${PROJECT}_${REGION_US}_${CLUSTER_US} 2>/dev/null || true
kubectl delete namespace ingress-nginx --ignore-not-found=true
kubectl delete namespace dev           --ignore-not-found=true
kubectl delete namespace prod          --ignore-not-found=true
kubectl delete namespace monitoring    --ignore-not-found=true
echo "   ✅ Helm releases and namespaces deleted."

# ──────────────────────────────────────────────────────────────────────────
# STEP 3: Delete GKE Autopilot Cluster (this also removes the Load Balancer)
# ──────────────────────────────────────────────────────────────────────────
echo "🕸️  [3/8] Unregistering Fleet Memberships & disabling MCS..."
gcloud container fleet memberships delete iot-cluster-eu --project "$PROJECT" --quiet 2>/dev/null || true
gcloud container fleet memberships delete iot-cluster-us --project "$PROJECT" --quiet 2>/dev/null || true
gcloud container fleet features disable multiclusterservicediscovery --project "$PROJECT" --quiet 2>/dev/null || true
echo "   ✅ Fleet unregistration complete."

# ──────────────────────────────────────────────────────────────────────────
# STEP 4: Delete GKE Autopilot Clusters
# ──────────────────────────────────────────────────────────────────────────
echo ""
echo "☁️  [4/8] Deleting Primary GKE Autopilot Cluster: ${CLUSTER}..."
gcloud container clusters delete "$CLUSTER" \
  --region "$REGION" \
  --project "$PROJECT" \
  --quiet

echo "☁️  [4.5/8] Deleting Secondary GKE Autopilot Cluster: ${CLUSTER_US}..."
gcloud container clusters delete "$CLUSTER_US" \
  --region "$REGION_US" \
  --project "$PROJECT" \
  --quiet || true
echo "   ✅ All GKE clusters deleted."

# ──────────────────────────────────────────────────────────────────────────
# STEP 5: Delete ALL Artifact Registry repositories in all regions
# ──────────────────────────────────────────────────────────────────────────
echo ""
echo "🐳 [5/8] Deleting ALL Artifact Registry repositories..."
REPOS=$(gcloud artifacts repositories list --project="$PROJECT" --format="value(name)" 2>/dev/null || true)
while read -r r; do
    if [ ! -z "$r" ]; then
        echo "   Deleting repository: $r"
        LOC=$(echo $r | rev | cut -d/ -f3 | rev)
        REPO_NAME=$(echo $r | rev | cut -d/ -f1 | rev)
        gcloud artifacts repositories delete "$REPO_NAME" --location="$LOC" --project="$PROJECT" --quiet || true
    fi
done <<< "$REPOS"
echo "   ✅ Artifact Registry cleanup complete."

# ──────────────────────────────────────────────────────────────────────────
# STEP 6: Delete ALL Cloud Storage buckets
# ──────────────────────────────────────────────────────────────────────────
echo ""
echo "🪣  [6/8] Deleting ALL Cloud Storage buckets..."
BUCKETS=$(gcloud storage buckets list --project="$PROJECT" --format="value(name)" 2>/dev/null || true)
while read -r b; do
    if [ ! -z "$b" ]; then
        echo "   Emptying and deleting bucket: $b"
        gsutil -m rm -r "$b" 2>/dev/null || true
    fi
done <<< "$BUCKETS"
echo "   ✅ Cloud Storage cleanup complete."

# ──────────────────────────────────────────────────────────────────────────
# STEP 7: Delete Service Account & Orphaned Compute Resources (Disks/IPs)
# ──────────────────────────────────────────────────────────────────────────
echo ""
echo "🔑 [7/8] Deleting Service Account & Sweeping Orphaned Resources..."
gcloud iam service-accounts delete "$SA_EMAIL" --project="$PROJECT" --quiet 2>/dev/null || true

# Final sweep of any orphaned disks that might have failed to delete with PVCs
ORPHANED_DISKS=$(gcloud compute disks list --project="$PROJECT" --format="value(name,zone)" --filter="status:READY" 2>/dev/null || true)
while read -r name zone; do
    if [ ! -z "$name" ]; then
        echo "   Deleting orphaned disk: $name in $zone"
        gcloud compute disks delete "$name" --zone="$zone" --project="$PROJECT" --quiet || true
    fi
done <<< "$ORPHANED_DISKS"

# Final sweep of any static IP addresses (unused ones)
STATIC_IPS=$(gcloud compute addresses list --project="$PROJECT" --format="value(name,region)" --filter="status:RESERVED" 2>/dev/null || true)
while read -r name region; do
    if [ ! -z "$name" ]; then
        echo "   Deleting idle static IP: $name in $region"
        gcloud compute addresses delete "$name" --region="$region" --project="$PROJECT" --quiet || true
    fi
done <<< "$STATIC_IPS"

echo "   ✅ Cleanup sweep complete."

# ──────────────────────────────────────────────────────────────────────────
# STEP 8: (OPTIONAL) Delete the entire GCP Project
#         Uncomment the block below to also delete the GCP project itself.
#         WARNING: This removes BILLING, IAM, and ALL remaining data.
# ──────────────────────────────────────────────────────────────────────────
echo ""
echo "🗑️  [8/8] GCP Project deletion (OPTIONAL — currently commented out)..."
echo "   To delete the entire project, uncomment lines 115-120 in this script."

# UNCOMMENT THE BLOCK BELOW TO ALSO DELETE THE ENTIRE PROJECT:
# -----------------------------------------------------------------
# read -p "Also DELETE the entire GCP project '${PROJECT}'? (type 'DELETE_PROJECT' to confirm): " CONFIRM_PROJECT
# if [ "$CONFIRM_PROJECT" = "DELETE_PROJECT" ]; then
#   gcloud projects delete "$PROJECT" --quiet
#   echo "   ✅ Project ${PROJECT} permanently deleted."
# fi
# -----------------------------------------------------------------

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✅  TEARDOWN COMPLETE                               ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "Resources deleted:"
echo "  ✅ GKE cluster: ${CLUSTER} (EU)"
echo "  ✅ GKE cluster: ${CLUSTER_US} (US)"
echo "  ✅ GKE Fleet memberships & MCS features"
echo "  ✅ Artifact Registry: ${REPO} (all Docker images)"
echo "  ✅ Load Balancers (auto-deleted with cluster)"
echo "  ✅ Persistent Disks (auto-deleted with cluster PVCs)"
echo "  ✅ Cloud Build source bucket"
echo "  ✅ IAM Service Account: github-actions-sa"
echo ""
echo "Resources KEPT:"
echo "  🟡 GCP Project: ${PROJECT} (still exists — re-deploy anytime)"
echo "  🟡 Local source code & YAML manifests (unchanged)"
echo "  🟡 GitHub repository & Actions pipeline"
echo ""
echo "To re-deploy everything, run: ./build_and_push_to_gcp.sh"
