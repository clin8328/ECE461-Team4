import { Request, Response } from "express";
import { query } from "../database";
//import { verifyToken } from "../common";

async function deletePkgById(req: Request, res: Response) {
    // const token = req.headers['x-authorization'] as string;
    // if (!token) return res.sendStatus(400)
    const id = req.params.id;
    if (!id) return res.sendStatus(400);
    // let decoded = null
    // try {
    //     decoded = await verifyToken(token);
    // } catch (err) {
    //     return res.sendStatus(400);
    // }
    const pkg = await query("SELECT * FROM packages WHERE package_id = $1;", [id]);
    if (pkg.rowCount == 0 ) return res.sendStatus(404);
    //delete pkg
    try {
        await query("DELETE FROM packagehistory WHERE package_id = $1;", [id]);
        await query("DELETE FROM packages WHERE package_id = $1;", [id]);
        return res.sendStatus(200);
    } catch (error) {
        console.error("Error deleting package by ID: ", error)
        return res.sendStatus(500)
    }
}

  
  
  

export default deletePkgById;
  