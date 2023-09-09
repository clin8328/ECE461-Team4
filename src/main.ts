/*
  Original Author: Will Stonebridge
  Date edit: 9/9/2023
*/

import process from 'process';
import fs from 'fs';

const url_path: string = process.argv[2];
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
process.exit(0); //exit successfully