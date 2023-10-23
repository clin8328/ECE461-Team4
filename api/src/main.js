"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.read_file = exports.evaluate_URL = void 0;
const process_1 = __importDefault(require("process"));
const license_1 = require("./license");
const busFactor_1 = require("./busFactor");
const fs = __importStar(require("fs/promises"));
const rampup_1 = require("./rampup");
const correctness_1 = require("./correctness");
const netScore_1 = require("./netScore");
const responsiveness_1 = require("./responsiveness");
const metric_1 = require("./metric");
const pr_stat_1 = require("./pr_stat");
const dependRate_1 = require("./dependRate");
const api_limit_1 = require("./api_limit");
require('dotenv').config();
function evaluate_URL(url) {
    return __awaiter(this, void 0, void 0, function* () {
        /*
          args: string (github repo URL)
          return: ndjson
      
          Description: This is the function to call inside main that evaluates a given github url and
          returns 6 metrics analyzed from the package.
        */
        try {
            var metrics = {
                "URL": url,
                "NET_SCORE": -1,
                "RAMP_UP_SCORE": -1,
                "CORRECTNESS_SCORE": -1,
                "BUS_FACTOR_SCORE": -1,
                "RESPONSIVE_MAINTAINER_SCORE": -1,
                "LICENSE_SCORE": -1,
                "PR_STATS": -1,
                "Depend_Score": -1,
            };
            let bus = new busFactor_1.Bus(url);
            yield bus.getGitHubRepoUrl(url);
            let correctness = new correctness_1.Correctness(url);
            yield correctness.getGitHubRepoUrl(url);
            let rampup = new rampup_1.RampUp(url);
            yield rampup.getGitHubRepoUrl(url);
            let lic = new license_1.License(url);
            yield lic.getGitHubRepoUrl(url);
            let responsiveness = new responsiveness_1.Responsiveness(url);
            yield responsiveness.getGitHubRepoUrl(url);
            let pr_stat = new pr_stat_1.PR_Stats(url);
            yield pr_stat.getGitHubRepoUrl(url);
            let depend = new dependRate_1.Depend_Score(url);
            yield depend.getGitHubRepoUrl(url);
            let metric = new metric_1.Metric(url, "test-clone");
            yield metric.getGitHubRepoUrl(url);
            if (metric.status != 200) {
                throw new Error();
            }
            yield metric.cloneRepository();
            metrics["LICENSE_SCORE"] = yield lic.Find_And_ReadLicense();
            metrics["RESPONSIVE_MAINTAINER_SCORE"] = Math.floor((yield responsiveness.numCollaborators()) * 100000) / 100000;
            metrics["BUS_FACTOR_SCORE"] = yield bus.Bus_Factor(url);
            metrics["RAMP_UP_SCORE"] = yield rampup.rampup();
            metrics["CORRECTNESS_SCORE"] = yield correctness.getMetric();
            metrics["NET_SCORE"] = yield (0, netScore_1.net_score)(metrics);
            metrics["PR_STATS"] = yield pr_stat.PR_Stats(url);
            metrics["Depend_Score"] = yield depend.calculateDependScore();
            yield metric.deleteRepository();
            return metrics;
        }
        catch (error) {
            console.error(error);
            return {
                "URL": url,
                "NET_SCORE": -1,
                "RAMP_UP_SCORE": -1,
                "CORRECTNESS_SCORE": -1,
                "BUS_FACTOR_SCORE": -1,
                "RESPONSIVE_MAINTAINER_SCORE": -1,
                "LICENSE_SCORE": -1,
            };
        }
    });
}
exports.evaluate_URL = evaluate_URL;
function read_file(url) {
    return __awaiter(this, void 0, void 0, function* () {
        /*
        args: string (file path)
        return: string (file content)
      
        Description: The function takes in a path to a file and reads the content of it
        */
        try {
            const fileContent = yield fs.readFile(url, 'utf-8');
            return fileContent;
        }
        catch (error) {
            // console.error('Error reading file:', error);
            // throw error;
            process_1.default.exit(1);
        }
    });
}
exports.read_file = read_file;
require('dotenv').config();
function checkEnvironment() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // console.log(process.env.GITHUB_TOKEN)
            // console.log(process.env.LOG_FILE)
            // console.log(process.env.LOG_LEVEL)
            if (process_1.default.env.GITHUB_TOKEN === undefined || process_1.default.env.GITHUB_TOKEN === "\n") {
                throw new Error();
            }
            else if (process_1.default.env.LOG_FILE === undefined || process_1.default.env.LOG_FILE === "\n") {
                throw new Error();
            }
            else if (process_1.default.env.LOG_LEVEL === undefined || process_1.default.env.LOG_LEVEL === "\n") {
                process_1.default.env.LOG_LEVEL = '0';
            }
        }
        catch (error) {
            //console.error(error)
            console.log(process_1.default.env.LOG_FILE);
            process_1.default.exit(1);
        }
    });
}
function delay(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, ms));
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const url_file_path = process_1.default.argv[2]; //get the URL_FILE argument from the command line
        const fileContent = yield read_file(url_file_path);
        const fileList = fileContent.split('\n');
        yield checkEnvironment();
        for (let link of fileList) {
            if (link == "") {
                continue;
            }
            const status = yield (0, api_limit_1.check_api_limit)();
            if (!status) {
                yield delay(60000);
            }
            var url_link = link.length;
            if (link.endsWith("\n") || link.endsWith("\r")) {
                url_link = link.length - 1;
            }
            const output = yield evaluate_URL(link.substring(0, url_link));
            const jsonString = JSON.stringify(output);
            console.log(`${jsonString}`);
            yield delay(500);
        }
        process_1.default.exit(0);
    });
}
main();
