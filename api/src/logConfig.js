"use strict";
//Logger Use:
//Use in classes that extend metric
//1) Use this.logger.(info/debug)("message");
//Use outside of metric classes
//1) Use the imports for Log4TS and the logProvider 
//  -import {Log4TSProvider, Logger} from "typescript-logging-log4ts-style";
//  -import {logProvider} from "./logConfig";
//2) get a logger instance:
//  -logger = logProvider.getLogger(metricName);
//3) call the logger similarly to how it is called in the metrics, but using "logger" instead of "this.logger"
//  -logger.(debug/info)("message");
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logProvider = void 0;
/*--- config/LogConfig.ts ---*/
const typescript_logging_1 = require("typescript-logging");
const typescript_logging_log4ts_style_1 = require("typescript-logging-log4ts-style");
const fs = __importStar(require("fs"));
require("dotenv").config();
let logPath; //path to where the log file should be written
let logLvl; //loglevel that should be allowed in the log file
let logStream; //filestream for the logfile
logPath = String(process.env.LOG_FILE);
if (Number(process.env.LOG_LEVEL) == 2) {
    logLvl = typescript_logging_1.LogLevel.Debug;
}
else if (Number(process.env.LOG_LEVEL) == 1) {
    logLvl = typescript_logging_1.LogLevel.Info;
}
else {
    logLvl = typescript_logging_1.LogLevel.Off;
}
//createFileProvider method
//input: none
//output: logger provider pointed at the log file stream with correct logging level
//method for creating the file logger provider
exports.logProvider = typescript_logging_log4ts_style_1.Log4TSProvider.createProvider("fileProvider", {
    groups: [{
            expression: new RegExp(".+"),
        }],
    level: logLvl,
    channel: {
        type: "LogChannel",
        write: logMessage => fs.appendFile(logPath, logMessage.message + '\n', (err) => {
            if (err) {
                console.error('Error appending data to log file. Maybe directory does not exist:', err);
            }
        }),
    }
});
