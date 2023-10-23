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
exports.Bus = void 0;
const rest_1 = require("@octokit/rest");
const metric_1 = require("./metric");
class Bus extends metric_1.Metric {
    constructor(url) {
        super(url, "Busfactor");
    }
    Bus_Factor(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = -1; // Initialize res with a default value in case of an error
            try {
                const octokit = new rest_1.Octokit({
                    auth: this.githubToken // Put your GitHub token here
                });
                const urlParts = url.split('/');
                const _owner = this.repoOwner; // Obtain the owner of the repo
                const _repo = this.repoName; // Obtain the repo name
                const response = yield octokit.request('GET /repos/{owner}/{repo}/contributors', {
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
                    }
                    else {
                        res = Math.round(good / total * 100000) / 100000;
                    }
                }
            }
            catch (error) {
                this.logger.debug("busFactor: Error: " + error.message);
                return -1;
            }
            return res;
        });
    }
}
exports.Bus = Bus;
