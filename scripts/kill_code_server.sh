#!/bin/bash
# This script finds and kills all processes with "code-server" in their name

# Find and kill all processes with "code-server" in their name
ps aux | grep "code-server" | grep -v grep | awk '{print $2}' | xargs -r kill -9
