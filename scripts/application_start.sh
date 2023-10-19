#!/bin/bash
sudo chmod -R 777 /home/ec2-user/express-app

#navigate into our working directory
cd /home/ec2-user/express-app

# add npm and node to path
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # Loads NVM
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # Loads NVM bash_completion

npm install

node app.js > app.out.log 2> app.err.log < /dev/null &