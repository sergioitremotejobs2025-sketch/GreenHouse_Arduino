#!/bin/bash

# Configuration
PROJECT_ID="iot-microservices-gcp"
DATE=$(date +"%d%m%Y")
OUTPUT_FILE="COST_${DATE}.md"

echo "Running GCP resource checks for project: ${PROJECT_ID}..."
echo "Writing results to: ${OUTPUT_FILE}"

# Initialize the markdown file
echo "# Google Cloud Resources & Final State Check" > "$OUTPUT_FILE"
echo "Date: $(date +"%Y-%m-%d %H:%M:%S")" >> "$OUTPUT_FILE"
echo "Project ID: \`${PROJECT_ID}\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "This file documents the status of resources that might incur costs in the Google Cloud Project." >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 1. Check Compute Engine Instances
echo "Checking Compute Engine Instances..."
echo "## 1. Compute Engine Instances (VMs)" >> "$OUTPUT_FILE"
echo '```text' >> "$OUTPUT_FILE"
gcloud compute instances list --project=$PROJECT_ID >> "$OUTPUT_FILE" 2>&1
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 2. Check Kubernetes Engine Clusters
echo "Checking Kubernetes Engine Clusters..."
echo "## 2. Kubernetes Engine Clusters (GKE)" >> "$OUTPUT_FILE"
echo '```text' >> "$OUTPUT_FILE"
gcloud container clusters list --project=$PROJECT_ID >> "$OUTPUT_FILE" 2>&1
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 3. Check Cloud SQL Instances
echo "Checking Cloud SQL Instances..."
echo "## 3. Cloud SQL Databases" >> "$OUTPUT_FILE"
echo '```text' >> "$OUTPUT_FILE"
gcloud sql instances list --project=$PROJECT_ID >> "$OUTPUT_FILE" 2>&1
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 4. Check Artifact Registry Repositories
echo "Checking Artifact Registry Repositories..."
echo "## 4. Artifact Registry (Docker images)" >> "$OUTPUT_FILE"
echo '```text' >> "$OUTPUT_FILE"
gcloud artifacts repositories list --project=$PROJECT_ID >> "$OUTPUT_FILE" 2>&1
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 5. Check Compute Engine Disks
echo "Checking Compute Disks..."
echo "## 5. Compute Engine Disks (Persistent Storage)" >> "$OUTPUT_FILE"
echo '```text' >> "$OUTPUT_FILE"
gcloud compute disks list --project=$PROJECT_ID >> "$OUTPUT_FILE" 2>&1
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 6. Check Cloud Run Services
echo "Checking Cloud Run Services..."
echo "## 6. Cloud Run Services" >> "$OUTPUT_FILE"
echo '```text' >> "$OUTPUT_FILE"
gcloud run services list --project=$PROJECT_ID --quiet >> "$OUTPUT_FILE" 2>&1
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Finalize
echo "Cost check script completed successfully!"
echo "Please review ${OUTPUT_FILE} for details."
