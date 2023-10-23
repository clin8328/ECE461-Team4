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
exports.Responsiveness = void 0;
const metric_1 = require("./metric");
const rest_1 = require("@octokit/rest");
const date_fns_1 = require("date-fns");
class Responsiveness extends metric_1.Metric {
    constructor(url) {
        super(url, "Responsiveness");
    }
    getCompletedIssues(repositoryUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            args: string (GitHub Repository URL)
            return: const (Filtered Octokit Response, Data on closed issues)
    
            Description: This function uses the javascript library 'octokit' to call the GitHub
            API to determine the issues in repository on github if the user provides a valid
            github repository URL.
            */
            const owner = this.repoOwner; //Obtain owner of repo
            const repoName = this.repoName; //Obtain repo name
            const octokit = new rest_1.Octokit({
                auth: this.githubToken //Insert token
            });
            try {
                const completedIssues = yield octokit.request('GET /repos/{owner}/{repo}/issues', {
                    owner: owner,
                    repo: repoName,
                    state: 'closed',
                    per_page: 100,
                });
                if (completedIssues.status === 200) {
                    const threeMonthsAgo = (0, date_fns_1.subMonths)(new Date(), 3);
                    //Filter for issues that have been completed within 3 months
                    const completedWithin3Months = completedIssues.data.filter((issue) => (issue.state === 'closed' && //Filter for closed issues
                        issue.state_reason === 'completed' && //Filter for issues that have been marked as completed
                        issue.closed_at !== null &&
                        (0, date_fns_1.isAfter)(new Date(issue.closed_at), threeMonthsAgo) === true //Filter for issues that have been closed within the 3 months
                    ));
                    // this.logger.info(completedWithin3Months)
                    // this.logger.info(new Date('2023-08-30T21:31:09Z'));
                    // this.logger.info(threeMonthsAgo);
                    // this.logger.info(isAfter(new Date('2023-08-30T21:31:09Z'), threeMonthsAgo));
                    return completedWithin3Months; //Return the data that contiains 
                }
                else {
                    throw new Error(`Failed to fetch completed issues. Status code: ${completedIssues.status}`);
                }
            }
            catch (error) {
                this.logger.debug("getCompletedIssues: Error: " + error.message);
                throw error;
            }
        });
    }
    calculateScore(completedWithin3Months, maxBenchmarkDays) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            args: any (Data contains issues that have been completed within 3 months)
            return: const (Metric score between [0, 1])
    
            Description: This function parses through the issues data to determine
            the average time a issue is open that have been closed within the past
            3 months. It then converts the time to a metric score.
            */
            let numIssuesClosed = 0; //Number of issues closed within 3 months
            var totalDaysOpen = 0; //Total time open for issues
            var score = 0;
            for (const issue of completedWithin3Months) {
                if (issue.closed_at !== null) {
                    const create_date = new Date(issue.created_at);
                    const closed_date = new Date(issue.closed_at);
                    totalDaysOpen += (0, date_fns_1.differenceInDays)(closed_date, create_date);
                    numIssuesClosed++;
                }
            }
            if (numIssuesClosed === 0) {
                score = 0;
            }
            else {
                const averageDaysOpen = totalDaysOpen / numIssuesClosed;
                // this.logger.info(`Average time to close an issue: ${averageDaysOpen} days, number of issues closed: ${numIssuesClosed}`);
                score = Math.max(0, (maxBenchmarkDays - averageDaysOpen) / maxBenchmarkDays);
            }
            return score;
        });
    }
    numCollaborators() {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            args: none
            return: const (Metric score between [0, 1])
    
            Description: This function calls the necessary functions to
            calculate the metric score
            */
            const maxBenchmarkDays = 30;
            try {
                let data = yield this.getCompletedIssues(this.githubRepoUrl);
                const score = yield this.calculateScore(data, maxBenchmarkDays);
                return score;
            }
            catch (error) {
                this.logger.debug("numCollaborators: Error: " + error.message);
                return -1; // Return a default score or handle the error as needed
            }
        });
    }
}
exports.Responsiveness = Responsiveness;
/*
used in main to return an integer representing the score from a string representing the url
*/
// export async function getResponsiveness(url: string) {
//     let test = new Responsiveness(url);
//     return await test.numCollaborators();
// }
/* Example

(async () => {
    let test = new Responsiveness('https://github.com/clin8328/ECE461-Team4'); //https://github.com/clin8328/ECE461-Team4 https://github.com/davisjam/safe-regex
    const score = await test.numCollaborators();
    this.logger.info(`Score: ${score}`);
})();

*/
// (async () => {
//     let test = new Responsiveness('https://github.com/davisjam/safe-regex'); //https://github.com/clin8328/ECE461-Team4 https://github.com/davisjam/safe-regex
//     const score = await test.numCollaborators();
//     this.logger.info(`Score: ${score}`);
// })();
