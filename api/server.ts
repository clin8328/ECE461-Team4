import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { query } from "./database";



import ResetRegistry from "./endpoints/resetregistry";
import authenticate from "./endpoints/authenticate";

const app = express();

app.use(bodyParser.json());

app.get("/", async (req: Request, res: Response) => {
  res.status(200).send("Hello World!");
});
app.put('/authenticate', authenticate);
app.delete('/reset', ResetRegistry);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

