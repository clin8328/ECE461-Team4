import { Octokit } from '@octokit/rest';
import {Metric} from './metric';

export class Bus extends Metric {
    constructor(url: string) {
        super(url, "Busfactor");
    }

    async Bus_Factor(url: string): Promise<number> {
        let res: number = -1; // Initialize res with a default value in case of an error

        try {
            const octokit = new Octokit({
                auth: this.githubToken // Put your GitHub token here
            });

            const urlParts = url.split('/');
            const _owner = this.repoOwner; // Obtain the owner of the repo
            const _repo = this.repoName;// Obtain the repo name

            const response = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
                owner: _owner,
                repo: _repo,
                per_page: 100,
            });

            if (response.status === 200) {
                let good = 0;
                let total = 0;

                for (const person of response.data) {
                    if (person.contributions >= 10) {
                        good += 1;
                    }
                    total += 1;
                }

                if (total === 0) {
                    res = 0;
                } else {
                    res = Math.round(good / total * 10) / 10;
                }
            }
        } catch (error:any) {
            this.logger.debug("busFactor: Error: " + error.message)
            return -1;
        }

        return res;
    }

}

