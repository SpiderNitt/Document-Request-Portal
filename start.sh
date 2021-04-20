#!/bin/bash
echo "waiting for mysql to be setup"

while :
do
(echo -n > /dev/tcp/localhost/3306) > /dev/null 2>&1
if [ $? -eq 0 ]
then
echo "Mysql setup completed setting up web app"
npm i
npm i -g pm2
if [ "$1" = "seed" ]
then
cd database
node seed.js
cd ..
fi
./deploy.sh deploy
cd public/
npm i
npm start
break
fi 
sleep 1
done