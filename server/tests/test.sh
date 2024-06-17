#!/bin/zsh -x

sudo docker compose -f docker-compose.test.yml down
sudo docker compose -f docker-compose.test.yml build
sudo docker compose -f docker-compose.test.yml up