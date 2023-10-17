/*
  Original Author: Chuhan Lin
  Date edit: 9/19/2023
  File description: This file creates custom stdout for the test cases we ran. It will output the
                    code coverage across all the tested files and the number of test cases passed
                    along with total number of test cases
*/

import * as fs from 'fs';
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
        if(!testsPassed){
            testsPassed = testsFailed;
        }
        //console.log(`Total: ${testsTotal}`);
        //console.log(`Passed: ${testsPassed}`);
        //console.log(`Coverage: ${Math.round(parseFloat(lines))}%`);
        console.log(`${testsPassed}/${testsTotal} test cases passed. ${Math.round(parseFloat(lines))}% line coverage achieved.`)
    } else {
        //Exit on error if there are no regex matched expression
        process.exit(1);
    }
}

print_test_results();