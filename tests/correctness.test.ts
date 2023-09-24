/*
  Original Author: Will Stonebridge
  Date edit: 9/21/2023
  File description: Tests the correctness metric.
*/

import exp from "constants";
import { Correctness, lintFile, setIncludes} from "../src/correctness"
//import { License } from "../src/license";
import { Octokit } from "octokit";

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
    const expected_errors = 6;
    lintFile('src/testing/custom_test_output.ts').then((observed_errors) => {
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

<<<<<<< HEAD
  it('Evaluate Metric (curr Repo)', async () => {
    let metric = new Correctness('https://github.com/KillianLucas/open-interpreter/', '../');
=======
  // it('Evaluate Metric (curr Repo)', async () => {
  //   let metric = new Correctness('https://github.com/KillianLucas/open-interpreter/', '../');
  //   metric.getGitHubRepoUrl('https://github.com/KillianLucas/open-interpreter/');
  //   let value = await metric.getMetric();
  //   expect(value).toBeLessThanOrEqual(1);
  //   expect(value).toBeGreaterThanOrEqual(0);
  // });

  it('Evaluate Metric (git url)', async () => {
    let metric = new Correctness('https://github.com/KillianLucas/open-interpreter/');
    await metric.getGitHubRepoUrl('https://github.com/KillianLucas/open-interpreter/');
    await metric.cloneRepository();
>>>>>>> main
    let value = await metric.getMetric();
    await metric.deleteRepository();
    expect(value).toBeLessThanOrEqual(1);
    expect(value).toBeGreaterThanOrEqual(0);
<<<<<<< HEAD
  });

  it('Evaluate Metric (git url)', async () => {
    let metric = new Correctness('https://github.com/KillianLucas/open-interpreter/');
    await metric.cloneRepository();
    let value = await metric.getMetric();
    await metric.deleteRepository();
    expect(value).toBeLessThanOrEqual(1);
    expect(value).toBeGreaterThanOrEqual(0);
=======
>>>>>>> main
  }, 200000);
});
  
