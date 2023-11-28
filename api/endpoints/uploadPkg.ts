import express, { Request, Response } from "express";
import * as crypto from "crypto";
import { query } from "../database";
import { verifyToken } from "../common";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import axios from "axios";
import terser, {} from "terser";
import {exec} from 'child_process';
import { rimrafSync } from 'rimraf';
const jsonminify = require('jsonminify')
const rootPath = path.join(__dirname, '..');
async function uploadPackage(req: Request, res: Response) {
  const request = req.body;
  const token = req.headers['x-authorization'] as string;
  const enable_debloat = req.query['debloat-enabled'] === 'true' || false;
  const jsprogram = req.body.JSProgram || null;
  //if the token is not valid, return 400
  let decoded = null;
  try {
    decoded = await verifyToken(token);
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
  if (!decoded) return res.sendStatus(400)
  //check the request body, content and url
  if ((request.Content && request.URL) || (!request.Content && !request.URL)) return res.sendStatus(400);
  //upload with encoded content
  if (request.Content) {
    if (!isValidBase64(request.Content)) return res.sendStatus(400);
    const username = decoded[1].username;
    //handle the file
    const buffer = Buffer.from(request.Content, "base64");
    fs.writeFileSync(path.join(rootPath, 'upload.zip'), buffer);
    try {
      await unzipFile(path.join(rootPath, 'upload.zip'), path.join(rootPath, 'uploads'));
    } catch (err) {
      console.error(err);
      cleanUp();
      return res.sendStatus(400);
    }
    const packageJsonFilePath = getPackageJsonFilePathRecursive(path.join(rootPath, 'uploads'));
    if (!packageJsonFilePath) return res.sendStatus(400);
    const pkgInfo = parsePackageJson(packageJsonFilePath);
    //check if the package is already in the database
    const pkg = await query('SELECT * FROM Packages WHERE package_id = $1', [pkgInfo.id]);
    //return 409 if the package is already in the database
    if (pkg.rowCount && pkg.rowCount > 0) {
      cleanUp();
      return res.sendStatus(409);
    }
    //debloat feature
    if (enable_debloat){
      await processFolder(path.join(rootPath, 'uploads'));
      const encodezip = await zipAndEncodeFolder(path.join(rootPath, 'uploads'));
      const debloatbuffer = Buffer.from(encodezip, 'base64');
      //insert the package into the database
      const pkgInsert = await query('INSERT INTO packages (package_id, package_version, package_name, package_url, jsprogram, package_zip ) VALUES($1, $2, $3, $4, $5, $6)', [pkgInfo.id, pkgInfo.version, pkgInfo.name, pkgInfo.url, jsprogram, debloatbuffer]);
      const hisInsert = await query('INSERT INTO packageHistory (user_name, user_action, package_id) VALUES($1, $2, $3)', [username, 'CREATE', pkgInfo.id]);
      debloatCleanUp();
      const payload = getPayload(pkgInfo, jsprogram);
      payload.data.Content = encodezip.toString();
      return res.status(201).json(payload);
    } else {
      const pkgInsert = await query('INSERT INTO packages (package_id, package_version, package_name, package_url, jsprogram, package_zip ) VALUES($1, $2, $3, $4, $5, $6)', [pkgInfo.id, pkgInfo.version, pkgInfo.name, pkgInfo.url, jsprogram, buffer]);
      const hisInsert = await query('INSERT INTO packageHistory (user_name, user_action, package_id) VALUES($1, $2, $3)', [username, 'CREATE', pkgInfo.id]);
      cleanUp();
      const payload = getPayload(pkgInfo, jsprogram);
      payload.data.Content = request.Content;
      return res.status(201).json(payload);
    }
  } else if (request.URL) {
    /* rating feature for ingestion
    fs.writeFileSync(`${__dirname}/../one-url.txt`, request.URL);
    const rate = await runTsc();
    const jsonrate = JSON.parse(rate);
    let isIngestable = true
    Object.entries(jsonrate).forEach(([key, value]) => {
      if (key != 'URL' && key != 'NET_SCORE') {
        const score = parseFloat(value as string);
        if (score < 0.5) isIngestable = false
      }
    })
    if (!isIngestable) return res.sendStatus(424);
    */
    const username = decoded[1].username;
    const urls = parseUrl(request.URL);
    let response = null
    try {
      response = await axios.get(urls[0], { responseType: 'arraybuffer' })
      if (response.status !== 200) {
        response = await axios.get(urls[1], { responseType: 'arraybuffer' })
      }
    } catch (err) {
      console.error(err);
      return res.sendStatus(400);
    }
    if (!response.data) return res.sendStatus(400);
    const bytea = response.data;
    fs.writeFileSync(path.join(rootPath, 'upload.zip'), response.data);
    try {
      await unzipFile(path.join(rootPath, 'upload.zip'), path.join(rootPath, 'uploads'));
    } catch (err) {
      console.error(err);
      cleanUp();
      return res.sendStatus(400);
    }
    const packageJsonFilePath = getPackageJsonFilePathRecursive(path.join(rootPath, 'uploads'));
    if (!packageJsonFilePath) return res.sendStatus(400);
    const pkgInfo = parsePackageJson(packageJsonFilePath);
    const pkg = await query('SELECT * FROM packages WHERE package_id = $1', [pkgInfo.id]);
    if (pkg.rowCount > 0) {
      cleanUp();
      return res.sendStatus(409);
    }
    //debloat feature
    if (enable_debloat) {
      await processFolder(path.join(rootPath, 'uploads'));
      const encodezip = await zipAndEncodeFolder(path.join(rootPath, 'uploads'));
      const debloatbuffer = Buffer.from(encodezip, 'base64');
      const pkgInsert = await query('INSERT INTO packages (package_id, package_version, package_name, package_url, jsprogram, package_zip ) VALUES($1, $2, $3, $4, $5, $6)', [pkgInfo.id, pkgInfo.version, pkgInfo.name, pkgInfo.url, jsprogram, debloatbuffer]);
      const hisInsert = await query('INSERT INTO packageHistory (user_name, user_action, package_id) VALUES($1, $2, $3)', [username, 'CREATE', pkgInfo.id]);
      debloatCleanUp();
      const payload = getPayload(pkgInfo, jsprogram);
      payload.data.Content = encodezip.toString();
      res.status(201).json(payload);
    } else {
      const pkgInsert = await query('INSERT INTO packages (package_id, package_version, package_name, package_url, jsprogram, package_zip ) VALUES($1, $2, $3, $4, $5, $6)', [pkgInfo.id, pkgInfo.version, pkgInfo.name, pkgInfo.url, jsprogram, bytea]);
      const hisInsert = await query('INSERT INTO packageHistory (user_name, user_action, package_id) VALUES($1, $2, $3)', [username, 'CREATE', pkgInfo.id]);
      cleanUp();
      const payload = getPayload(pkgInfo, jsprogram);
      payload.data.Content = bytea.toString();
      res.status(201).json(payload);
    }
    
  }
}

function getPayload(pkgInfo: any, jsprogram: string) : any {
  return {
    metadata: {
      Name: pkgInfo.name,
      Version: pkgInfo.version,
      ID: pkgInfo.id,
    },
    data: {
      JSProgram: jsprogram,
    }
  }
}
function debloatCleanUp() {
  try {
    fs.unlinkSync(path.join(rootPath, 'debloat.zip'));
    fs.unlinkSync(path.join(rootPath, 'upload.zip'));
    fs.rmSync(path.join(rootPath, 'uploads'), { recursive: true });
    fs.mkdirSync(path.join(rootPath, 'uploads'));
  } catch (err) {
    console.error(err);
  }
}
function cleanUp() {
  try {
    fs.unlinkSync(path.join(rootPath, 'upload.zip'));
    fs.rmSync(path.join(rootPath, 'uploads'), { recursive: true });
    fs.mkdirSync(path.join(rootPath, 'uploads'));
  } catch (err) {
    console.error(err);
  }
}
function parseUrl(url: string): string[] {
  const endpoint1 = url + '/archive/master.zip'
  const endpoint2 = url + '/archive/main.zip' 
  return [endpoint1, endpoint2]
}
function getPackageJsonFilePathRecursive(folderPath: string): string | null {
  const files = fs.readdirSync(folderPath);

  const packageJsonFile = files.find((file) => file === 'package.json');

  if (packageJsonFile) {
    return path.join(folderPath, packageJsonFile);
  }

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      const packageJsonPath = getPackageJsonFilePathRecursive(filePath);
      if (packageJsonPath) {
        return packageJsonPath;
      }
    }
  }
  return null;
}

async function unzipFile(zipFilePath: string, destinationPath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      const zip = new AdmZip(zipFilePath);
      zip.extractAllTo(destinationPath, true);
      console.log('Extraction completed successfully.');
      resolve();
    } catch (error) {
      console.error('Error during extraction:', error);
      reject(error);
    }
  });
}

async function zipAndEncodeFolder(folderPath: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      const items = fs.readdirSync(folderPath);
      const subdirectoryName = items.find(item => fs.statSync(path.join(folderPath, item)).isDirectory());
      if (!subdirectoryName) {
         throw new Error(`No subdirectories found in '${folderPath}'.`);
      }
      const subdirectoryPath = path.join(folderPath, subdirectoryName);
      const zip = new AdmZip();
      zip.addLocalFolder(subdirectoryPath);
      const zipBuffer = zip.toBuffer();
      const base64String = zipBuffer.toString('base64');
      fs.writeFileSync('debloat.zip', zipBuffer);
      resolve(base64String);
    } catch (error) {
      console.error('Error during zipping:', error);
      reject(error);
    }
  })
}


function parsePackageJson(path: string): { name: string; version: string; url: string; id: string} {
  const content = fs.readFileSync(path, 'utf8');
  const packageJson = JSON.parse(content);
  const pkg_id = getPackageId(packageJson.name, packageJson.version);
  const pkg_name = packageJson.name.charAt(0).toUpperCase() + packageJson.name.slice(1);
  const pkg_version = packageJson.version;
  let pkg_url = packageJson.repository.url;
  if (packageJson.repository.type == 'git') pkg_url = pkg_url.replace('git://', 'http://')
  return { name: pkg_name, version: pkg_version, url: pkg_url, id: pkg_id};
}
function getPackageId(name: string, version: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(name + version);
  return hash.digest('hex');
}
function isValidBase64(str: string): boolean {
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
  return base64Regex.test(str);
}

function runTsc(): Promise<string> {
  return new Promise((resolve, reject) => {
    const rootPath = path.join(__dirname, '..', '..');
    const command = 'tsc && node ./dist/src/main.js ./api/one-url.txt';

    exec(command, { cwd: rootPath }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(new Error(stderr));
        return;
      }
      resolve(stdout);
    });
  });
}

async function minifyJS(filePath: string) {
  const code = fs.readFileSync(filePath, 'utf-8');
  try {
    const result = await terser.minify(code);
    fs.writeFileSync(filePath, result.code as string);
  } catch (err) {
    console.error(err);
    console.error(`Error minifying ${filePath}`);
  }
}

async function processFolder(folderPath: string):Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      const files = fs.readdirSync(folderPath);
      
      files.forEach(async file => {
      const filePath = path.join(folderPath, file);
      if (fs.statSync(filePath).isDirectory() && (file === '.git' || file === '.github')) {
        // If it's .git or .github, delete the entire folder using rimraf
        await deleteFolder(filePath);
      }
      else if (fs.statSync(filePath).isDirectory()) {
      // If it's a directory, recursively process it
      processFolder(filePath);
      } else if (file.endsWith('.js') && !file.endsWith('.min.js')) {
      // If it's a JavaScript file, minify it in place
        await minifyJS(filePath);
      } else if (file.endsWith('.json')) {
        await minifyJSON(filePath);
      }
      });
      resolve();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  })
}
async function minifyJSON(filePath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
      try {
          const jsonData = fs.readFileSync(filePath, 'utf8');
          const minifiedData = jsonminify(jsonData);

          fs.writeFileSync(filePath, minifiedData, 'utf8');

          resolve();
      } catch (err) {
          console.error(err);
          reject(err);
      }
  });
}
async function deleteFolder(folderPath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
      rimrafSync(folderPath)
      resolve();
  });
}
export default uploadPackage;
