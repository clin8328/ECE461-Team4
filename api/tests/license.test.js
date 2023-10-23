"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
  Original Author: Chuhan Lin
  Date edit: 9/14/2023
  File description: Testing the License Metric class
*/
const license_1 = require("../src/license");
const fsPromises = require("fs/promises");
const git = require("isomorphic-git");
const path = require("path");
describe("License Class", () => {
    jest.mock("isomorphic-git");
    jest.mock("fs/promises");
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
    it("Cloning Success and Delete success", () => __awaiter(void 0, void 0, void 0, function* () {
        const dirPath = "test-dir";
        const license = new license_1.License("https://github.com/nullivex/nodist");
        path.join = jest.fn((baseDir, dirPath) => {
            return "";
        });
        //Mock git.clone and fs.rm
        const cloneSpy = jest.spyOn(git, "clone");
        const rmSpy = jest.spyOn(fsPromises, "rm");
        cloneSpy.mockResolvedValueOnce(true);
        rmSpy.mockResolvedValueOnce(true);
        const result_clone = yield license.cloneRepository();
        const result_delete = yield license.deleteRepository();
        expect(result_clone).toBe(true);
        expect(result_delete).toBe(true);
        //restore their original functionality
        cloneSpy.mockRestore();
        rmSpy.mockRestore();
    }), 20000);
    it("Cloning Fail and Delete fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const dirPath = "test-dir";
        const license = new license_1.License("https://github.com/invalid/invalid");
        // Mock the path.join function
        path.join = jest.fn((baseDir, dirPath) => {
            return `${baseDir}/${dirPath}`;
        });
        const error = new Error("Cloning error");
        const error1 = new Error("Deletion error");
        //Mock git.clone and fs.rm functions
        const cloneSpy = jest.spyOn(git, "clone");
        const rmSpy = jest.spyOn(fsPromises, "rm");
        cloneSpy.mockRejectedValueOnce(error);
        rmSpy.mockRejectedValueOnce(error1);
        //Call the functions after all mocking is complete
        const result_clone = yield license.cloneRepository();
        const result_delete = yield license.deleteRepository();
        expect(result_clone).toBe(false);
        expect(result_delete).toBe(false);
        //restore their functionality
        cloneSpy.mockRestore();
        rmSpy.mockRestore();
    }), 20000);
    it("Testing fail/success conditions on evaluate license", () => __awaiter(void 0, void 0, void 0, function* () {
        const dirPath = "test-dir";
        const license = new license_1.License("https://github.com/mock/mock");
        //Mock fs.readdir and fs.readFile
        const readDirSpy = jest.spyOn(fsPromises, "readdir");
        const readFileSpy = jest.spyOn(fsPromises, "readFile");
        //Mock a random list of files
        readDirSpy.mockReturnValue(["1", "2", "readme.md"]);
        //Mock the readme file with 'success' conditions
        readFileSpy.mockReturnValue("##Description: Testing mock feature ## License: This is under the Apache-2.0 and MIT license");
        const result_success = yield license.Find_And_ReadLicense();
        expect(result_success).toBe(1);
        //Mock the readme file with 'fail' conditions
        readFileSpy.mockReturnValue("##Description: Testing mock feature ## License: This is under the ecl-2.0 license");
        const result_fail = yield license.Find_And_ReadLicense();
        expect(result_fail).toBe(0);
        //Check error handling when reading files in directory
        const error = new Error("ReadDir error");
        readDirSpy.mockRejectedValueOnce(error);
        const result_readDir_fail = yield license.Find_And_ReadLicense();
        expect(result_readDir_fail).toBe(0);
        // Restore their original functionality
        readDirSpy.mockRestore();
        readFileSpy.mockRestore();
    }), 20000);
});
