#!/bin/bash
set -e
ssh-keygen -A
service cron start
exec /usr/sbin/sshd -D
