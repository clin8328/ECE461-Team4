import express, { Request, Response } from "express";
import { query } from "../database";
import jwt from "jsonwebtoken";
async function deletePkgById(req: Request, res: Response) {
    const packageId = req.params.id;

    try {
        const result = await query("DELETE FROM packages WHERE id = $1 RETURNING *", [packageId]);

        if (result.rowCount === 0) {
            // No package found with the provided ID.
            return res.status(404).send("Package not found");
        }

        // Send the deleted package data as a JSON response.
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        // Handle any potential errors during the database query.
        console.error("Error deleting package by ID: ", error);
        return res.status(500).send("Internal Server Error");
    }
}

  
  
  

export default deletePkgById;
  