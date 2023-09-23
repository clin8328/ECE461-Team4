import axios from 'axios';
import { get_api_url } from './helper';


// Examples:
// const scopedUrl = 'https://www.npmjs.com/package/@babel/core';
// const versionedUrl = 'https://www.npmjs.com/package/lodash/v/4.17.21';

// console.log(getNpmPackageName(scopedUrl)); // Outputs "@babel/core"
// console.log(getNpmPackageName(versionedUrl)); // Outputs "lodash"

/*

*/

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
            throw Error ('Failed to find package in npm url')
        }
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function npmToGitRepoUrl(npmUrl: string): Promise<string | null> {
  try {
    const packageName = getNpmPackageName(npmUrl);
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
    
    if (response.status === 200) {
      const packageInfo = response.data;
      
      if (packageInfo.repository) { // Check if the package has a repository field
        
            if(packageInfo.repository.url) {
                return get_api_url(packageInfo.repository.url);
            }      
            else {
                const parts= (packageInfo.repository).split(":")[1].split("/"); //assuming of format - 'github:user/repo'
                const owner = parts[0];
                const repo = parts[1];
                const url = 'https://github.com/repos/' + owner + '/' + repo;
                
                return get_api_url(packageInfo.repository.url)
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

const npmUrl = 'https://www.npmjs.com/package/@babel/core'; // Replace with the name of the npm package you want to fetch
npmToGitRepoUrl(npmUrl)
  .then((repoUrl) => {
    if (repoUrl) {
      console.log(`Git repository URL for ${npmUrl}: ${repoUrl}`);
    } else {
      console.log(`No Git repository found for ${npmUrl}`);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });