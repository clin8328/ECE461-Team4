import express, { Request, Response } from "express";
import { query } from "../database";
import jwt from "jsonwebtoken";
import { get } from "http";
function getPkgByName(req: Request, res: Response) {
    return res.sendStatus(200);
}

  
  
  

export default getPkgByName;