#!/bin/bash

# Configuration
PROJECT="iot-microservices-gcp"
REGION="europe-west1"
REPO="iot-repo"
REGISTRY="$REGION-docker.pkg.dev/$PROJECT/$REPO"

# List of microservices to build and push
SERVICES=(
  "ai-ms"
  "angular-ms"
  "auth-ms"
  "fake-arduino-iot-pictures"
  "measure-ms"
  "microcontrollers-ms"
  "mysql-iot"
  "orchestrator-ms"
  "publisher-ms"
  "stats-ms"
)

echo "🚀 Starting concurrent Cloud Builds for Phase 2 image migration..."

for SERVICE in "${SERVICES[@]}"; do
  echo "📦 Submitting build for $SERVICE to Artifact Registry..."
  cp .gcloudignore ./$SERVICE/
  gcloud builds submit ./$SERVICE --tag $REGISTRY/$SERVICE:latest --async
done

echo "✅ All build jobs have been submitted to Google Cloud Build!"
echo "You can monitor the progress of these builds here:"
echo "👉 https://console.cloud.google.com/cloud-build/builds?project=$PROJECT"
