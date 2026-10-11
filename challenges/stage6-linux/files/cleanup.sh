#!/bin/bash
# Housekeeping: clear stale temp files older than a day.
find /tmp -type f -mtime +1 -delete 2>/dev/null
