import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';

const pdf = require('pdf-parse');

export const uploadRouter = Router();
const upload = multer({ dest: 'uploads/' });

uploadRouter.post('/resume', upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let extractedText = "";

    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdf(dataBuffer);
      extractedText = pdfData.text;
    } else {
      extractedText = fs.readFileSync(req.file.path, 'utf-8');
    }

    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const email = extractedText.match(emailRegex)?.[0] || `unknown${Date.now()}@example.com`;

    const lines = extractedText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let firstName = "Unknown";
    let lastName = "Candidate";
    
    if (lines.length > 0) {
      const nameParts = lines[0].replace(/[^a-zA-Zа-яА-Я\s]/g, '').split(/\s+/);
      if (nameParts.length >= 2) {
        firstName = nameParts[0];
        lastName = nameParts[1];
      } else if (nameParts.length === 1) {
        firstName = nameParts[0];
      }
    }

    const response = await fetch('http://localhost:4000/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone: extractedText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g)?.[0] || "",
        position: "Pending Review",
        location: "Remote",
        source: req.file.originalname,
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create candidate in Core Service');
    }

    const data = await response.json();

    fs.unlinkSync(req.file.path);

    res.status(201).json({ 
      message: 'Resume parsed and candidate created', 
      candidate: data.data 
    });

  } catch (err) {
    next(err);
  }
});