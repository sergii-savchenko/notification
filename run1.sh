#!/bin/sh

echo "Starting subscribers"
docker-compose up -d --scale subscriber=25 subscriber
sleep 3
echo "Starting publisher"
docker-compose up -d publisher
