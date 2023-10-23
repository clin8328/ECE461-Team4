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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metric = void 0;
const rest_1 = require("@octokit/rest");
const path = __importStar(require("path"));
const logConfig_1 = require("./logConfig");
const links = __importStar(require("./check_links"));
const npmlink_1 = require("./npmlink");
const git = __importStar(require("isomorphic-git"));
const node_1 = __importDefault(require("isomorphic-git/http/node"));
const fs = __importStar(require("fs/promises"));
require('dotenv').config();
//main
// -Determne if its a GitHub URL or a NPM URL
// -If NPM URL obtain the github url
// -process github url for repoUrl, repoOwner, repoName
//  set repoLocalPath
class Metric {
    constructor(Url, metricName) {
        var _a;
        this.githubRepoUrl = ""; //Set in getGitHubRepoUrl
        this.repoOwner = ""; //Set in get_api_url
        this.repoName = ""; //Set in get_api_url
        this.clone_path = "clone-path";
        this.status = 0;
        this.githubToken = (_a = process.env.GITHUB_TOKEN) !== null && _a !== void 0 ? _a : "";
        this.logger = logConfig_1.logProvider.getLogger(metricName);
        //this.getGitHubRepoUrl(Url);
        this.repoPath = path.join(process.cwd(), this.clone_path);
    }
    getGitHubRepoUrl(Url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (links.isGithubLink(Url) === true) {
                    this.githubRepoUrl = Url;
                    yield this.get_api_url(Url);
                }
                else if (links.isNpmLink(Url) === true) {
                    const npmtoGitUrl = yield (0, npmlink_1.npmToGitRepoUrl)(Url);
                    if (npmtoGitUrl !== null) {
                        this.githubRepoUrl = npmtoGitUrl;
                        yield this.get_api_url(npmtoGitUrl);
                    }
                    else {
                        this.logger.debug('getGithubRepoUrl: Failed to fetch GitHub repository URL for npm link for ' + Url);
                    }
                }
            }
            catch (error) {
                this.logger.debug('getGithubRepoUrl: An error occurred:' + error.message);
            }
        });
    }
    get_api_url(repositoryUrl) {
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
                this.repoOwner = owner;
                this.repoName = repoName;
                //Check if it ends with .git or and backslashes '\' and remove them
                if (repoName.endsWith('.git\r')) {
                    this.repoName = repoName.substring(0, repoName.length - 5);
                }
                else if (repoName.endsWith('.git')) {
                    this.repoName = repoName.substring(0, repoName.length - 4);
                }
                const regex = /[\\]*\r$/;
                if (regex.test(repoName)) {
                    this.repoName = repoName.replace(regex, '');
                }
                const octokit = new rest_1.Octokit({
                    auth: this.githubToken
                });
                var cleanedURL = 'https://api.github.com/repos/' + owner + '/' + this.repoName;
                const response = yield octokit.request(cleanedURL, {
                    owner: owner,
                    repo: this.repoName,
                });
                if (response.status === 200) {
                    this.status = response.status;
                    return cleanedURL;
                }
                else {
                    this.logger.debug('get_api_url' + cleanedURL + ' is not a valid github API');
                    return "";
                }
            }
            catch (error) {
                // Use type assertion to specify the type of the error object
                // const axiosError = error as AxiosError;
                // this.logger.debug('Error fetching repository information:' + axiosError.message);
                return "";
            }
        });
    }
    cloneRepository() {
        return __awaiter(this, void 0, void 0, function* () {
            /*
                args: none
                return: bool (if cloning was successful or not)
        
                Description: This function uses the javascript library 'isomorphic-git' to clone
                a repository on github if the user provides a valid github repository URL.
            */
            const dir = this.repoPath;
            try {
                yield git.clone({ fs, http: node_1.default, dir, url: this.githubRepoUrl });
                this.logger.info('Repository at' + this.githubRepoUrl + 'cloned successfully.');
                return true;
            }
            catch (error) {
                this.logger.debug('Error cloning repository at ' + this.githubRepoUrl + ':', error);
                return false;
            }
        });
    }
    deleteRepository() {
        return __awaiter(this, void 0, void 0, function* () {
            /*
                args: none
                return: bool (if deleting was successful or not)
        
                Description: This function deletes the cloned directory in our system
            */
            try {
                //await fs.chmod(this.dirPath, 0o755);
                //this.logger.info('permissions changed');
                yield fs.rm(this.repoPath, { recursive: true });
                this.logger.info(`Directory '${this.repoPath}' and its contents deleted successfully.`);
                return true;
            }
            catch (error) {
                this.logger.debug(`Error deleting directory '${this.repoPath}':`, error.message);
                return false;
            }
        });
    }
}
exports.Metric = Metric;
