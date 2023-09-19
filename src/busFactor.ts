import { Octokit } from '@octokit/rest';

export async function Bus_Factor(url: string): Promise<number> {
    let res: number = -1; // Initialize res with a default value in case of an error

    try {
        const octokit = new Octokit({
            auth: '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' // Put your GitHub token here
        });

        const urlParts = url.split('/');
        const _owner = urlParts[3]; // Obtain the owner of the repo
        const _repo = urlParts[4]; // Obtain the repo name
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
    } catch (error) {
        
        return -1;
    }

    return res;
}
