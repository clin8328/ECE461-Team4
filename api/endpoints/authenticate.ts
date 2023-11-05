import express, { Request, Response } from "express";
import { query } from "../database";
import jwt from "jsonwebtoken";
const tokenKey: string = "461_secret_key";

async function authenticate(req: Request, res: Response) {
  const request = req.body;
  if (request.User === undefined || request.Secret === undefined) {
    return res.sendStatus(400);
  }
  if (request.User.name === undefined || request.User.isAdmin === undefined || request.Secret.password === undefined) {
    return res.sendStatus(400);
  }
  const username = request.User.name;
  const password = request.Secret.password;
  const user = await query("SELECT * FROM users WHERE user_name = $1", [username]);
  if (user.rows.length === 0 || user.rows[0].user_pass != password) {
    return res.sendStatus(401);
  }
  const user_credential = {username: username, password: password};
  const token = jwt.sign(user_credential, tokenKey, { expiresIn: '10h' });
  await query("UPDATE users SET token = $1 WHERE user_name = $2", [token, username]);
  return res.status(200).json(token);
}
export default authenticate;