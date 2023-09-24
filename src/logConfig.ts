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

/*--- config/LogConfig.ts ---*/
import {LogLevel, createLogProvider} from "typescript-logging";
import {Log4TSProvider, Logger} from "typescript-logging-log4ts-style";
import * as fs from 'fs';
import { Stream } from "stream";
require("dotenv").config();

let logPath: string //path to where the log file should be written
let logLvl: LogLevel  //loglevel that should be allowed in the log file
let logStream: fs.WriteStream //filestream for the logfile

logPath = String(process.env.LOG_FILE)
if(Number(process.env.LOG_LEVEL) == 2) {
  logLvl = LogLevel.Debug
}
else if(Number(process.env.LOG_LEVEL) == 1) {
    logLvl = LogLevel.Info
}
else{
    logLvl = LogLevel.Off
}

  //create the filestream to write the log to
logStream = fs.createWriteStream(String(logPath)+'/log.txt')


//createFileProvider method
//input: none
//output: logger provider pointed at the log file stream with correct logging level
//method for creating the file logger provider

export const logProvider = Log4TSProvider.createProvider("fileProvider", {
  groups: [{
    expression: new RegExp(".+"),
  }],
  level: logLvl ,
  channel: {
    type: "LogChannel",
    write: logMessage => logStream.write(`${logMessage.message}\n`),
  }
});

