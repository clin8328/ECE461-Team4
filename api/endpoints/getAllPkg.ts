import express, { Request, Response } from "express";
import { query } from "../database";
import jwt from "jsonwebtoken";
function packages(req: Request, res: Response) {
    return res.sendStatus(200);
}

  
  
  

export default packages;
  