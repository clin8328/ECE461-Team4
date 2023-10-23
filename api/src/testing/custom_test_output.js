"use strict";
/*
  Original Author: Chuhan Lin
  Date edit: 9/19/2023
  File description: This file creates custom stdout for the test cases we ran. It will output the
                    code coverage across all the tested files and the number of test cases passed
                    along with total number of test cases
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
function print_test_results() {
    // Read the contents of the output.txt file
    const outputText = fs.readFileSync('src/testing/output.txt', 'utf8');
    //Regex to find total num of test cases and num of passed test cases and code coverage
    const coverageRegex = /All files\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|/;
    const testRegex = /Tests:\s+(\d+)\s*(?:failed,\s+(\d+)\s+)?passed,\s+(\d+)\s+total/;
    const coverageMatch = outputText.match(coverageRegex);
    const testMatch = outputText.match(testRegex);
    if (coverageMatch && testMatch) {
        var [, stmts, branches, funcs, lines] = coverageMatch;
        var [, testsFailed, testsPassed, testsTotal] = testMatch;
        /*Check if there are any failed test cases because when there are no failed test cases
        there are 1 less variable to assign*/
        if (!testsPassed) {
            testsPassed = testsFailed;
        }
        //console.log(`Total: ${testsTotal}`);
        //console.log(`Passed: ${testsPassed}`);
        //console.log(`Coverage: ${Math.round(parseFloat(lines))}%`);
        console.log(`${testsPassed}/${testsTotal} test cases passed. ${Math.round(parseFloat(lines))}% line coverage achieved.`);
    }
    else {
        //Exit on error if there are no regex matched expression
        process.exit(1);
    }
}
print_test_results();
