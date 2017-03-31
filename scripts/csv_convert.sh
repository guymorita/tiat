#!/usr/bin/env bash

for file in scripts/convos/raw_csv/*
do
  new_file=${file/raw_csv/raw_json}
  new_file="${new_file%.csv}.json"
  csvtojson "$file" > "$new_file"
done

for file in scripts/characters/raw_csv/*
do
  new_file=${file/raw_csv/json}
  new_file="${new_file%.csv}.json"
  csvtojson "$file" > "$new_file"
done
