import fs from 'fs';
import path from 'path';

import {Metric} from './metric';

export class RampUp extends Metric {
    constructor(url: string) {
        super(url, "RampUp");
    }
    
    async countLinesInDir(directory: string, extension: string): Promise<number> {
        let totalLines = 0;
    
        try {
            const files = await fs.promises.readdir(directory);
    
            for (const file of files) {
                const filePath = path.join(directory, file);
                const stats = await fs.promises.stat(filePath);
    
                if (stats.isFile() && (filePath.endsWith(extension) || filePath.endsWith('.js')) && !filePath.includes('/test/') && !filePath.includes('/node_modules/')) {
                    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
                    const lines = fileContent.split('\n').length;
                    totalLines += lines;
                } else if (stats.isDirectory()) {
                    // Recursively search for TypeScript files in subdirectories
                    totalLines += await this.countLinesInDir(filePath, extension);
                }
            }
    
            return totalLines;
        } catch (error) {
            throw error;
        }
    }
    
    async findReadmeFile(directory: string): Promise<string | null> {
        try {
            const files = await fs.promises.readdir(directory);
    
            for (const file of files) {
                const filePath = path.join(directory, file);
    
                if (file.toLowerCase() === 'readme.md' || file.toLowerCase() === 'readme.txt') {
                    return filePath;
                } else if ((await fs.promises.stat(filePath)).isDirectory()) {
                    const readmePath = await this.findReadmeFile(filePath);
                    if (readmePath) {
                        return readmePath;
                    }
                }
            }
    
            return null;        
        } catch (error) {
            throw error;
        }
    }
    
    async countLinesInReadme (path : string): Promise <number> {
        let lines = 0;
        
        try {
            const readmeContent = await fs.promises.readFile(path, 'utf-8');
            lines = readmeContent.split('\n').length;
        } catch(error) {
            throw error;
        }
        this.logger.info("countLinesInReadme: path = " + path+", lines = " + lines)

        return lines;
    }
    
    async rampup():Promise <number> {
        const repoDirectory = this.clone_path; // Replace with the path to your cloned repository directory
        const extension = '.js'; // Change the file extension as needed
        const scale = 10; //How many lines of code in files to one line in the Readme
        let linesInFiles = 0; //LinesInFiles
        let linesInReadme = 0; //Lines in README
        let score: number;
    
        try {
            linesInFiles = await this.countLinesInDir(repoDirectory, extension);
            const readmePath = await this.findReadmeFile(repoDirectory);
    
            if (readmePath) {
                const linesInReadme = await this.countLinesInReadme(readmePath);
                //this.logger.info(`Total lines in TypeScript files: ${linesInFiles}`);
                //this.logger.info(`Total lines in README: ${linesInReadme}`);
    
                score = Math.min(linesInFiles / (linesInReadme * scale ), 1);
    
            } else {
                this.logger.info('README not found in the repository for repo ' + this.repoName);
                score = 0;
            }
            
        } catch (error:any) {
            this.logger.debug('rampup: Error: ' + error.message);
            score = -1;
        }
    
        return Math.round(score * 10000) / 10000;
    }
    
}



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





