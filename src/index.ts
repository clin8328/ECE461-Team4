import {logger461} from "./logConfig"

//intialize the logger for typescript
let loggerInit = new logger461();
//expose the provider to all files in the repository
export const logProvider = loggerInit.createFileProvider()

//create "main logger"
let logger0 = logProvider.getLogger("Main");


logger0.info("Beginning Program")
