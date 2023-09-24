import { Octokit } from '@octokit/rest';
import * as path from 'path';
import {Log4TSProvider, Logger} from "typescript-logging-log4ts-style";
import {logProvider} from "./logConfig";

import * as links from "./check_links";
import { npmToGitRepoUrl } from "./npmlink";

import * as git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import * as fs from 'fs/promises';

require('dotenv').config();

//main
// -Determne if its a GitHub URL or a NPM URL
// -If NPM URL obtain the github url
// -process github url for repoUrl, repoOwner, repoName
//  set repoLocalPath

export class Metric {
    githubRepoUrl: string;
    repoOwner: string;
    repoName: string;
    repoPath: string;
    githubToken: string; 
    clone_path: string;
    logger: Logger;
    status: number;

    constructor(Url: string, metricName: string) {
        this.githubRepoUrl = ""; //Set in getGitHubRepoUrl
        this.repoOwner = ""; //Set in get_api_url
        this.repoName = ""; //Set in get_api_url
        this.clone_path = "clone-path";
        this.status = 0;
        this.githubToken = process.env.GITHUB_TOKEN ?? "";
        
        this.logger = logProvider.getLogger(metricName);
        //this.getGitHubRepoUrl(Url);
        this.repoPath = path.join(process.cwd(), this.clone_path);
    }

    async getGitHubRepoUrl(Url: string) {
      try {
        if (links.isGithubLink(Url) === true) {
          this.githubRepoUrl = Url;
          await this.get_api_url(Url);
        } else if (links.isNpmLink(Url) === true) {
          const npmtoGitUrl = await npmToGitRepoUrl(Url);
          if (npmtoGitUrl !== null) {
            this.githubRepoUrl = npmtoGitUrl;
            await this.get_api_url(npmtoGitUrl);
          } else {
            this.logger.debug('getGithubRepoUrl: Failed to fetch GitHub repository URL for npm link for ' + Url);
          }
        }
      } catch (error:any) {
        this.logger.debug('getGithubRepoUrl: An error occurred:'+ error.message);
      }
    }

    async get_api_url(repositoryUrl: string): Promise<string> {
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
            if(repoName.endsWith('.git\r')){
              this.repoName = repoName.substring(0,repoName.length-5)
            }
            else if(repoName.endsWith('.git')){
              this.repoName = repoName.substring(0,repoName.length-4)
            }
            const regex = /[\\]*\r$/;
            if(regex.test(repoName)){
              this.repoName = repoName.replace(regex,'');
            }
            
            const octokit = new Octokit({
              auth: this.githubToken
            });
        
            var cleanedURL = 'https://api.github.com/repos/' + owner + '/' + this.repoName;

            const response = await octokit.request(cleanedURL, {
              owner: owner,
              repo: this.repoName,
            });

            if (response.status === 200) {
              this.status = response.status;

              return cleanedURL;
            } 
            else{
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
        }

    async cloneRepository(){
      /*
          args: none
          return: bool (if cloning was successful or not)
  
          Description: This function uses the javascript library 'isomorphic-git' to clone
          a repository on github if the user provides a valid github repository URL.
      */ 
      const dir = this.repoPath;
      try {
          await git.clone({ fs, http, dir, url: this.githubRepoUrl });
          this.logger.info('Repository at'+ this.githubRepoUrl +'cloned successfully.');
          return true;
      } 
      catch (error) {
          this.logger.debug('Error cloning repository at'+ this.githubRepoUrl +':', error);
          return false;
      }
    }

    async deleteRepository() {
      /*
          args: none
          return: bool (if deleting was successful or not)
  
          Description: This function deletes the cloned directory in our system
      */ 
      try {
          //await fs.chmod(this.dirPath, 0o755);
          //this.logger.info('permissions changed');
          await fs.rm(this.repoPath, { recursive: true });
          this.logger.info(`Directory '${this.repoPath}' and its contents deleted successfully.`);
          return true;
      } 
      catch (error:any) {
          this.logger.debug(`Error deleting directory '${this.repoPath}':`, error.message);
          return false;
      }
    }

}
