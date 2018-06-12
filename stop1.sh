#!/bin/sh

echo "Stopping subscribers"
docker-compose up -d --scale subscriber=0 subscriber
sleep 3
echo "Stopping publisher"
docker-compose up -d --scale publisher=0 publisher
