/*
  Original Author: Will Stonebridge
  Date edit: 9/9/2023
*/

import process from 'process';
import fs from 'fs';
import {License} from './license';

const url_path: string = process.argv[2];

let x = new License('https://github.com/cloudinary/cloudinary_npm', 'test-clone')
x.cloneRepository();
const license_metric = x.Find_And_ReadLicense();
x.deleteRepository();
console.log(license_metric);


/*
fs.readFile(url_path, 'utf8', (err, file_lines) => {
    if (err) {
      console.log('Error reading file'); //TODO: log file I/O failure
      process.exit(1);
    }
    console.log("no error");
    const urls : string[] = file_lines.split('\n');
    console.log(urls);
  });
  
console.log('success');
process.exit(0); //exit successfully*/