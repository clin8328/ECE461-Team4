/*
  Original Author: Will Stonebridge
  Date edit: 9/21/2023
  File description: Tests the correctness metric.
*/

import exp from "constants";
import { Correctness, lintFile, setIncludes} from "../src/correctness"
//import { License } from "../src/license";
import { Octokit } from "octokit";

require('dotenv').config();
const repoName = 'for-testing'; //the name of the repository that testing will occur on
const repoLink = 'https://github.com/date-fns/date-fns.git' //the link to the rep that testing will occur on

const octokit = new Octokit({
  auth: process.env.TOKEN, // Replace with your authentication token
});

describe('Testing Correctness', () => {

  // beforeAll(async () => {
  //   // Code to run before all test cases start
  //   // For example, you can set up test data, initialize resources, or perform setup tasks
  //   await repoHandler.cloneRepository();
  // });

  // afterAll(async () => {
  //   // Code to run before all test cases start
  //   // For example, you can set up test data, initialize resources, or perform setup tasks
  //   const repoHandler = new License(repoLink, repoName);
  //   await repoHandler.deleteRepository();
  // });

  it('Lints Correctly', () => {
    const expected_errors = 3;
    lintFile('src/testing/example.ts').then((observed_errors) => {
      expect(observed_errors).toBe(expected_errors);
    });
  });
  
  it('Lint Failure on non-ts/js files', async () => {
    await expect(lintFile('src/testing/unlintable.txt')).rejects.toThrow();
  });

  it('Evaluate setIncludes', async () => {
    expect(setIncludes("12312345678765434567654", ['12'])).toBe(true);
    expect(setIncludes("12312345678765434567654", ['9', '91'])).toBe(false)
  });

  it('Evaluate Metric', async () => {
    let metric = new Correctness('../');
    let value = await metric.getMetric();
    expect(value).toBeLessThan(1);
    expect(value).toBeGreaterThan(0);
  });
});
  
