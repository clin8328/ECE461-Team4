import express, { Request, Response } from "express";
import { query } from "../database";
import jwt from "jsonwebtoken";
import { get } from "http";

async function getPkgByName(req: Request, res: Response) {
    const packageName = req.params.name;
  
    try {
      const result = await query("SELECT * FROM packages WHERE name = $1", [packageName]);
      
      if (result.rows.length === 0) {
        // No package found with the provided name.
        return res.status(404).send("Package not found");
      }
  
      // Send the package data as a JSON response.
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      // Handle any potential errors during the database query.
      console.error("Error fetching package by name: ", error);
      return res.status(500).send("Internal Server Error");
    }
  }

export default getPkgByName;