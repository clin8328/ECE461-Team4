import process from 'process';
import {get_License_Metric} from './license';
import { getResponsiveness } from './responsiveness';
import { Bus_Factor } from './busFactor';
import * as fs from 'fs/promises';
import { get_api_url } from './helper';
import { Bus_Factor } from './busFactor';


async function evaluate_URL(url: string) {
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
    metrics["LICENSE_SCORE"] = await get_License_Metric(url);
    metrics["RESPONSIVE_MAINTAINER_SCORE"] = await getResponsiveness(url);
    metrics["BUS_FACTOR_SCORE"] = await Bus_Factor(url);

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

async function read_file(url: string) {
  try {
    const fileContent = await fs.readFile(url, 'utf-8');
    return fileContent;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}

async function main() {
  const url_file_path: string = process.argv[2]; //get the URL_FILE argument from the command line

  const fileContent = await read_file(url_file_path);
  const fileList = fileContent.split('\n');

  for (let link of fileList) {
    const response = await get_api_url(link);
    console.log("-------------------------------------------------");
    if(response != ""){
      const output = await evaluate_URL(link.substring(0,link.length-1));
      console.log(output);
    }
    break;
  }
  //TODO: read each url in here
  //let other_metrics = evaluate_URL('https://github.com/davisjam/safe-regex');
  //let metrics = evaluate_URL('https://github.com/cloudinary/cloudinary_npm');
  //console.log('evaluating second');
}

main();