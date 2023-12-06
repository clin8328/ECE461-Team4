import jwt from "jsonwebtoken";
const tokenKey: string = "461_secret_key";
export async function verifyToken(token: string): Promise<[boolean, any]> {
    return new Promise<[boolean, any]>((resolve, reject) => {
      let _token = token;
      if (token.startsWith("bearer ")) {
        _token = token.slice(7);
      }
      jwt.verify(_token, tokenKey, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve([true, decoded]);
        }
      });
    });
}