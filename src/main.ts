import process from 'process';
import { get_api_url, read_file, evaluate_URL } from './helper';

async function main() {
  const url_file_path: string = process.argv[2]; //get the URL_FILE argument from the command line

  const fileContent = await read_file(url_file_path);
  const fileList = fileContent.split('\n');

  for (let link of fileList) {
    const response = await get_api_url(link);
    if(response != ""){
      const output = await evaluate_URL(link.substring(0,link.length-1));
      console.log(output);
    }
    break;
  }
  process.exit(0);
}

main();