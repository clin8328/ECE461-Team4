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
  1) Istantiate the class and provide the repository URL and path destination
  2) Call cloneRepository()
  3) Call Find_And_ReadLicense()
  4) Call deleteRepository()

  (Example listed in EOF)
*/ 
class License{
  url: string;
  dirPath: string;
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

  async deleteDirectory() {
    /*
        args: none
        return: bool (if deleting was successful or not)

        Description: This function deletes the cloned directory in our system
    */ 
    try {
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
      const regex = new RegExp('^(license|licence)', 'i'); 
      for (const file of files) {
        //If a License file is found, evaluate the file for valid licenses
        if(regex.test(file)){
            await this.evaluate_License(file);
        }
      }
      return true;
    } 
    catch (error) {
      console.error(`Error listing files in directory '${this.dirPath}':`, error);
      return false;
    }
  }

  async evaluate_License(path: string){
    /*
      args: string (license file)
      return: int (0 or 1)

      Description: This function searches through the license file to see if are any license
      that are listed as LGPLv2.1

      NOTE: Currently work in progress, trying to think of a way to best search for this license,
      as different authors of repository have different ways of displaying licenses
    */ 
    try {
      const regex = new RegExp('', 'i'); 

      const fileContent = await fs.readFile(this.dirPath + "\\" + path);
      console.log(`File content for "${path}":\n${fileContent}`);
    } 
    catch (error) {
        console.error(`Error reading file "${path}":`, error);
    }
  }

  //End-Of-Class
}



/*                        EXAMPLE                         */
let x = new License('https://github.com/nullivex/nodist', 'test-clone')
x.cloneRepository().then((cloneSuccessful) => {
  if (cloneSuccessful) {

    x.Find_And_ReadLicense();

    x.deleteDirectory();
  } 
  else {
    // Handle the case where cloning failed              
    console.error('Cloning was not successful; skipping deletion.');
  }
});
