import process from 'process';
import {License} from './license';
import { Bus } from './busFactor';
import * as fs from 'fs/promises';
import { RampUp } from './rampup';
import { Correctness } from './correctness';
import { net_score } from './netScore';
import { Responsiveness } from './responsiveness';
import { Metric } from './metric';

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

    let bus = new Bus(url);
    
    let metric = new Metric(url,"test-clone");
    let correctness = new Correctness(url);
    let rampup = new RampUp(url);
    let lic = new License(url);
    let responsiveness = new Responsiveness(url);
    console.log(metric.githubRepoUrl);
    console.log(metric.repoOwner);
    console.log(metric.repoName);
    console.log(metric.status);
    console.log(metric.githubToken);

    await metric.cloneRepository();
    metrics["LICENSE_SCORE"] = await lic.Find_And_ReadLicense();
    metrics["RESPONSIVE_MAINTAINER_SCORE"] = await responsiveness.numCollaborators();
    metrics["BUS_FACTOR_SCORE"] = await bus.Bus_Factor();
    metrics["RAMP_UP_SCORE"] = await rampup.rampup();
    metrics["CORRECTNESS_SCORE"] = await correctness.getMetric();
    metrics["NET_SCORE"] = net_score(metrics);
    await metric.deleteRepository();

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

export async function read_file(url: string): Promise<string> {
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
    process.exit(1);
  }
}

async function main() {
  const url_file_path: string = process.argv[2]; //get the URL_FILE argument from the command line
  const fileContent = await read_file(url_file_path);
  const fileList = fileContent.split('\n');
  
  for (let link of fileList) {
    const output = await evaluate_URL(link.substring(0,link.length-1));
    console.log(output);
    break;
  }
  process.exit(0);
}

main();
