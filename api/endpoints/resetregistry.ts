import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { query } from "../database";
import { verifyToken } from "../common";
const tokenKey: string = "461_secret_key";
const defaultUsername = 'ece30861defaultadminuser';
export async function ResetRegistry(req: Request, res: Response) {
  const token = req.headers['x-authorization'] as string;
  if (!token) return res.sendStatus(400);
  let decoded = null
  try {
      decoded = await verifyToken(token);
  } catch (err) {
      console.log(err)
      return res.sendStatus(401);
  }
  try {
    const username = (decoded as any)[1].username;
    const User = await query("SELECT * FROM users WHERE user_name = $1", [username]);
    if (User.rows.length === 0 || !User.rows[0].is_admin) {
      console.log("User is not admin or user not found")
      return res.sendStatus(401);
    }
    await query("DELETE FROM users WHERE user_name != $1;", [defaultUsername]);
    await query("DELETE FROM packagehistory;")
    await query("DELETE FROM packages;");
    return res.sendStatus(200);
  } catch (error) {
    console.error("Error resetting registry: ", error)
    return res.sendStatus(500)
  }
}
export default ResetRegistry;
