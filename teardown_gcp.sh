#!/bin/bash

# ╔══════════════════════════════════════════════════════════════════════════╗
# ║        ⚠️  DANGER ZONE — GCP Full Teardown Script ⚠️                   ║
# ║                                                                          ║
# ║  This script PERMANENTLY DELETES all GCP resources created during the   ║
# ║  IoT Microservices migration. This action is IRREVERSIBLE.               ║
# ║                                                                          ║
# ║  Affected resources:                                                     ║
# ║    - GKE Autopilot Cluster: iot-cluster                                  ║
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
echo "📦 [1/7] Deleting Kubernetes workloads..."
gcloud container clusters get-credentials "$CLUSTER" --region "$REGION" --project "$PROJECT" || true

kubectl delete --all deployments   -n default --ignore-not-found=true
kubectl delete --all statefulsets  -n default --ignore-not-found=true
kubectl delete --all cronjobs      -n default --ignore-not-found=true
kubectl delete --all services      -n default --ignore-not-found=true
kubectl delete --all ingresses     -n default --ignore-not-found=true
kubectl delete --all pvc           -n default --ignore-not-found=true
kubectl delete --all configmaps    -n default --ignore-not-found=true
kubectl delete --all secrets       -n default --ignore-not-found=true

echo "   ✅ Kubernetes resources deleted."

# ──────────────────────────────────────────────────────────────────────────
# STEP 2: Uninstall Helm releases (NGINX Ingress)
# ──────────────────────────────────────────────────────────────────────────
echo ""
echo "📦 [2/7] Uninstalling Helm releases..."
helm uninstall ingress-nginx -n ingress-nginx 2>/dev/null || true
kubectl delete namespace ingress-nginx --ignore-not-found=true
kubectl delete namespace dev           --ignore-not-found=true
kubectl delete namespace prod          --ignore-not-found=true
kubectl delete namespace monitoring    --ignore-not-found=true
echo "   ✅ Helm releases and namespaces deleted."

# ──────────────────────────────────────────────────────────────────────────
# STEP 3: Delete GKE Autopilot Cluster (this also removes the Load Balancer)
# ──────────────────────────────────────────────────────────────────────────
echo ""
echo "☁️  [3/7] Deleting GKE Autopilot Cluster: ${CLUSTER}..."
echo "   (This will also delete the associated Load Balancer and networking)"
gcloud container clusters delete "$CLUSTER" \
  --region "$REGION" \
  --project "$PROJECT" \
  --quiet
echo "   ✅ GKE cluster deleted."

# ──────────────────────────────────────────────────────────────────────────
# STEP 4: Delete Artifact Registry (all Docker images)
# ──────────────────────────────────────────────────────────────────────────
echo ""
echo "🐳 [4/7] Deleting Artifact Registry repository: ${REPO}..."
gcloud artifacts repositories delete "$REPO" \
  --location="$REGION" \
  --project="$PROJECT" \
  --quiet
echo "   ✅ Artifact Registry and all images deleted."

# ──────────────────────────────────────────────────────────────────────────
# STEP 5: Delete Cloud Build source staging bucket
# ──────────────────────────────────────────────────────────────────────────
echo ""
echo "🪣  [5/7] Deleting Cloud Build source bucket..."
gsutil -m rm -r "gs://${PROJECT}_cloudbuild" 2>/dev/null || true
echo "   ✅ Cloud Build bucket deleted."

# ──────────────────────────────────────────────────────────────────────────
# STEP 6: Delete Service Account created for GitHub Actions
# ──────────────────────────────────────────────────────────────────────────
echo ""
echo "🔑 [6/7] Deleting Service Account: github-actions-sa..."
gcloud iam service-accounts delete "$SA_EMAIL" \
  --project="$PROJECT" \
  --quiet 2>/dev/null || true
echo "   ✅ Service Account deleted."

# ──────────────────────────────────────────────────────────────────────────
# STEP 7: (OPTIONAL) Delete the entire GCP Project
#         Uncomment the block below to also delete the GCP project itself.
#         WARNING: This removes BILLING, IAM, and ALL remaining data.
# ──────────────────────────────────────────────────────────────────────────
echo ""
echo "🗑️  [7/7] GCP Project deletion (OPTIONAL — currently commented out)..."
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
echo "  ✅ GKE cluster: ${CLUSTER}"
echo "  ✅ Artifact Registry: ${REPO} (all Docker images)"
echo "  ✅ Load Balancer (auto-deleted with cluster)"
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
