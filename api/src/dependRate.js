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
exports.Depend_Score = void 0;
const rest_1 = require("@octokit/rest");
const metric_1 = require("./metric");
class Depend_Score extends metric_1.Metric {
    constructor(url) {
        super(url, "Depend_Score");
    }
    calculateDependScore() {
        return __awaiter(this, void 0, void 0, function* () {
            const octokit = new rest_1.Octokit({
                auth: this.githubToken // Put your GitHub token here
            });
            const _owner = this.repoOwner; // Obtain the owner of the repo
            const _repo = this.repoName; // Obtain the repo name
            try {
                const response = yield octokit.request('GET /repos/{owner}/{repo}/contents/package.json', {
                    owner: _owner,
                    repo: _repo,
                });
                const packageJsonContent = Buffer.from(response.data.content, 'base64').toString();
                const packageJson = JSON.parse(packageJsonContent);
                const dependencies = packageJson.dependencies;
                if (!dependencies || Object.keys(dependencies).length === 0) {
                    return 1.0;
                }
                let numPinnedDependencies = 0;
                let numTotalDependencies = 0;
                for (const dependency of Object.keys(dependencies)) {
                    numTotalDependencies++;
                    const version = dependencies[dependency];
                    const versionParts = version.split('.');
                    if (versionParts.length >= 2) {
                        const major = parseInt(versionParts[0]);
                        const minor = parseInt(versionParts[1]);
                        if (!isNaN(major) && !isNaN(minor)) {
                            if (version.match(new RegExp(`^${major}\\.${minor}\\.\\d+$`))) {
                                numPinnedDependencies++;
                            }
                        }
                    }
                }
                return numPinnedDependencies / numTotalDependencies;
            }
            catch (error) {
                console.error('Error fetching package.json:', error);
                return 0;
            }
        });
    }
}
exports.Depend_Score = Depend_Score;
