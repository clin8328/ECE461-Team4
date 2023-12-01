import express, { Request, Response } from "express";
import { query } from "../database";
import jwt from "jsonwebtoken";
async function getPackageByRegEx(req: Request, res: Response) {
    const { pattern } = req.body;
    if (!pattern) {
      return res.status(400).send("Pattern is required");
    }
    try {
      const result = await query("SELECT * FROM packages WHERE name ~ $1", [pattern]);
      
      if (result.rows.length === 0) {
        // No packages found matching the pattern.
        return res.status(404).send("No packages match the provided pattern");
      }
  
      // Send the matching package data as a JSON response.
      return res.status(200).json(result.rows);
    } catch (error) {
      // Handle any potential errors during the database query.
      console.error("Error fetching packages by regex: ", error);
      return res.status(500).send("Internal Server Error");
    }
  }
  
export default getPackageByRegEx;
  
