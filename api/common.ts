import jwt from "jsonwebtoken";
import { query } from "./database";
const tokenKey: string = "461_secret_key";

export function verifyToken(token: string): Promise<[boolean, any]> {
    return new Promise<[boolean, any]>((resolve, reject) => {
      jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve([true, decoded]);
        }
      });
    });
}