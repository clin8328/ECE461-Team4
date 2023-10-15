import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import {Metric} from './metric';
import { all } from 'axios';

export class PR_Stats extends Metric{
    constructor(url: string) {
        super(url, "PR_Stats");
    }
    async PR_Stats(url: string): Promise<number> {
        let allPr: any[] = []
        let prWithReview: any[] = []
        let page = 1

        const octokit = new Octokit({
            auth: this.githubToken // Put your GitHub token here
        });
        const _owner = this.repoOwner; // Obtain the owner of the repo
        const _repo = this.repoName;// Obtain the repo name
        while (true) {
            const response = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
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
            page ++
        }
        for (const pr of allPr) {
            if (pr.merged_at === null) {
                continue
            }
            if (pr.requested_reviewers && pr.requested_reviewers.length > 0 || pr.requested_teams && pr.requested_teams.length > 0) {
                prWithReview = prWithReview.concat(pr)
                continue
            }
            const review = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
                owner: _owner,
                repo: _repo,
                pull_number: pr.number,
            })
            if (review.data && review.data.length > 0) {
                prWithReview = prWithReview.concat(pr)
            }
        }
        return Number((prWithReview.length /allPr.length).toFixed(5))
    }

}