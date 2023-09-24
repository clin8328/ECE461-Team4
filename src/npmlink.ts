import axios, { AxiosError } from 'axios';
import { Octokit } from '@octokit/rest';



// Examples:
// const scopedUrl = 'https://www.npmjs.com/package/@babel/core';
// const versionedUrl = 'https://www.npmjs.com/package/lodash/v/4.17.21';

// console.log(getNpmPackageName(scopedUrl)); // Outputs "@babel/core"
// console.log(getNpmPackageName(versionedUrl)); // Outputs "lodash"


export function getNpmPackageName(npmUrl: string): string | null {
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
            throw Error('Failed to find package in npm url')
        }
        
    } catch (error) {
        //console.log(error);
        throw error;
    }
}

export async function npmToGitRepoUrl(npmUrl: string): Promise<string | null> {
    try {
      const packageName = getNpmPackageName(npmUrl);
      //console.log(packageName);
      const response = await fetch(`https://skimdb.npmjs.com/registry/${packageName}`);
      const data = await response.json();
  
      if (response !== undefined) {
  
        if (data.repository) { // Check if the package has a repository field
  
              if(data.repository.url) {
                var output = data.repository.url
                  if(data.repository.url.startsWith("git://")){
                    output = "https://" + data.repository.url.substring(6,data.repository.url.length)
                  }
                  return output;
              }  
            else {
                const parts= (data.repository).split(":")[1].split("/"); //assuming of format - 'github:user/repo'
                const owner = parts[0];
                const repo = parts[1];
                const url = 'https://github.com/repos/' + owner + '/' + repo;
                
                return get_api_url(data.repository.url)
            }
        }
    }
    else {
        throw new Error(`Failed to fetch completed issues. Status code: ${response}`);
    }

    return null;

  } catch (error) {
    console.error(`Error fetching package info for ${npmUrl}:`);
    throw error;
  }
}

export async function get_api_url(repositoryUrl: string): Promise<string> {
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
          auth: process.env.GITHUB_TOKEN
        });
    
        var cleanedURL = 'https://api.github.com/repos/' + owner + '/' + repoName;
    
        const response = await octokit.request(cleanedURL, {
          owner: owner,
          repo: repoName,
        });
    
        if (response.status === 200) {
          return cleanedURL;
        } 
        else{
          console.error(cleanedURL + ' is not a valid github API');
          return "";
        }
      } 
      catch (error) {
        // Use type assertion to specify the type of the error object
        const axiosError = error as AxiosError;
        console.error('Error fetching repository information:', axiosError.message);
        return "";
      }
    }

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
//     console.error('Error:', error);
//   });
