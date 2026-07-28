// ======================================================
// Industry-251 Attendance System
// server.js (Part 1)
// Express + Aiven MySQL + Render Ready
// ======================================================

require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

// =============================
// Middleware
// =============================

app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============================
// MySQL Connection (Aiven)
// =============================

const db = mysql.createConnection({

    host: process.env.DB_HOST,

    port: process.env.DB_PORT,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    ssl: {
        rejectUnauthorized: false
    }

});

db.connect((err)=>{

    if(err){

        console.error("❌ Database Connection Failed");
        console.error(err);

        process.exit(1);

    }

    console.log("✅ Connected to Aiven MySQL");

});

// =============================
// Helper Functions
// =============================

function cleanText(value){

    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g,"");

}

function today(){

    return new Date()
        .toISOString()
        .split("T")[0];

}

// =============================
// Test Route
// =============================

app.get("/",(req,res)=>{

    res.json({

        success:true,

        application:"Industry-251 Attendance",

        database:"Connected",

        server:"Running"

    });

});

// =============================
// Health Check
// =============================

app.get("/health",(req,res)=>{

    db.query("SELECT 1",(err)=>{

        if(err){

            return res.status(500).json({

                success:false,

                database:"Disconnected"

            });

        }

        res.json({

            success:true,

            database:"Connected"

        });

    });

});