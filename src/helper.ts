/*
  Original Author: Chuhan Lin
  Date edit: 9/7/2023
  File description: This file will store all helper functions that we will use to
  simplify our project
*/

import axios, { AxiosError } from 'axios';
import { Octokit } from '@octokit/rest';

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
      auth: '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' //Insert token
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


// Example usage
// const repositoryUrl = 'https://github.com/clin8328/ECE461-Team4'; // Replace with the actual repository URL
// get_api_url(repositoryUrl)
//   .then((repositoryData) => {
//     console.log(repositoryData)
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });


