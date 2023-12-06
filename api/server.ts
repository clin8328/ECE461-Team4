import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { query } from "./database";
import winston from "winston";
const app = express();
const path = require('path');
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(path.join(__dirname, 'static')))
const logfilepath = path.join(__dirname, 'log', 'logfile.log');
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.simple()
);
const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logfilepath }) // Log to a file
  ],
});
//endpoints
import ResetRegistry from "./endpoints/resetregistry";
import authenticate from "./endpoints/authenticate";
import packages from "./endpoints/getAllPkg";
import packageById from "./endpoints/getPkgById";
import updatePkgById from "./endpoints/updatePkgById";
import deletePkgById from "./endpoints/deletePkgById";
import uploadPackage from "./endpoints/uploadPkg";
import ratePkgById from "./endpoints/ratePkgById";
import getPkgByName from "./endpoints/getPkgByName";
import deletePkgByName from "./endpoints/deletePkgByName";
import getPackageByRegex from "./endpoints/getPkgByRegex";

app.use((req, res, next) => {
  // Log the request information
  logger.info(`${req.method} ${req.url} | Request Headers: ${JSON.stringify(req.headers)}${(req.method === 'POST' || req.method === 'PUT') ? ` | Request Body: ${JSON.stringify(req.body)}` : ''}`);
  next();
});

app.post("/packages", packages)
app.put('/authenticate', authenticate);
app.delete('/reset', ResetRegistry);
app.get('/package/:id', packageById);
app.put('/package/:id', updatePkgById);
app.delete('/package/:id', deletePkgById);
app.post('/package', uploadPackage);
app.get('/package/:id/rate', ratePkgById);
app.get('/package/byName/:name', getPkgByName);
app.delete('/package/byName/:name', deletePkgByName);
app.post('/package/byRegex', getPackageByRegex);


app.get('/', async (req, res) => {
  res.sendFile('index.html');
})
app.listen(2000, () => {
  console.log("Server running on port 2000");
});
