import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { query } from "./database";

import ResetRegistry from "../endpoints/resetregistry";

const app = express();
app.use(bodyParser.json());

app.get("/", async (req: Request, res: Response) => {
  try {
    const result = await query("SELECT * FROM testing");
    console.log(result.rows);
  } catch (error) {
    // Handle errors
    console.error("Error performing a database query:", error);
  }
  res.status(200).send("Hello World!");
});
app.put("/authenticate", (req: Request, res: Response) => {
  const request = req.body;
  if (request.User === undefined || request.Secret === undefined) {
    return res.sendStatus(400);
  }
  if (
    request.User.name === undefined ||
    request.Secret.password === undefined ||
    request.User.isAdmin === undefined
  ) {
    return res.sendStatus(400);
  }

  //need to chech if the user password is valid

  //user valid
});
app.delete("/reset", ResetRegistry);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
