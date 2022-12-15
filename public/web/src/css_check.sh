#!/usr/bin/env bash

echo "Running CSS checker..."

for tag in `grep '^\.' index.css | awk '{print \$1}'`; do
  base=`echo ${tag} | awk -F\. '{print \$2}'`
  # echo "Checking tag: ${base}"
  grep -r ${base} App.js components/* >/dev/null 2>&1
  [ $? -ne 0 ] && echo "    Tag not found: ${base}"
done
