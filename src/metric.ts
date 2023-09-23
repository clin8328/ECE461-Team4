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
    logger: Logger;
    api_call_remaining: number;

    constructor(Url: string, metricName: string) {
        this.githubRepoUrl = ""; //Set in getGitHubRepoUrl
        this.repoOwner = ""; //Set in get_api_url
        this.repoName = ""; //Set in get_api_url
        this.githubToken = process.env.GITHUB_TOKEN ?? "";
        
        this.logger = logProvider.getLogger(metricName);
        this.api_call_remaining = 0;

        this.getGitHubRepoUrl(Url);
        this.repoPath = path.join(process.cwd(), this.repoName);
    }

    async getGitHubRepoUrl(Url: string) {
      try {
        if (links.isGithubLink(Url) === true) {
          this.githubRepoUrl = Url;
          await this.get_api_url(Url);
        } 
        else if (links.isNpmLink(Url) === true) {
          const npmtoGitUrl = await npmToGitRepoUrl(Url);
  
          if (npmtoGitUrl !== null) {
            this.githubRepoUrl = npmtoGitUrl;
            await this.get_api_url(npmtoGitUrl);
          } else {
            console.error('Failed to fetch GitHub repository URL for npm link');
          }
        } 
        else {
          console.error('The URL is not a valid GitHub or npm link');
        }
      } catch (error) {
        console.error('An error occurred:', error);
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
            this.repoOwner = urlParts[3];
            this.repoName = urlParts[4];
        
            //Check if it ends with .git or and backslashes '\' and remove them
            if(repoName.endsWith('.git\r')){
              repoName = repoName.substring(0,repoName.length-5)
            }
        
            const regex = /[\\]*\r$/;
            if(regex.test(repoName)){
              repoName = repoName.replace(regex,'');
            }
        
            const octokit = new Octokit({
              auth: this.githubToken
            });
        
            var cleanedURL = 'https://api.github.com/repos/' + owner + '/' + repoName;
        
            const response = await octokit.request(cleanedURL, {
              owner: owner,
              repo: repoName,
            });
        
            if (response.status === 200) {
                this.repoOwner = owner;
                this.repoName = repoName;
                this.githubRepoUrl = cleanedURL;
              return cleanedURL;
            } 
            else{
              console.error(cleanedURL + ' is not a valid github API');
              return "";
            }
          } 
          catch (error) {
            // Use type assertion to specify the type of the error object
            // const axiosError = error as AxiosError;
            // console.error('Error fetching repository information:', axiosError.message);
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
      const dir = path.join(this.repoPath);
      try {
          console.log(dir)
          await git.clone({ fs, http, dir, url: this.githubRepoUrl });
          console.log('Repository cloned successfully.');
          return true;
      } 
      catch (error) {
          console.error('Error cloning repository:', error);
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
          //console.log('permissions changed');
          await fs.rm(this.repoPath, { recursive: true });
          console.log(`Directory '${this.repoPath}' and its contents deleted successfully.`);
          return true;
      } 
      catch (error) {
          console.error(`Error deleting directory '${this.repoPath}':`, error);
          return false;
      }
    }

}
