/*
  Original Author: Will Stonebridge
  Date edit: 9/9/2023

  Main is called by the run executable and gathers all of the metrics
*/

import process from 'process';
import fs from 'fs';
import {get_License_Metric} from './license';



async function evaluate_URL(url : string) {
  let metrics = {
    'license' : -1,
    'bus factor' : -1,
    'responsiveness' : -1,
    'correctness' : -1,
    'ramp up' : -1,
    'overall' : -1
  };

  await get_License_Metric(url).then((metric) => {metrics['license'] = metric});
  console.log(metrics);

  

  return metrics 
}

function main() {
  const url_file_path: string = process.argv[2]; //get the URL_FILE argument from the command line

  //TODO: read each url in here
  let metrics = evaluate_URL('https://github.com/cloudinary/cloudinary_npm');
}


main();