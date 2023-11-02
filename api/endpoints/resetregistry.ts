import express, { Request, Response } from "express";

function ResetRegistry(req: Request, res: Response) {
  res.status(200).send("Hello World!");
}

export default ResetRegistry;
