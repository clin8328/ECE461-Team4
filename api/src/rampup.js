"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RampUp = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const metric_1 = require("./metric");
class RampUp extends metric_1.Metric {
    constructor(url) {
        super(url, "RampUp");
    }
    countLinesInDir(directory, extension) {
        return __awaiter(this, void 0, void 0, function* () {
            let totalLines = 0;
            try {
                const files = yield fs_1.default.promises.readdir(directory);
                for (const file of files) {
                    const filePath = path_1.default.join(directory, file);
                    const stats = yield fs_1.default.promises.stat(filePath);
                    if (stats.isFile() && (filePath.endsWith(extension) || filePath.endsWith('.js')) && !filePath.includes('/test/') && !filePath.includes('/node_modules/')) {
                        const fileContent = yield fs_1.default.promises.readFile(filePath, 'utf-8');
                        const lines = fileContent.split('\n').length;
                        totalLines += lines;
                    }
                    else if (stats.isDirectory()) {
                        // Recursively search for TypeScript files in subdirectories
                        totalLines += yield this.countLinesInDir(filePath, extension);
                    }
                }
                return totalLines;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findReadmeFile(directory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield fs_1.default.promises.readdir(directory);
                for (const file of files) {
                    const filePath = path_1.default.join(directory, file);
                    if (file.toLowerCase() === 'readme.md' || file.toLowerCase() === 'readme.txt') {
                        return filePath;
                    }
                    else if ((yield fs_1.default.promises.stat(filePath)).isDirectory()) {
                        const readmePath = yield this.findReadmeFile(filePath);
                        if (readmePath) {
                            return readmePath;
                        }
                    }
                }
                return null;
            }
            catch (error) {
                throw error;
            }
        });
    }
    countLinesInReadme(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let lines = 0;
            try {
                const readmeContent = yield fs_1.default.promises.readFile(path, 'utf-8');
                lines = readmeContent.split('\n').length;
            }
            catch (error) {
                throw error;
            }
            this.logger.info("countLinesInReadme: path = " + path + ", lines = " + lines);
            return lines;
        });
    }
    rampup() {
        return __awaiter(this, void 0, void 0, function* () {
            const repoDirectory = this.clone_path; // Replace with the path to your cloned repository directory
            const extension = '.js'; // Change the file extension as needed
            const scale = 10; //How many lines of code in files to one line in the Readme
            let linesInFiles = 0; //LinesInFiles
            let linesInReadme = 0; //Lines in README
            let score;
            try {
                linesInFiles = yield this.countLinesInDir(repoDirectory, extension);
                const readmePath = yield this.findReadmeFile(repoDirectory);
                if (readmePath) {
                    const linesInReadme = yield this.countLinesInReadme(readmePath);
                    //this.logger.info(`Total lines in TypeScript files: ${linesInFiles}`);
                    //this.logger.info(`Total lines in README: ${linesInReadme}`);
                    score = Math.min(linesInFiles / (linesInReadme * scale), 1);
                }
                else {
                    this.logger.info('README not found in the repository for repo ' + this.repoName);
                    score = 0;
                }
            }
            catch (error) {
                this.logger.debug('rampup: Error: ' + error.message);
                score = -1;
            }
            return Math.round(score * 10000) / 10000;
        });
    }
}
exports.RampUp = RampUp;
// import * as fs from 'fs';
// import * as path from 'path';
// import * as ts from 'typescript';
// import * as tsCommentParser from 'ts-comment-parser';
// class RampUp {
//     url: string;
//     constructor(url: string){
//         this.url = url;
//     }
//     const srcDir = './src'; // Modify this path as per your project structure
//     countLines(filePath: string): { codeLines: number; commentLines: number } {
//         const fileContents = fs.readFileSync(filePath, 'utf8');
// const sourceFile = ts.createSourceFile(
//     filePath,
//     fileContents,
//     ts.ScriptTarget.Latest,
//     true
// );
//         let codeLines = 0;
//         let commentLines = 0;
//         tsCommentParser(fileContents).forEach((comment) => {
//             commentLines += comment.loc.end.line - comment.loc.start.line + 1;
//         });
//     ts.forEachChild(sourceFile, (node) => {
//         if (ts.isSourceFile(node)) {
//           return;
//         }
//         const startLine = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line;
//         const endLine = sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line;
//         codeLines += endLine - startLine + 1;
//       });
//       return { codeLines, commentLines };
//     }
//     async processFilesInDirectory(directoryPath: string) {
//         fs.readdirSync(directoryPath).forEach((file) => {
//         const filePath = path.join(directoryPath, file);
//         const stats = fs.statSync(filePath);
//         if (stats.isDirectory()) {
//           // If it's a directory, recursively process its contents
//           await this.processFilesInDirectory(filePath);
//         } else if (file.endsWith('.ts')) {
//           // If it's a TypeScript file, count its lines
//           const { codeLines, commentLines } = countLines(filePath);
//           totalCodeLines += codeLines;
//           totalCommentLines += commentLines;
//         }
//       });
//     }
//     function main() {
//       let totalCodeLines = 0;
//       let totalCommentLines = 0;
//       processFilesInDirectory(srcDir);
//       this.logger.info('Total Lines of Code:', totalCodeLines);
//       this.logger.info('Total Lines of Comments:', totalCommentLines);
//     }
//     main();
// }
