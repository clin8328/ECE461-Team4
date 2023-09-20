import { ESLint } from 'eslint';
import { type } from 'os';
import * as fs from 'fs';
import * as path from 'path';


class Correctness {
  // Properties
  directory_path: string; //the absolute path to the repository
  blacklist: string[]; 
  
  // Constructor
  constructor(directory_path: string) {
    this.directory_path = directory_path;
    this.blacklist = ['modules', 'dist'];
  }

  // Method
  async getMetric(): Promise<number> {
    let jsts_files: string[] = this.getAlltsjsFiles(this.directory_path);
    let errors: number = 0;
    let lines: number = 0;
    for (let file of jsts_files) {
      errors += await lintFile(file);
      lines += await countLinesInFile(file);
    }

    console.log("errors: ", errors, " | lines: ", lines);
    console.log("metric: ", errors/lines);
    return errors / lines;
  }

  getAlltsjsFiles(filepath: string): string[] {
    var files: string[] = [];
    this.fileRecurser(filepath, files);
    return files;
  }

  fileRecurser(filepath: string, files: string[]) {
    if (!fs.statSync(filepath).isDirectory()) {
      //console.log("file: ", filepath);
      if (filepath.slice(-2) == 'js' || filepath.slice(-2) == 'ts') {
        files.push(filepath);
      }
    } else if (!setIncludes(filepath, this.blacklist)) {
      const dirfiles = fs.readdirSync(filepath); // Read the directory synchronously
      //console.log("\n\nDirectory: ", filepath);
      //console.log(files);
      for (const file of dirfiles) {
        const absolutePath = path.join(filepath, file); // Construct absolute path
        this.fileRecurser(absolutePath, files);
      }
    }
  }
}

async function lintFile(filePath: string): Promise<number> {
  // Initialize ESLint
  const eslint = new ESLint();

  try {
    // Lint the specified file
    const results = await eslint.lintFiles([filePath]);

    //Parse the errors from the linting results
    const formatter = await eslint.loadFormatter('stylish');
    const resultText = await formatter.format(results);
    const errors = resultText.split('\n').slice(2, -4);

    return errors.length;
  } catch (error) {
    console.error('An error occurred while running ESLint:', error);
    process.exit(1);
  }
}

function countLinesInFile(filePath: string): Promise<number> {
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

function setIncludes(str: string, list: string[]): boolean {
  for (let elem of list) {
    if (str.includes(elem)) {
      return true
    }
  }
  return false;
}

//let metric = new Correctness('/home/shay/a/jwstoneb/SWE/ECE461-Team4');
//metric.getMetric();

//getAlltsjsFiles('/home/shay/a/jwstoneb/SWE/ECE461-Team4');

// // Example usage:
// const filePath = '/home/shay/a/jwstoneb/SWE/ECE461-Team4/src/example.ts';

// countLinesInFile(filePath)
//   .then((lineCount) => {
//     console.log(`Number of lines in ${filePath}: ${lineCount}`);
//   })
//   .catch((error) => {
//     console.error(`Error reading file: ${error.message}`);
//   });



//lintFile('/home/shay/a/jwstoneb/SWE/ECE461-Team4/src/logConfig.ts');
