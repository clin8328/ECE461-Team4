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
if(Number(process.env.LOG_LEVEL) == 0) {
    logLvl = LogLevel.Off
}
else if(Number(process.env.LOG_LEVEL) == 1) {
    logLvl = LogLevel.Info
}
else{
    logLvl = LogLevel.Debug
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

