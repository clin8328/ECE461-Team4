/*
  Original Author: Chuhan Lin
  Date edit: 9/7/2023
*/

import { Octokit } from "@octokit/core";

/*
This is a testing file that I am using to see if there is another way of 
extracting a repository license by using Octokit to interact with Github API
*/

const octokit = new Octokit({
  auth: "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",
});

(async () => {
  try {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/license", {
      owner: "nullivex",
      repo: "nodist",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (data && data.license && data.license.key) {
      const licenseKey = data.license.name;
      console.log(`Repository license: ${licenseKey}`);
    } else {
      console.log("No license found for the repository.");
    }
  } catch (error) {
    console.error("Error fetching repository license:", error);
  }
})();
