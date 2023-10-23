"use strict";
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
exports.License = void 0;
/*
  Original Author: Chuhan Lin
  Date edit: 9/7/2023
*/
const metric_1 = require("./metric");
const fs = __importStar(require("fs/promises"));
/*
We decided to use the javascript library, isomorphic-git, to help us clone git repository.
This way we are able to access source codes and check the license the package uses.
The License class will take in a 'URL' of a github repository and a 'dirPath' of the path
you want to clone the repistory to.

Steps to calculate License metric:
  1) Instantiate the class and provide the repository URL and path destination
  2) Call cloneRepository()
  3) Call Find_And_ReadLicense()
  4) Call deleteRepository()

  (Example listed in EOF)
*/
class License extends metric_1.Metric {
    constructor(url) {
        super(url, "License");
    }
    /*
    We will declare all sub-functions within this class as asynchronous functions because
    we will be making http request to clone a github repository. It will be easier for us
    to conduct error handling when an HTTP request error occurs.
  
    */
    Find_And_ReadLicense() {
        return __awaiter(this, void 0, void 0, function* () {
            /*
                args: none
                return: bool (if finding and reading was successful or not)
        
                Description: This function searches through all the files within the repository
                and finds if any files that starts with the word license or licence.
            */
            try {
                const files = yield fs.readdir(this.clone_path);
                // 'i' flag makes the search case-insensitive 
                const readme_regex = new RegExp('^readme', 'i');
                for (const file of files) {
                    //If a License file is found, evaluate the file for valid licenses
                    if (readme_regex.test(file)) {
                        const output = yield this.evaluate_License(file);
                        return output;
                    }
                }
                return 0;
            }
            catch (error) {
                this.logger.debug(`Find_and_Read_License: Error listing files in directory '${this.githubRepoUrl}':` + error.message);
                return 0;
            }
        });
    }
    evaluate_License(path) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
              args: string (license file)
              return: int (0 or 1)
        
              Description: This function searches through the license file to see if there are any
              license that are compatible with LGPLv2.1
              LGPLv2.1 compatible licenses:
              [apache-2.0, bsd-2-clause, bsd-3-clause, MIT, LGPL-2.1, GPL-2.0+, GPL-3.0+, MPL-2.0, CPL-1.0]
              */
            try {
                //regex to check for valid license
                const find_license_regex = new RegExp('(apache-2.0)|(bsd-[2-3]-clause)|(MIT)|(lgpl-2.1)|(lgpl-3.0)|(gpl-[2-3].0)', 'i');
                //Read the readme.md file
                const fileContent = yield fs.readFile(this.clone_path + "/" + path, 'utf-8');
                //Find the license section 
                const licenseRegex = /(#+)\s*(License|Licence|legal)([\s\S]*)/i;
                const licenseMatch = fileContent.match(licenseRegex);
                if (licenseMatch) {
                    //this.logger.info(`File content for "${path}":\n${licenseMatch[0]}`);
                    //Find if there are valid licenses
                    if (find_license_regex.test(licenseMatch[0])) {
                        this.logger.info("License: license found for" + this.repoName);
                        return 1;
                    }
                }
                return 0;
            }
            catch (error) {
                this.logger.debug(`evaluate_License: Error reading file "${path}":` + error.message);
                return 0;
            }
        });
    }
}
exports.License = License;
