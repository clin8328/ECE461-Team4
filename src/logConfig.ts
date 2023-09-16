/*--- config/LogConfig.ts ---*/
import {LogLevel, createLogProvider} from "typescript-logging";
import {Log4TSProvider, Logger} from "typescript-logging-log4ts-style";
import * as fs from 'fs'
import { Stream } from "stream";

//This class gathers the expected logging environment variables and allows them to be used to make log providers
export class logger461 {
  public logPath: string //path to where the log file should be written
  public logLvl: LogLevel  //loglevel that should be allowed in the log file
  public logStream: fs.WriteStream //filestream for the logfile
  //generic provider definition so that the compiler doesn't yell before a method is called
  public loggerProvider: Log4TSProvider = Log4TSProvider.createProvider("baseProvider", {
    groups: [{
      expression: new RegExp(".+"),
    }]
    });
  constructor() {
    // Constructor function that checks if the environement variables are correctly set and uses them to initialize the logger variables
    //process.env.LOG_FILE = String(process.cwd()) //This is in place because setting my environment variables in terminal wasn't working
    this.logPath = String(process.env.LOG_FILE)

    if(Number(process.env.LOG_LEVEL) == 0) {
      this.logLvl = LogLevel.Off
      console.log("env working")
    }
    else if(Number(process.env.LOG_LEVEL) == 1) {
      this.logLvl = LogLevel.Info
    }
    else{
      this.logLvl = LogLevel.Debug
    }

    //create the filestream to write the log to
    this.logStream = fs.createWriteStream(String(this.logPath)+'/log.txt')
  }
  //createConsoleProvider method
  //input: none
  //output: logger provider pointed at the console with correct logging level
  createConsoleProvider():Log4TSProvider  { 
    let provider = Log4TSProvider.createProvider("consoleProvider", {
    groups: [{
      expression: new RegExp(".+"),
    }],
    level: this.logLvl,
    channel: {
      type: "LogChannel",
      write: logMessage => console.log(`${logMessage.message}`),
    }
    });
    return provider
  }

  //createFileProvider method
  //input: none
  //output: logger provider pointed at the log file stream with correct logging level
  //method for creating the file logger provider
  createFileProvider():Log4TSProvider {
    let provider = Log4TSProvider.createProvider("fileProvider", {
      groups: [{
        expression: new RegExp(".+"),
      }],
      level: this.logLvl ,
      channel: {
        type: "LogChannel",
        write: logMessage => this.logStream.write(`${logMessage.message}\n`),
      }
    });
    return provider
  }
}







