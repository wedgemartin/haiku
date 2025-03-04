#!/usr/bin/env bash

service nginx start
( cd /var/apps/haiku ; bin/start )

