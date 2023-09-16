import process from 'process';
import fs from 'fs';
import { get_License_Metric } from './license';
import { getResponsiveness } from './responsiveness';
import { Bus_Factor } from './busFactor';

async function evaluate_URL(url: string) {
  try {
    const metrics = {
      'license': -1,
      'bus factor': -1,
      'responsiveness': -1,
      'correctness': -1,
      'ramp up': -1,
      'overall': -1
    };
    metrics['license'] = await get_License_Metric(url);
    metrics['responsiveness'] = await getResponsiveness(url);
    metrics['bus factor'] = await Bus_Factor(url);

    return metrics;
  } catch (error) {
    console.error(error);
    return {
      'license': -1,
      'bus factor': -1,
      'responsiveness': -1,
      'correctness': -1,
      'ramp up': -1,
      'overall': -1
    };
  }
}

async function main() {
  const url_file_path: string = process.argv[2]; // Get the URL_FILE argument from the command line

  // TODO: read each url in here
  let other_metrics = await evaluate_URL('https://github.com/davisjam/safe-regex');
  let metrics = await evaluate_URL('https://github.com/cloudinary/cloudinary_npm');
  console.log('evaluating second');
  console.log(metrics['bus factor']);
}

main();
