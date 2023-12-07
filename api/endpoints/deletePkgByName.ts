import express, { Request, Response } from "express";
import { query } from "../database";
import { verifyToken } from "../common";

async function deletePkgByName(req: Request, res: Response) {
    // const token = req.headers['x-authorization'] as string;
    // if (!token) return res.sendStatus(400)
    const name = req.params.name;
    if (!name) return res.sendStatus(400);
    // let decoded = null
    // try {
    //     decoded = await verifyToken(token);
    // } catch (err) {
    //     return res.sendStatus(400);
    // }
    //delete pkg
    try {
        const pkg = await query("SELECT * FROM packages WHERE package_name = $1;", [name]);
        if (pkg.rowCount == 0 ) return res.sendStatus(404);
        await query("DELETE FROM packagehistory WHERE package_name = $1;", [name]);
        await query("DELETE FROM packages WHERE package_name = $1;", [name]);
        return res.sendStatus(200);
    } catch (error) {
        console.error("Error deleting package by Name: ", error)
        return res.sendStatus(500)
    }
}

  
  
  

export default deletePkgByName;