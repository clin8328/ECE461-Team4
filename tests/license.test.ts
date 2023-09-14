/*
  Original Author: Chuhan Lin
  Date edit: 9/14/2023
  File description: Testing the License Metric class
*/
import {License} from "../src/license"

const fsPromises = require('fs/promises');
const git = require('isomorphic-git');
const path = require('path');

describe('License Class', () => {
    jest.mock('isomorphic-git');
    jest.mock('fs/promises');
    /*
    Spy on console.log and console.error to prevent logging errors to console
    when we test for error handling states
    */
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    beforeEach(() => {
        console.log = jest.fn();
        console.error = jest.fn();
    });

    afterEach(() => {
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
    });
    
    it('Cloning Success and Delete success', async () => {
        const dirPath = 'test-dir'
        const license = new License('https://github.com/nullivex/nodist', dirPath);

        path.join = jest.fn((baseDir, dirPath) => {
            return "";
          });

        // Create a spy on git.clone and fs.rm and make it return with success whenever it is called
        const cloneSpy = jest.spyOn(git, 'clone');
        const rmSpy = jest.spyOn(fsPromises, 'rm');

        cloneSpy.mockResolvedValueOnce(true);
        rmSpy.mockResolvedValueOnce(true);

        const result_clone = await license.cloneRepository();
        const result_delete = await license.deleteDirectory();

        expect(result_clone).toBe(true);
        expect(result_delete).toBe(true);
    
        // Restore their original functionality
        rmSpy.mockRestore();
        cloneSpy.mockRestore();
    },20000);

    it('Cloning Fail and Delete fail', async () => {
        const dirPath = 'test-dir';
        const license = new License('https://github.com/invalid/invalid', dirPath);
    
        // Mock the path.join function
        path.join = jest.fn((baseDir, dirPath) => {
          return `${baseDir}/${dirPath}`;
        });
    
        // Create a spy on git.clone and make it return with fail whenever it is called
        const cloneSpy = jest.spyOn(git, 'clone');
        const error = new Error('Cloning error');

        const rmSpy = jest.spyOn(fsPromises, 'rm');
        const error1 = new Error('Deletion error');

        cloneSpy.mockRejectedValueOnce(error);
        rmSpy.mockRejectedValueOnce(error1);

        //Call the functions after all mocking is complete
        const result_clone = await license.cloneRepository();
        const result_delete = await license.deleteDirectory();

        expect(result_clone).toBe(false);
        expect(result_delete).toBe(false);

        // Restore their original functionality
        cloneSpy.mockRestore();
        rmSpy.mockRestore();
    },20000);

    it('Testing fail/success conditions on evaluate license', async () => {
        const dirPath = 'test-dir';
        const license = new License('https://github.com/mock/mock', dirPath);
        
        const readDirSpy = jest.spyOn(fsPromises, 'readdir');
        const readFileSpy = jest.spyOn(fsPromises, 'readFile');
        
        //Mock a random list of files
        readDirSpy.mockReturnValue(["1","2","readme.md"]);
        
        //Mock the readme file with 'success' conditions
        readFileSpy.mockReturnValue("##Description: Testing mock feature ## License: This is under the Apache-2.0 and MIT license");
        const result_success = await license.Find_And_ReadLicense();
        expect(result_success).toBe(1);

        //Mock the readme file with 'fail' conditions
        readFileSpy.mockReturnValue("##Description: Testing mock feature ## License: This is under the ecl-2.0 license");
        const result_fail = await license.Find_And_ReadLicense();
        expect(result_fail).toBe(0);

        //Check error handling when reading files in directory
        const error = new Error('ReadDir error');
        readDirSpy.mockRejectedValueOnce(error);
        const result_readDir_fail = await license.Find_And_ReadLicense();
        expect(result_readDir_fail).toBe(0);

        //Restore their orginal functionality
        readDirSpy.mockRestore();
        readFileSpy.mockRestore();
    },20000);
});