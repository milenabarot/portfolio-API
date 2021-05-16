const express = require("express");

const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

const port = process.env.PORT || 3030;

app.use(express.json());
require("dotenv/config");

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Change later to only allow our server
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const transport = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

app.get("/api", (req, res, next) => {
  res.send("API Status: Running");
});

app.post("/api/email", (req, res, next) => {
  const message = {
    to: process.env.EMAIL,
    from: process.env.EMAIL,
    subject: `A new message from ${req.body.name}`,
    html: `<p>${req.body.message}</p> <br /> <p>from: ${req.body.email}</p>`,
  };

  transport.sendMail(message, (error, info) => {
    if (error) {
      res.status(401).json({
        success: false,
      });
    }
    res.status(200).json({
      success: true,
    });
  });
});

app.listen(port);
