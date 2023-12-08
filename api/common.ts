import jwt from "jsonwebtoken";
const tokenKey: string = "461_secret_key";
export async function verifyToken(token: string): Promise<[boolean, any]> {
    return new Promise<[boolean, any]>((resolve, reject) => {
      const _token = token.replace(/"/g, "");
      jwt.verify(_token, tokenKey, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve([true, decoded]);
        }
      });
    });
}