#!/bin/bash

DB=data.db

for i in {001..200} ; do
echo "insert into customer(name,email) values('a$i','a$i@example.com')"  \
| sqlite3 $DB
done

for i in {001..003} ; do
echo "insert into user(name,email,disabled) values('a$i','a$i@example.com','0')" | sqlite3 $DB
done

for i in {004..006} ; do
echo "insert into user(name,email,disabled) values('a$i','a$i@example.com','1')" | sqlite3 $DB
done


echo "select * from customer" | sqlite3 $DB
echo "select * from user" | sqlite3 $DB

echo "select * from sessions" | sqlite3 cache.db 
