"use strict";
/*
Author: Will Stonebridge

Correctness is calculated by totalling the linter errors within all source files and dividing by the number of
lines within all source files.
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIncludes = exports.countLinesInFile = exports.lintFile = exports.Correctness = void 0;
const eslint_1 = require("eslint");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const metric_1 = require("./metric");
class Correctness extends metric_1.Metric {
    // Constructor
    constructor(url, directRepoPath) {
        super(url, "Correctness");
        if (directRepoPath) {
            this.directory_path = directRepoPath;
        }
        else {
            // Handle the case when metricName is not provided
            this.directory_path = this.clone_path;
        }
        this.blacklist = ['test', 'module', 'dist', '@', '.bin', '.git']; //list of names that should not be counted as source files
    }
    // Method
    getMetric() {
        return __awaiter(this, void 0, void 0, function* () {
            let jsts_files = this.getAlltsjsFiles(this.clone_path);
            let errors = 0;
            let lines = 0;
            for (let file of jsts_files) {
                try {
                    errors += yield lintFile(file);
                }
                catch (error) {
                    this.logger.debug('getMetric: Error: ' + error.message);
                    return -1;
                }
                lines += yield countLinesInFile(file);
            }
            //console.log(jsts_files);
            this.logger.info("errors: ", errors, " | lines: ", lines);
            this.logger.info("metric: ", 1 - errors / lines);
            if (lines == 0) {
                return 0;
            }
            else {
                return Math.round((1 - errors / lines) * 100) / 100;
            }
        });
    }
    getAlltsjsFiles(filepath) {
        var files = [];
        this.fileRecurser(filepath, files);
        return files;
    }
    fileRecurser(filepath, files) {
        if (!fs.statSync(filepath).isDirectory()) {
            //this.logger.info("file: ", filepath);
            if (filepath.slice(-3) != 'txt') {
                if (filepath.includes('eslintrc')) {
                    fs.unlink(filepath, (err) => {
                        if (err) {
                            this.logger.debug(`fileRecursor: Error deleting file: ${err}`);
                        }
                    });
                }
                else {
                    files.push(filepath);
                }
            }
        }
        else if (!setIncludes(filepath, this.blacklist)) {
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
exports.Correctness = Correctness;
function lintFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        // Initialize ESLint
        const eslint = new eslint_1.ESLint();
        // Lint the specified file
        if (setIncludes(filePath, ['.txt'])) {
            throw new Error("File must contain code");
        }
        const results = yield eslint.lintFiles([filePath]);
        //Parse the errors from the linting results
        const formatter = yield eslint.loadFormatter('stylish');
        const resultText = yield formatter.format(results);
        const errors = resultText.split('\n').slice(2, -3);
        return errors.length;
    });
}
exports.lintFile = lintFile;
function countLinesInFile(filePath) {
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
exports.countLinesInFile = countLinesInFile;
function setIncludes(str, list) {
    for (let elem of list) {
        if (str.includes(elem)) {
            return true;
        }
    }
    return false;
}
exports.setIncludes = setIncludes;
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
