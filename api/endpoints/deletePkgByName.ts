import express, { Request, Response } from "express";
import { query } from "../database";
import jwt from "jsonwebtoken";
import { get } from "http";
async function deletePkgByName(req: Request, res: Response) {
    const packageName = req.params.byName;

    try {
        const result = await query("DELETE FROM packages WHERE name = $1 RETURNING *", [packageName]);

        if (result.rowCount === 0) {
            // No package found with the provided name.
            return res.status(404).send("Package not found");
        }

        // Send the deleted package data as a JSON response.
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        // Handle any potential errors during the database query.
        console.error("Error deleting package by name: ", error);
        return res.status(500).send("Internal Server Error");
    }
}

  
  
  

export default deletePkgByName;