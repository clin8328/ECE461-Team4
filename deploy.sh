pm2 delete 461Server

pm2 start ./api/pm2.config.json

pm2 save

pm2 logs 461Server