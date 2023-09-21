import axios, { AxiosError } from 'axios';
import { Octokit } from '@octokit/rest';
import * as path from 'path';
import {Log4TSProvider, Logger} from "typescript-logging-log4ts-style";
import {logProvider} from "./logConfig";

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

    constructor(Url: string, metricName: string) {
        this.githubRepoUrl = "";
        this.repoOwner = "";
        this.repoName = "";
        this.githubToken = process.env.GITHUB_TOKEN ?? "";
        this.logger = logProvider.getLogger(metricName);

        // -Determne if its a GitHub URL or a NPM URL
        // -If NPM URL obtain the github url
        
        //this.get_api_url();

        this.repoPath = path.join(process.cwd(), this.repoName);      
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
    
    // Examples:
    // const scopedUrl = 'https://www.npmjs.com/package/@babel/core';
    // const versionedUrl = 'https://www.npmjs.com/package/lodash/v/4.17.21';

    // console.log(getNpmPackageName(scopedUrl)); // Outputs "@babel/core"
    // console.log(getNpmPackageName(versionedUrl)); // Outputs "lodash"

    async getNpmPackageName(npmUrl: string): Promise<string | null> {
        try {
            const parts = npmUrl.split('/'); // Split the URL by '/'
            
            // Find the index of "package" in the URL
            const packageIndex = parts.indexOf('package');
            
            if (packageIndex !== -1) {
        
                // Check if the next item is a scope (starts with '@') 
                if (parts[packageIndex + 1]?.startsWith('@')) { 
                    return `${parts[packageIndex + 1]}/${parts[packageIndex + 2]}`; // Scoped package, so return the next two items
                } else {
                    return parts[packageIndex + 1]; // Non-scoped package, so return the next item
                }
            }
            else {
                throw Error ('Failed to find package in npm url')
            }
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async npmToGitRepoUrl(npmUrl: string): Promise<string | null> {
        try {
            const packageName = this.getNpmPackageName(npmUrl);
            const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
            
            if (response.status === 200) {
                const packageInfo = response.data;
                
                if (packageInfo.repository) { // Check if the package has a repository field
                    
                        if(packageInfo.repository.url) {
                            return this.get_api_url(packageInfo.repository.url);
                        }      
                        else {
                            const parts= (packageInfo.repository).split(":")[1].split("/"); //assuming of format - 'github:user/repo'
                            const owner = parts[0];
                            const repo = parts[1];
                            const url = 'https://github.com/repos/' + owner + '/' + repo;
                            
                            return this.get_api_url(packageInfo.repository.url)
                        }
                    }
            }
            else {
                throw new Error(`Failed to fetch completed issues. Status code: ${response.status}`);
            }

            return null;

        } catch (error) {
            console.error(`Error fetching package info for ${npmUrl}:`);
            throw error;
        }
    
    }

}
