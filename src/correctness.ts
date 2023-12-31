/*
Author: Will Stonebridge

Correctness is calculated by totalling the linter errors within all source files and dividing by the number of
lines within all source files. 
*/

import { ESLint } from 'eslint';
import { type } from 'os';
import * as fs from 'fs';
import * as path from 'path';

import {Metric} from './metric';


export class Correctness extends Metric {
  // Properties
  directory_path: string; //the absolute path to the repository
  blacklist: string[]; 
  
  // Constructor
  constructor(url: string, directRepoPath?: string) {
      super(url, "Correctness");

      if (directRepoPath) {
          this.directory_path = directRepoPath;
      } else {
          // Handle the case when metricName is not provided
          this.directory_path = this.clone_path;
      }

      this.blacklist = ['test', 'module', 'dist', '@', '.bin', '.git']; //list of names that should not be counted as source files
    }

  // Method
  async getMetric(): Promise<number> {
    let jsts_files: string[] = this.getAlltsjsFiles(this.clone_path);

    let errors: number = 0;
    let lines: number = 0;
    for (let file of jsts_files) {
      try{
      errors += await lintFile(file);
      }
      catch(error:any){
        this.logger.debug('getMetric: Error: ' + error.message);
        return -1;
      }
      lines += await countLinesInFile(file);
    }


    //console.log(jsts_files);
    this.logger.info("errors: ", errors, " | lines: ", lines);
    this.logger.info("metric: ", 1 - errors/lines);
    if (lines == 0) {
      return 0;
    } else {
      return Math.round((1 - errors / lines)*100) / 100;
    }

  }

  getAlltsjsFiles(filepath: string): string[] {
    var files: string[] = [];
    this.fileRecurser(filepath, files);
    return files;
  }

  fileRecurser(filepath: string, files: string[]) {
    if (!fs.statSync(filepath).isDirectory()) {
      //this.logger.info("file: ", filepath);
      
      if (filepath.slice(-3) != 'txt') {
        if (filepath.includes('eslintrc')) {
          fs.unlink(filepath, (err) => {
            if (err) {
              this.logger.debug(`fileRecursor: Error deleting file: ${err}`);
            }});
        } else {
          files.push(filepath);
        }
      }
    } else if (!setIncludes(filepath, this.blacklist)) {
      const dirfiles = fs.readdirSync(filepath); // Read the directory synchronously
      //this.logger.info("\n\nDirectory: ", filepath);
      //this.logger.info(files);
      for (const file of dirfiles) {
        const absolutePath = path.join(filepath, file); // Construct absolute path
        this.fileRecurser(absolutePath, files);
      }
    }
  }
}

export async function lintFile(filePath: string): Promise<number> {
  // Initialize ESLint
  const eslint = new ESLint();
  
  // Lint the specified file
  if (setIncludes(filePath, ['.txt'])) {
    throw new Error("File must contain code");
  }
  const results = await eslint.lintFiles([filePath]);

  //Parse the errors from the linting results
  const formatter = await eslint.loadFormatter('stylish');
  const resultText = await formatter.format(results);
  const errors = resultText.split('\n').slice(2, -3);

  return errors.length;
}

export function countLinesInFile(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const lines = data.split('\n');
      const lineCount = lines.length;

      resolve(lineCount);
    });
  });
}

export function setIncludes(str: string, list: string[]): boolean {
  for (let elem of list) {
    if (str.includes(elem)) {
      return true;
    }
  }
  return false;
}

// async function gitTest() {
//   let metric = new Correctness('https://github.com/KillianLucas/open-interpreter/');
//   //await metric.cloneRepository();
//   let value = await metric.getMetric();
//   //await metric.deleteRepository();
// }
// gitTest();

// let metric = new Correctness('/home/shay/a/jwstoneb/SWE/ECE461-Team4');
// metric.getMetric();

//getAlltsjsFiles('/home/shay/a/jwstoneb/SWE/ECE461-Team4');

// // Example usage:
// const filePath = '/home/shay/a/jwstoneb/SWE/ECE461-Team4/src/example.ts';

// countLinesInFile(filePath)
//   .then((lineCount) => {
//     this.logger.info(`Number of lines in ${filePath}: ${lineCount}`);
//   })
//   .catch((error) => {
//     console.error(`Error reading file: ${error.message}`);
//   });



// lintFile('/home/shay/a/jwstoneb/SWE/ECE461-Team4/src/testing/example.ts').then((data) => {
//   this.logger.info(data);
// });
