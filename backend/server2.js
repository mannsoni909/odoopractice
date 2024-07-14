// import express from "express";
// import pg from "pg";
// import nm from "nodemailer";

const express = require('express')
const pg = require('pg')
const nm = require('nodemailer')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const env = require('dotenv')

// import express from "express";
// import bodyParser from "body-parser";
// import pg from "pg";
// import bcrypt from "bcrypt";
// import passport from "passport";
// import { Strategy } from "passport-local";
// import session from "express-session";
// import env from "dotenv";
// import multer from "multer";
// import fs from 'fs'
// import axios from 'axios'

const app = express();
const port = 5000;
const saltRounds = 10;
env.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
db.connect();



// import cors from 'cors'
// const app = express()
var trans = nm.createTransport({
    service:'Gmail',
    auth : {
      user : "rudra.dave5972@gmail.com",
      pass : "rymj jpah lxil vvrb"
    }
});

// xpjp ejcv sztv ofin

app.use(express.json())
// app.use(express.urlencoded({extended:true}))
app.use(cors())

// const db = new pg.Client({
//     user: "postgres",
//     host: "localhost",
//     database: "odooprac",
//     password: "password",
//     port: 5972,
// })
// db.connect();


app.post('/otp', async (req,res)=>{
    var email = req.body.email
    try{
        var result = await db.query('SELECT * FROM user_details where email = $1',[email])
        if(result.rows.length != 0){
            res.status(201).json({message : 'Error in registering, Email might be already taken'})
        }else{
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(otp);
            var mail = {
                from:"sender@gmail.com",
                to : email,
                subject : "Email Verification",
                html : `<h1>Here's your OTP buddy : ${otp}</h1>`
            };
            trans.sendMail(mail,(err,info)=>{
            if(err){
                console.error(err.message);
                res.status(201).send({message : 'Error sending OTP, email might be invalid'})
            }else{
                // console.log(info);
                res.status(200).send({BEotp:otp})
            }
            });
        }
    }catch(err){
        console.log(err);
        res.status(201).json({message : 'Error in registering, Email might be already taken'})
    }
})
// app.post('/signup',async (req,res)=>{
//     const data= req.body
//     var username = data.name
//     var password = data.password
//     var email = data.email
//     try{
//         await db.query('INSERT into userlog(username,password,email) values ($1,$2,$3)',[username,password,email])
//         await db.query('INSERT into userDetail(username,email) values ($1,$2)',[username,email])
//         console.log('Done');
        
//         res.status(200).json({message:"Successful"})
//     }catch(err){
//         console.log(err);
//         res.status(201).json({message : 'Error in registering, username might be taken'})
//     }
    
//     res.send()
// })

app.post('/signup',async (req,res)=>{
    var data = req.body
    const email = data.email;
    const password = req.body.password;
    const name = req.body.name;

    try {
    const checkResult = await db.query("SELECT * FROM user_details WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.status(201).json({"Message": "User Already Exists"})
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.error("Error hashing password:", err);
            res.status(201).json({"Message": "Error hashing password"})

        } else {
          await db.query(
            "INSERT INTO user_details (email, password) VALUES ($1, $2)",
            [email, hash]
          );
          await db.query(
            "INSERT INTO user_role (email, role) VALUES ($1, $2)",
            [email, 'user']
          );
          await db.query(
            "INSERT INTO consumer_details (email,name,books_issued,fine) VALUES ($1, $2, $3, $4)",
            [email,name, 0, 0]
          );
          res.status(200).send({message:'Successful'})
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
})



// app.post('/login',async (req,res)=>{
//     const data= req.body
//     var email = data.email
//     var password = data.password
//     try{
//         var result = await db.query('SELECT * FROM userlog where email = $1 AND password = $2',[email,password])
//         if(result.rows.length != 0){
//             res.status(200).json({message :'Successful'})
//         }
//         else{
//             res.status(201).json({message:`User doesn't exist`})
//         }
//     }catch(err){
//         console.log(err);
//         res.status(201).json({message : 'Error While Logging in'})
//     }
    
//     res.send()
// })

app.post('/login',async (req,res)=>{
    var data = req.body
    const email = data.email;
    const password = req.body.password;
    
    try {
        const result = await db.query("SELECT * FROM user_details WHERE email = $1 ", [
          email,
        ]);
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const storedHashedPassword = user.password;
          bcrypt.compare(password, storedHashedPassword, async (err, valid) => {
            if (err) {
              //Error with password check
              console.error("Error comparing passwords:", err);
              return cb(err);
            } else {
              if (valid) {
                //Passed password check
                const role = ((await db.query('SELECT * from user_role where email = $1',[email])).rows[0].role)
                res.status(200).json({"message":"Successful","role": role })

              } else {
                //Did not pass password check
                res.status(201).json({"message":"Invalid Password"})
              }
            }
          });
        } else {
          res.status(201).json({"message":"User not found"})
        }
      } catch (err) {
        console.log(err);
      }
})


app.get('/inventory', async (req,res)=>{
    var inventory_items = await db.query('SELECT * from books')
    res.status(200).json(inventory_items.rows)
})


app.post('/fetchUserDetails',async (req,res)=>{
    var email = req.body.user
    // console.log(req.body)
    try{
        var result = await db.query('SELECT * FROM userdetails where email = $1 ',[email])
        // console.log(result)
        if(result.rows.length != 0){
            res.status(200).json({message :'Successful','result':result.rows[0]})
        }
        else{
            res.status(201).json({message:`User doesn't exist`})
        }
    }catch(err){
        console.log(err);
        res.status(201).json({message : 'Error While Logging in'})
    }
    res.send()
})

app.post('/updateUser',async(req,res)=>{
    const newData = req.body
    const {username,email,phone,address,profilePic} = newData
    console.log(newData)

    try{
            var result= await db.query(`
            UPDATE userdetails
            SET 
                username = $1,
                phone = $2,
                address = $3,
                profilepic=$4
            WHERE 
                email = $5;
        `,[username,phone,address,profilePic,email])
        console.log("Values updated")
        console.log(result.rowCount)
        res.status(200).json({message:'Successful'})
    }
    catch(error){
        console.log(error)
        res.status(201).json({message:"Some error occurred"})
    }
    res.send()  
})





app.listen(5000)


/*
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";
import multer from "multer";
import fs from 'fs'
import axios from 'axios'

const app = express();
const port = 5000;
const saltRounds = 10;
env.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
db.connect();

app.get('/inventory', async (req,res)=>{
    var inventory_items = await db.query('SELECT * from books')
    res.status(200).json(inventory_items.rows)
})

app.post('/signup',async (req,res)=>{
    var data = req.body
    const email = data.email;
    const password = req.body.password;
    const name = req.body.name;

    try {
    const checkResult = await db.query("SELECT * FROM user_details WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.status(201).json({"Message": "User Already Exists"})
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.error("Error hashing password:", err);
            res.status(201).json({"Message": "Error hashing password"})

        } else {
          await db.query(
            "INSERT INTO user_details (email, password) VALUES ($1, $2)",
            [email, hash]
          );
          await db.query(
            "INSERT INTO user_role (email, role) VALUES ($1, $2)",
            [email, 'user']
          );
          await db.query(
            "INSERT INTO consumer_details (email,name,books_issued,fine) VALUES ($1, $2, $3, $4)",
            [email,name, 0, 0]
          );
          res.status(200).send('Done')
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
})

app.post('/login',async (req,res)=>{
    var data = req.body
    const email = data.email;
    const password = req.body.password;
    
    try {
        const result = await db.query("SELECT * FROM user_details WHERE email = $1 ", [
          email,
        ]);
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const storedHashedPassword = user.password;
          bcrypt.compare(password, storedHashedPassword, async (err, valid) => {
            if (err) {
              //Error with password check
              console.error("Error comparing passwords:", err);
              return cb(err);
            } else {
              if (valid) {
                //Passed password check
                const role = ((await db.query('SELECT * from user_role where email = $1',[email])).rows[0].role)
                res.status(200).json({"Message":"Successful","Role": role })

              } else {
                //Did not pass password check
                res.status(201).json({"Message":"Invalid Password"})
              }
            }
          });
        } else {
          res.status(201).json({"Message":"User not found"})
        }
      } catch (err) {
        console.log(err);
      }
})

// app.get('/trending',async (req,res)=>{
//     try {
//         const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
//           params: { 
//             q: 'subject:any',
//             orderBy: 'newest', // Order by newest to get trending books
//             maxResults: 1, // Limit to top 10 books
//             key: 'AIzaSyAaDTUas2S-zJgKNwJgvx2lZhzF4QELoRo', // Replace with your Google Books API key
//           },
//         });
    
//         // Extract relevant information from the response
//         const books =[] 
//         const items = await response.data.items
//         for(var book of items){
//             const bookDetails = await axios.get(book.selfLink, {
//                         params: { 
//                         key: 'AIzaSyAaDTUas2S-zJgKNwJgvx2lZhzF4QELoRo', // Replace with your Google Books API key
//                         },
//                     });
//                     if(bookDetails.volumeInfo.imageLinks){
//                         return {
//                             title: bookDetails.volumeInfo.title,
//                             authors: bookDetails.volumeInfo.authors[0],
//                             publisher: bookDetails.volumeInfo.publisher,
//                             publishedDate: bookDetails.volumeInfo.publishedDate,
//                             description: bookDetails.volumeInfo.description,
//                             thumbnail: bookDetails.volumeInfo.imageLinks.thumbnail
//                         };
//                     }else{
//                         return {
//                             title: bookDetails.volumeInfo.title,
//                             authors: bookDetails.volumeInfo.authors[0],
//                             publisher: bookDetails.volumeInfo.publisher,
//                             publishedDate: bookDetails.volumeInfo.publishedDate,
//                             description: bookDetails.volumeInfo.description
//                         };
//                     }
                    
            
               
            
                
            
//         }
//           } catch (error) {
//                 console.error('Error fetching trending books:', error);
//             }   
//             console.log(books);
//                 res.json(books)
// })

app.listen(port, () => {
    console.log(Server running on port ${port});
});
*/