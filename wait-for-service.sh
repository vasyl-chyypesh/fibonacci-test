#!/bin/bash

# First argument is 'service_name' with the actual service name (e.g., rabbitmq)
# Second argument is port number (e.g., 5672)
host="$1"
port="$2"
shift 2
cmd="$@"

until nc -z "$host" "$port"; do
  echo "Waiting for $host:$port to be available..."
  sleep 1
done

exec $cmd
