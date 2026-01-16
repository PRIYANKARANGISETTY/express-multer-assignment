const express = require("express");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary.config");
const upload = require("../middleware/upload.middleware");
const uniqueEmailMiddleware = require("../middleware/uniqueEmail.middleware");

const router = express.Router();
const dbPath = path.join(__dirname, "../db.json");

// SIGNUP USER
router.post(
  "/signup",
  upload.single("profile"),
  uniqueEmailMiddleware,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Profile image is required" });
      }

      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Cloudinary upload failed" });
          }

          const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

          const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            profilePic: result.secure_url,
          };

          db.users.push(newUser);
          fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

          res.status(201).json({
            message: "User registered successfully",
            user: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              profilePic: newUser.profilePic,
            },
          });
        }
      );

      result.end(req.file.buffer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
