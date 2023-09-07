/*
  Original Author: Chuhan Lin
  Date edit: 9/7/2023
*/

import axios, { AxiosError } from 'axios';

async function fetchRepositoryData(repositoryUrl: string): Promise<string | null> {
  try {
    //Get repo owner from url by doing some input cleaning
    const urlParts = repositoryUrl.split('/');
    const owner = urlParts[3];
    const repoName = urlParts[4];
    const cleanedURL = 'https://api.github.com/repos/' + owner + '/' + repoName;
    //Make a GET request to the github api of the repo
    const response = await axios.get(cleanedURL);

    //Check if the GET request is successful
    if (response.status === 200) {
      return response.data;
    } 
    else{
      console.error(cleanedURL + ' is not a valid repo');
      return null;
    }
  } 
  catch (error) {
    // Use type assertion to specify the type of the error object
    const axiosError = error as AxiosError;
    console.error('Error fetching repository information:', axiosError.message);
    return null;
  }
}

async function listFilesInRepository(repositoryUrl: string): Promise<string[] | null> {
  try {
    // Make a GET request to the GitHub API to list files in the repository's root directory
    const urlParts = repositoryUrl.split('/');
    const owner = urlParts[3];
    const repoName = urlParts[4];
    const cleanedURL = 'https://api.github.com/repos/' + owner + '/' + repoName + '/contents';

    const response = await axios.get(cleanedURL);

    // Check if the response is successful
    if (response.status === 200) {
      // Extract and return the list of file names
      const fileNames: string[] = response.data.map((file: any) => file.name);
      return fileNames;
    } else {
      console.error('Failed to fetch file list');
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching file list:', axiosError.message);
    return null;
  }
}


// Example usage
const repositoryUrl = 'https://github.com/clin8328/ECE461-Teaam4'; // Replace with the actual repository URL
fetchRepositoryData(repositoryUrl)
  .then((repositoryData) => {
    if (repositoryData) {
      console.log('Repository Data:', repositoryData);
    } else {
      console.log('Repository data not found.');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });

