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
exports.PR_Stats = void 0;
const rest_1 = require("@octokit/rest");
const metric_1 = require("./metric");
class PR_Stats extends metric_1.Metric {
    constructor(url) {
        super(url, "PR_Stats");
    }
    PR_Stats(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let allPr = [];
            let prWithReview = [];
            let page = 1;
            const octokit = new rest_1.Octokit({
                auth: this.githubToken // Put your GitHub token here
            });
            const _owner = this.repoOwner; // Obtain the owner of the repo
            const _repo = this.repoName; // Obtain the repo name
            while (true) {
                const response = yield octokit.request('GET /repos/{owner}/{repo}/pulls', {
                    owner: _owner,
                    repo: _repo,
                    state: 'closed',
                    per_page: 100,
                    page: page
                });
                const pullRequests = response.data;
                if (pullRequests.length === 0) {
                    break;
                }
                allPr = allPr.concat(pullRequests);
                page++;
            }
            for (const pr of allPr) {
                if (pr.merged_at === null) {
                    continue;
                }
                if (pr.requested_reviewers && pr.requested_reviewers.length > 0 || pr.requested_teams && pr.requested_teams.length > 0) {
                    prWithReview = prWithReview.concat(pr);
                    continue;
                }
                const review = yield octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
                    owner: _owner,
                    repo: _repo,
                    pull_number: pr.number,
                });
                if (review.data && review.data.length > 0) {
                    prWithReview = prWithReview.concat(pr);
                }
            }
            return Number((prWithReview.length / allPr.length).toFixed(5));
        });
    }
}
exports.PR_Stats = PR_Stats;
