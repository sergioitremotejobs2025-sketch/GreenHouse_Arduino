#!/bin/bash
# setup-zones.sh
# Script to configure MongoDB Zone Sharding for Sovereign Sharding

# Wait for mongos to be ready
until mongo --eval "db.adminCommand('ping')" --quiet; do
  echo "Waiting for mongos..."
  sleep 5
done

echo "🚀 Configuring Sharded Cluster..."

# Initialize the config server replica set (this should be done on the config server, but we can try via mongos if authenticated)
# Actually, it's better to do it once the pods are up. 
# For this task, I'll provide the commands that need to be run.

cat <<EOF | mongo
// 1. Add Shards to the cluster
sh.addShard("shard-eurs/mongo-shard-eu-0.mongo-shard-eu.default.svc.cluster.local:27017")
sh.addShard("shard-usrs/mongo-shard-us-0.mongo-shard-us.default.svc.cluster.local:27017")

// 2. Enable Sharding for the database
sh.enableSharding("iot")

// 3. Define Zones (Tags)
sh.addShardTag("shard-eurs", "EU")
sh.addShardTag("shard-usrs", "US")

// 4. Shard the collections based on jurisdiction
// We shard by jurisdiction (hashed or ranged) and timestamp for better distribution
sh.shardCollection("iot.humidities", { "jurisdiction": 1, "timestamp": 1 })
sh.shardCollection("iot.temperatures", { "jurisdiction": 1, "timestamp": 1 })
sh.shardCollection("iot.lights", { "jurisdiction": 1, "timestamp": 1 })
sh.shardCollection("iot.pictures", { "jurisdiction": 1, "timestamp": 1 })

// 5. Assign Tag Ranges to Zones
sh.addTagRange("iot.humidities", { "jurisdiction": "EU", "timestamp": MinKey }, { "jurisdiction": "EU", "timestamp": MaxKey }, "EU")
sh.addTagRange("iot.humidities", { "jurisdiction": "US", "timestamp": MinKey }, { "jurisdiction": "US", "timestamp": MaxKey }, "US")

sh.addTagRange("iot.temperatures", { "jurisdiction": "EU", "timestamp": MinKey }, { "jurisdiction": "EU", "timestamp": MaxKey }, "EU")
sh.addTagRange("iot.temperatures", { "jurisdiction": "US", "timestamp": MinKey }, { "jurisdiction": "US", "timestamp": MaxKey }, "US")

sh.addTagRange("iot.lights", { "jurisdiction": "EU", "timestamp": MinKey }, { "jurisdiction": "EU", "timestamp": MaxKey }, "EU")
sh.addTagRange("iot.lights", { "jurisdiction": "US", "timestamp": MinKey }, { "jurisdiction": "US", "timestamp": MaxKey }, "US")

sh.addTagRange("iot.pictures", { "jurisdiction": "EU", "timestamp": MinKey }, { "jurisdiction": "EU", "timestamp": MaxKey }, "EU")
sh.addTagRange("iot.pictures", { "jurisdiction": "US", "timestamp": MinKey }, { "jurisdiction": "US", "timestamp": MaxKey }, "US")

echo "✅ Sovereign Sharding configured!"
EOF
