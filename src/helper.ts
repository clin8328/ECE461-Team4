/*
  Original Author: Chuhan Lin
  last Date edit: 9/21/2023
  File description: This file will store all helper functions that we will use to
  simplify our project and functions that is used in main
*/

import axios, { AxiosError } from 'axios';
import { Octokit } from '@octokit/rest';
import {License, get_License_Metric} from './license';
import { getResponsiveness } from './responsiveness';
import { Bus_Factor } from './busFactor';
import * as fs from 'fs/promises';
import { RampUp } from './rampup';
import { Correctness } from './correctness';
import { net_score } from './netScore';

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

export async function evaluate_URL(url: string) {
  /*
    args: string (github repo URL)
    return: ndjson

    Description: This is the function to call inside main that evaluates a given github url and
    returns 6 metrics analyzed from the package.
  */
  try {
    const metrics = {
      "URL" : url,
      "NET_SCORE": -1,
      "RAMP_UP_SCORE": -1,
      "CORRECTNESS_SCORE": -1,
      "BUS_FACTOR_SCORE": -1,
      "RESPONSIVE_MAINTAINER_SCORE": -1,
      "LICENSE_SCORE": -1,
    };

    let correctness = new Correctness("test-clone");
    let rampup = new RampUp();
    let lic = new License(url, "test-clone");
    await lic.cloneRepository();
    metrics["LICENSE_SCORE"] = await lic.Find_And_ReadLicense();
    metrics["RESPONSIVE_MAINTAINER_SCORE"] = await getResponsiveness(url);
    metrics["BUS_FACTOR_SCORE"] = await Bus_Factor(url);
    metrics["RAMP_UP_SCORE"] = await rampup.rampup();
    metrics["CORRECTNESS_SCORE"] = await correctness.getMetric();
    metrics["NET_SCORE"] = net_score(metrics);
    await lic.deleteRepository();
    return metrics;

  } catch (error) {
    console.error(error);
    return {
      "URL" : url,
      "NET_SCORE": -1,
      "RAMP_UP_SCORE": -1,
      "CORRECTNESS_SCORE": -1,
      "BUS_FACTOR_SCORE": -1,
      "RESPONSIVE_MAINTAINER_SCORE": -1,
      "LICENSE_SCORE": -1,
    };
  }
}

export async function read_file(url: string) {
  /*
  args: string (file path)
  return: string (file content)

  Description: The function takes in a path to a file and reads the content of it
  */
  try {
    const fileContent = await fs.readFile(url, 'utf-8');
    return fileContent;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
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


