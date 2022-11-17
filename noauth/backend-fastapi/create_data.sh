#!/bin/bash


for i in {001..200} ; do
echo "insert into customer(name,email) values('a$i','a$i@example.com')"  \
| sqlite3 test.db
done

