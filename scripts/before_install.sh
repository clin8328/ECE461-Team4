#!/bin/bash

#download node and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/. nvm/nvm.sh
nvm install node

# Create Working Directory If It Doesn't Exist
DIR="/home/ec2user/express-app"
if [ -d "$DIR" ]; then
  echo "$DIR exists"
else
  echo "$DIR does not exist"
  mkdir $DIR
fi