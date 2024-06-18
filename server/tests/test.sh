#!/bin/zsh -e

# Exit immediately if a command exits with a non-zero status.
set -e

# Bring down any existing test containers
sudo docker compose -f docker-compose.test.yml down

# Build the test containers
sudo docker compose -f docker-compose.test.yml build

# Run the test containers in detached mode
sudo docker compose -f docker-compose.test.yml up -d

# Get the name of the test container
test_container=$(sudo docker compose -f docker-compose.test.yml ps -q backend)

# Function to get the status of the test container
get_test_status() {
    sudo docker inspect -f '{{.State.Status}}' "$test_container"
}

# Function to get the exit code of the test container
get_test_exit_code() {
    sudo docker inspect -f '{{.State.ExitCode}}' "$test_container"
}

# Wait for the test container to finish
while [ "$(get_test_status)" = "running" ]; do
    sleep 2
done

# Capture and print the logs
sudo docker logs "$test_container"

# Capture the exit code of the test container
exit_code=$(get_test_exit_code)

# Clean up the test containers
sudo docker compose -f docker-compose.test.yml down

# Exit with the captured exit code
if [ "$exit_code" -ne 0 ]; then
    exit 1
else
    exit 0
fi
