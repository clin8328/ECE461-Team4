import express, { Request, Response } from "express";
import { query } from "../database";
import { verifyToken } from "../common";
import { isValid } from "date-fns";
import axios from "axios";

async function updatePkgById(req: Request, res: Response) {
    const token = req.headers['x-authorization'] as string;
    let decoded = null;
    try {
        decoded = await verifyToken(token);
    } catch (err) {
        console.error(err);
        return res.sendStatus(400);
    }
    if (!req.body.metadata || !req.body.data) return res.sendStatus(400)
    if (!req.body.metadata.ID || !req.body.metadata.Name || !req.body.metadata.Version) return res.sendStatus(400)
    if (req.body.data.Content && req.body.data.URL) return res.sendStatus(400)
    if (!req.body.data.Content && !req.body.data.URL) return res.sendStatus(400)
    const username = decoded[1].username;
    const metadata = req.body.metadata
    const data = req.body.data
    const jsprogram = data.JSProgram || null
    const pkg_name = metadata.Name
    const pkg_version = metadata.Version
    const pkg_id = metadata.ID
    if (req.params.id !== pkg_id) return res.sendStatus(400)
    const pkg = await query('SELECT * FROM packages WHERE package_id = $1 AND package_name = $2 AND package_version = $3', [pkg_id, pkg_name, pkg_version])
    if (pkg.rowCount && pkg.rowCount === 0) return res.sendStatus(404)
    if (data.Content) {
        if (!isValidBase64(data.Content)) return res.sendStatus(400)
        const buffer = Buffer.from(data.Content, "base64");
        await query('UPDATE packages SET package_zip = $1, jsprogram = $2 WHERE package_id = $3 AND package_name = $4 AND package_version = $5', [buffer, jsprogram, pkg_id, pkg_name, pkg_version])
        await query('INSERT INTO packagehistory (user_name, user_action, package_id) VALUES($1, $2, $3)', [username, 'UPDATE', pkg_id]);
        return res.sendStatus(200);
    } else {
        const endpoints = parseUrl(data.URL)
        let response = null
        try {
            response = await axios.get(endpoints[0], { responseType: 'arraybuffer' })
            if (response.status !== 200) {
            response = await axios.get(endpoints[1], { responseType: 'arraybuffer' })
            }
        } catch (err) {
            console.error(err);
            return res.sendStatus(400);
        }
        if (!response.data) return res.sendStatus(400);
        const bytea = Buffer.from(response.data, 'binary')
        await query('UPDATE packages SET package_zip = $1, jsprogram = $2 WHERE package_id = $3 AND package_name = $4 AND package_version = $5', [bytea, jsprogram, pkg_id, pkg_name, pkg_version])
        await query('INSERT INTO packagehistory (user_name, user_action, package_id) VALUES($1, $2, $3)', [username, 'UPDATE', pkg_id]);
        return res.sendStatus(200);
    }
}

  
function isValidBase64(str: string): boolean {
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    return base64Regex.test(str);
}
function parseUrl(url: string): string[] {
  const endpoint1 = url + '/archive/master.zip'
  const endpoint2 = url + '/archive/main.zip' 
  return [endpoint1, endpoint2]
}

export default updatePkgById;