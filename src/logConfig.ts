/*--- config/LogConfig.ts ---*/
import {LogLevel, createLogProvider} from "typescript-logging";
import {Log4TSProvider, Logger} from "typescript-logging-log4ts-style";
import * as fs from 'fs'
import { Stream } from "stream";

export class logger461 {
  public logPath: string
  public logLvl: LogLevel
  public logStream: fs.WriteStream
  public loggerProvider: Log4TSProvider = Log4TSProvider.createProvider("baseProvider", {
    groups: [{
      expression: new RegExp(".+"),
    }]
    });
  constructor() {
    // Constructor function that checks if the environement variables are correctly set and uses them to initialize the logger variables
    process.env.LOG_FILE = String(process.cwd())
    if(process.env.LOG_FILE) {
      this.logPath = String(process.env.LOG_FILE)
    }
    else{
      this.logPath = "./"
    }
    if(process.env.LOG_LEVEL) {
      if(Number(process.env.LOG_LEVEL) == 0) {
        this.logLvl = LogLevel.Off
      }
      else if(Number(process.env.LOG_LEVEL) == 1) {
        this.logLvl = LogLevel.Info
      }
      else{
        this.logLvl = LogLevel.Debug
      }
    }
    else{
      this.logLvl = LogLevel.Debug
    }

    this.logStream = fs.createWriteStream(String(this.logPath)+'/log.txt')
  }
  
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







