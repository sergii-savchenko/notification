#!/bin/sh

echo "Starting non-traceble subscribers"
docker-compose up -d --scale sub=5 sub
sleep 3
echo "Starting non-traceble publisher"
docker-compose up -d --scale pub=5 pub
