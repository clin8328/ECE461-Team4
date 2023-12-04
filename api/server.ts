import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cors from 'cors';
import { query } from "./database";
const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '100mb'}));
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
  res.status(200).send("Welcome to the ECE461 Phase 2 Team3, still need Frontend ");
})
app.listen(2000, () => {
  console.log("Server running on port 2000");
});
