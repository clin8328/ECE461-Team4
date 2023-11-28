import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { query } from "../database";
import { verifyToken } from "../common";
const tokenKey: string = "461_secret_key";
const defaultUsername = 'ece30861defaultadminuser';

export async function ResetRegistry(req: Request, res: Response) {
  if (!req.headers['x-authorization']) {
    return res.sendStatus(400);
  }

  const token = req.headers['x-authorization'] as string;
  verifyToken(token)
    .then(async ([isVerified, value]) => {
      if (!isVerified) {
        console.log(value);
        return res.sendStatus(400);
      }
      const username = (value as any).username;
      const User = await query("SELECT * FROM users WHERE user_name = $1", [username]);
      if (User.rows.length === 0 || ! User.rows[0].is_admin) {
        return res.sendStatus(401);
      } else {
        await query("DELETE FROM users WHERE user_name != $1;", [defaultUsername]);
        await query("DELETE FROM packagehistory;")
        await query("DELETE FROM packages;");
        return res.sendStatus(200);
      }
    })
    .catch((err) => {
      console.error(err);
      return res.sendStatus(400);
    });
}
export default ResetRegistry;
