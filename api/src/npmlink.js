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
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_api_url = exports.npmToGitRepoUrl = exports.getNpmPackageName = void 0;
const rest_1 = require("@octokit/rest");
const logConfig_1 = require("./logConfig");
let logger = logConfig_1.logProvider.getLogger("npmlink");
// Examples:
// const scopedUrl = 'https://www.npmjs.com/package/@babel/core';
// const versionedUrl = 'https://www.npmjs.com/package/lodash/v/4.17.21';
// console.log(getNpmPackageName(scopedUrl)); // Outputs "@babel/core"
// console.log(getNpmPackageName(versionedUrl)); // Outputs "lodash"
function getNpmPackageName(npmUrl) {
    var _a;
    try {
        const parts = npmUrl.split('/'); // Split the URL by '/'
        // Find the index of "package" in the URL
        const packageIndex = parts.indexOf('package');
        if (packageIndex !== -1) {
            // Check if the next item is a scope (starts with '@') 
            if ((_a = parts[packageIndex + 1]) === null || _a === void 0 ? void 0 : _a.startsWith('@')) {
                return `${parts[packageIndex + 1]}/${parts[packageIndex + 2]}`; // Scoped package, so return the next two items
            }
            else {
                return parts[packageIndex + 1]; // Non-scoped package, so return the next item
            }
        }
        else {
            throw Error('Failed to find package in npm url');
        }
    }
    catch (error) {
        //console.log(error);
        throw error;
    }
}
exports.getNpmPackageName = getNpmPackageName;
function npmToGitRepoUrl(npmUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const packageName = getNpmPackageName(npmUrl);
            const response = yield fetch(`https://skimdb.npmjs.com/registry/${packageName}`);
            const data = yield response.json();
            if (response !== undefined) {
                if (data.repository) { // Check if the package has a repository field
                    if (data.repository.url) {
                        var output = data.repository.url;
                        const regex = /.*github.com/;
                        if (regex.test(output)) {
                            output = "https://" + output.replace(regex, "github.com");
                        }
                        // if(data.repository.url.startsWith("git://")){
                        //   output = "https://" + data.repository.url.substring(6,data.repository.url.length)
                        // }
                        // if(data.repository.url.startsWith("git+")){
                        //   output = data.repository.url.substring(4,data.repository.url.length)
                        // }
                        return output;
                    }
                    else {
                        const parts = (data.repository).split(":")[1].split("/"); //assuming of format - 'github:user/repo'
                        const owner = parts[0];
                        const repo = parts[1];
                        const url = 'https://github.com/repos/' + owner + '/' + repo;
                        return get_api_url(data.repository.url);
                    }
                }
            }
            else {
                throw new Error(`Failed to fetch completed issues. Status code: ${response}`);
            }
            return null;
        }
        catch (error) {
            logger.debug(`Error fetching package info for ${npmUrl}:`);
            throw error;
        }
    });
}
exports.npmToGitRepoUrl = npmToGitRepoUrl;
function get_api_url(repositoryUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        /*
          args: string (github repo URL)
          return: string (github API)
        
          Description: The function takes in a github repository URL and outputs the
          github API URL. It will test the API URL and if a response is succesful, it
          will return the URL or else it returns an empty string.
        */
        try {
            var urlParts = repositoryUrl.split('/');
            var owner = urlParts[3];
            var repoName = urlParts[4];
            //Check if it ends with .git or and backslashes '\' and remove them
            if (repoName.endsWith('.git\r')) {
                repoName = repoName.substring(0, repoName.length - 5);
            }
            const regex = /[\\]*\r$/;
            if (regex.test(repoName)) {
                repoName = repoName.replace(regex, '');
            }
            const octokit = new rest_1.Octokit({
                auth: process.env.GITHUB_TOKEN
            });
            var cleanedURL = 'https://api.github.com/repos/' + owner + '/' + repoName;
            const response = yield octokit.request(cleanedURL, {
                owner: owner,
                repo: repoName,
            });
            if (response.status === 200) {
                return cleanedURL;
            }
            else {
                logger.debug(cleanedURL + ' is not a valid github API');
                return "";
            }
        }
        catch (error) {
            // Use type assertion to specify the type of the error object
            const axiosError = error;
            logger.debug('Error fetching repository information:', axiosError.message);
            return "";
        }
    });
}
exports.get_api_url = get_api_url;
// const npmUrl = 'https://www.npmjs.com/package/@babel/core'; // Replace with the name of the npm package you want to fetch
// npmToGitRepoUrl(npmUrl)
//   .then((repoUrl) => {
//     if (repoUrl) {
//       console.log(`Git repository URL for ${npmUrl}: ${repoUrl}`);
//     } else {
//       console.log(`No Git repository found for ${npmUrl}`);
//     }
//   })
//   .catch((error) => {
//     logger.debug('Error:', error);
//   });
