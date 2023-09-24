/*
  Original Author: Chuhan Lin
  Date edit: 9/7/2023
*/
import { Metric } from './metric';
import * as fs from 'fs/promises';

/*
We decided to use the javascript library, isomorphic-git, to help us clone git repository.
This way we are able to access source codes and check the license the package uses.
The License class will take in a 'URL' of a github repository and a 'dirPath' of the path
you want to clone the repistory to.

Steps to calculate License metric:
  1) Instantiate the class and provide the repository URL and path destination
  2) Call cloneRepository()
  3) Call Find_And_ReadLicense()
  4) Call deleteRepository()

  (Example listed in EOF)
*/ 
export class License extends Metric{
  constructor(url: string){
    super(url, "License");
  }

  /*
  We will declare all sub-functions within this class as asynchronous functions because
  we will be making http request to clone a github repository. It will be easier for us
  to conduct error handling when an HTTP request error occurs.

  */

  async Find_And_ReadLicense() {
    /*
        args: none
        return: bool (if finding and reading was successful or not)

        Description: This function searches through all the files within the repository
        and finds if any files that starts with the word license or licence.
    */ 
    try {
      const files = await fs.readdir(this.clone_path);

      // 'i' flag makes the search case-insensitive 
      const readme_regex = new RegExp('^readme', 'i'); 

      for (const file of files) {
        //If a License file is found, evaluate the file for valid licenses
        if(readme_regex.test(file)){
          const output = await this.evaluate_License(file);
          return output;
        }
      }
      return 0;
    } 
    catch (error:any) {
      console.error(`Find_and_Read_License: Error listing files in directory '${this.githubRepoUrl}':`+ error.message);
      return 0;
    }
  }

  async evaluate_License(path: string){
    /*
      args: string (license file)
      return: int (0 or 1)

      Description: This function searches through the license file to see if there are any 
      license that are compatible with LGPLv2.1
      LGPLv2.1 compatible licenses: 
      [apache-2.0, bsd-2-clause, bsd-3-clause, MIT, LGPL-2.1, GPL-2.0+, GPL-3.0+, MPL-2.0, CPL-1.0]
      */ 
    try {

      //regex to check for valid license
      const find_license_regex = new RegExp('(apache-2.0)|(bsd-[2-3]-clause)|(MIT)|(lgpl-2.1)|(lgpl-3.0)|(gpl-[2-3].0)','i'); 

      //Read the readme.md file
      const fileContent = await fs.readFile(this.clone_path + "/" + path, 'utf-8');
      //Find the license section 
      const licenseRegex = /(#+)\s*(License|Licence|legal)([\s\S]*)/i;

      const licenseMatch = fileContent.match(licenseRegex);
      if(licenseMatch){
        //this.logger.info(`File content for "${path}":\n${licenseMatch[0]}`);

        //Find if there are valid licenses
        if(find_license_regex.test(licenseMatch[0])){
          return 1;
        }
      }
      return 0;
    } 
    catch (error:any) {
        console.error(`evaluate_License: Error reading file "${path}":`+ error.message);
        return 0;
    }
  }

  //End-Of-Class
}



