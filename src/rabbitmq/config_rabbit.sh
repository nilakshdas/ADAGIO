#!/bin/bash

# This script needs to be executed just once
if [ -f /$0.completed ] ; then
  echo "`date '+%Y-%m-%d %H:%M:%S'`.000 [$0] /$0.completed found, skipping run"
  exit 0
fi

# Wait for RabbitMQ startup
for (( ; ; )) ; do
  sleep 2
  rabbitmqctl -q node_health_check > /dev/null 2>&1
  if [ $? -eq 0 ] ; then
    echo "`date '+%Y-%m-%d %H:%M:%S'`.000 [$0] rabbitmq is now running"
    break
  else
    echo "`date '+%Y-%m-%d %H:%M:%S'`.000 [$0] waiting for rabbitmq startup"
  fi
done

# Execute RabbitMQ config commands here

# Add vhosts
rabbitmqctl add_vhost preprocess
rabbitmqctl add_vhost transcribe
rabbitmqctl add_vhost attack
echo "`date '+%Y-%m-%d %H:%M:%S'`.000 [$0] vhosts created"

# Set permissions for vhosts
rabbitmqctl set_permissions -p preprocess admin ".*" ".*" ".*"
rabbitmqctl set_permissions -p transcribe admin ".*" ".*" ".*"
rabbitmqctl set_permissions -p attack admin ".*" ".*" ".*"
echo "`date '+%Y-%m-%d %H:%M:%S'`.000 [$0] permissions set for vhosts"

# Create mark so script is not ran again
touch /$0.completed
