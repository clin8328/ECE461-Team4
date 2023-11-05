import express, { Request, Response } from "express";
import { query } from "../database";
import jwt from "jsonwebtoken";
import { de } from "date-fns/locale";
const tokenKey: string = "461_secret_key";
const defalutUsername = 'ece30861defaultadminuser';
function ResetRegistry(req: Request, res: Response) {
  if (req.headers['x-authorization'] === undefined) return res.sendStatus(400)
  const token = req.headers['x-authorization']
  jwt.verify(token as string, tokenKey, async (err, decoded) => {
    if (err) return res.sendStatus(400);
    else {
      console.log(decoded)
      const username = (decoded as any).username;
      const password = (decoded as any).password;
      const User = await query("SELECT * FROM users WHERE user_name = $1", [username]);
      console.log(User.rows[0])
      if (User.rows.length === 0 || ! User.rows[0].is_admin) {
        return res.sendStatus(401);
      } else {
        await query("DELETE FROM users WHERE user_name != $1;", [defalutUsername]);
        await query("DELETE FROM packages;");
        await query("DELETE FROM packagehistory;")
        await query("DELETE FROM packagemetadata;")
        return res.sendStatus(200);
      }
    }
  })
}




export default ResetRegistry;
