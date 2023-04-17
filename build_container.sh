#!/usr/bin/env bash

(cd public/web ; yarn install ; yarn build)
docker build .
