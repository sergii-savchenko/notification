#!/bin/sh

echo "Starting EMQ, Cassandra, creating schema"
docker-compose up -d cassandra cassandra-schema emq
sleep 10
echo "Starting Jaeger collector, query and agent"
docker-compose up -d jaeger-collector jaeger-query jaeger
