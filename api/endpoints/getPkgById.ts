import express, { Request, Response } from "express";
import { query } from "../database";
import { verifyToken} from "../common";

async function packageById(req: Request, res: Response) {
    const token = req.headers['x-authorization'] as string;
    const packageId = req.params.id;
    if (!packageId) return res.sendStatus(400);
    // Verify the JWT.
    try {
        const user = await verifyToken(token);
        if (!user) {
            return res.sendStatus(400);
        }
    } catch (err) {
        return res.sendStatus(400)
    }
    try {
      const result = await query("SELECT * FROM packages WHERE package_id = $1", [packageId]);
      if (result.rowCount == 0) {
        // No package found with the provided ID.
        return res.sendStatus(404);
      }
      const metadata = {
        Name: result.rows[0].package_name,
        Version: result.rows[0].package_version,
        ID: result.rows[0].package_id,
      }
      const data = {
        Content: result.rows[0].package_zip.toString('base64'),
        JSProgram: result.rows[0].jsprogram,
      }
      const response = {
        metadata: metadata,
        data: data,
      }
      // Send the package data as a JSON response.
      return res.status(200).json(response);
    } catch (error) {
      // Handle any potential errors during the database query.
      console.error("Error fetching package by ID: ", error);
      return res.status(500).send("Internal Server Error");
    }
  }

export default packageById;