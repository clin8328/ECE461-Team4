/*
  Original Author: Chuhan Lin
  Date edit: 9/7/2023
*/

import * as path from 'path';
import * as git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
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
export class License {
  url: string;
  dirPath: string;
  //Compatible licenses with LGPLv2.1
  // GPLv2+, MIT, BSD (BSD-3-clause, BSD-2-clause, Apache 2.0, Mozilla Public License 2.0, CPL)
  constructor(url: string, dirPath: string){
    this.url = url;
    this.dirPath = dirPath;
  }

  /*
  We will declare all sub-functions within this class as asynchronous functions because
  we will be making http request to clone a github repository. It will be easier for us
  to conduct error handling when an HTTP request error occurs.

  */
  async cloneRepository(){
    /*
        args: none
        return: bool (if cloning was successful or not)

        Description: This function uses the javascript library 'isomorphic-git' to clone
        a repository on github if the user provides a valid github repository URL.
    */ 
    const dir = path.join(process.cwd(), this.dirPath);
    try {
        await git.clone({ fs, http, dir, url: this.url });
        console.log('Repository cloned successfully.');
        return true;
    } 
    catch (error) {
        console.error('Error cloning repository:', error);
        return false;
    }
  }

  async deleteRepository() {
    /*
        args: none
        return: bool (if deleting was successful or not)

        Description: This function deletes the cloned directory in our system
    */ 
    try {
        await fs.chmod(this.dirPath, 0o755);
        console.log('permissions changed');
        await fs.rm(this.dirPath, { recursive: true });
        console.log(`Directory '${this.dirPath}' and its contents deleted successfully.`);
        return true;
    } 
    catch (error) {
        console.error(`Error deleting directory '${this.dirPath}':`, error);
        return false;
    }
  }

  async Find_And_ReadLicense() {
    /*
        args: none
        return: bool (if finding and reading was successful or not)

        Description: This function searches through all the files within the repository
        and finds if any files that starts with the word license or licence.
    */ 
    try {
      const files = await fs.readdir(this.dirPath);

      // 'i' flag makes the search case-insensitive
      const license_regex = new RegExp('^(license|licence)', 'i'); 
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
    catch (error) {
      console.error(`Error listing files in directory '${this.dirPath}':`, error);
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
      const fileContent = await fs.readFile(this.dirPath + "\\" + path, 'utf-8');
      
      //Find the license section 
      const licenseRegex = /(#+)\s*(License|Licence)([\s\S]*)/i;

      const licenseMatch = fileContent.match(licenseRegex);
      if(licenseMatch){
        console.log(`File content for "${path}":\n${licenseMatch[0]}`);

        //Find if there are valid licenses
        if(find_license_regex.test(licenseMatch[0])){
          return 1;
        }
      }
      return 0;
    } 
    catch (error) {
        console.error(`Error reading file "${path}":`, error);
        return 0;
    }
  }

  //End-Of-Class
}

export async function get_License_Metric(url: string): Promise<number> {
  let metric: number;
  let lic = new License(url, 'test-clone');

  try {
    await lic.cloneRepository();
    metric = await lic.Find_And_ReadLicense();
  } catch (error) {
    // Handle errors here if needed
    metric = 0;
    console.error(error);
  } finally {
    await lic.deleteRepository();
  }

  return metric;
}



