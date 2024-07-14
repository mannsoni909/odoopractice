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


// A code for borrow button
app.post('/borrow',async (req,res)=>{
    var data = req.body
    const email = data.email;
    const isbn = data.isbn;
    const book_name = data.book_name
    var exp  = new Date()
    var day = exp.getDate(); // Returns the day of the month (1-31)
    var month = exp.getMonth() + 1; // Returns the month (0-11), so add 1 to get the correct month
    var year = exp.getFullYear(); // Returns the year (four digits)
    // Format the date as YYYY-MM-DD
    const issue_date = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

    var exp = new Date(issue_date+ 60)  //7*24*60*60
    var day = exp.getDate(); // Returns the day of the month (1-31)
    var month = exp.getMonth() + 1; // Returns the month (0-11), so add 1 to get the correct month
    var year = exp.getFullYear(); // Returns the year (four digits)
    // Format the date as YYYY-MM-DD
    const expiry_date = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
    try {
        var quantity = (await db.query('SELECT quantity from books where isbn = $1',[isbn])).rows[0].quantity

        if(quantity>0){
            await db.query('INSERT INTO borrow_data(isbn, book_name, email, issue_date, expiry_date) values ($1, $2, $3, $4, $5)',
                 [isbn, book_name, email, issue_date, expiry_date]
            )

            await db.query('UPDATE books set quantity = $1',[quantity-1])

            res.status(200).json({'message': 'Successfull'})

        }else{
            res.status(201).json({'message': 'Book Out of stock'})
        }
        
    } catch (error) {
        console.error(error)
        res.status(201).json({'message': 'Error in query'})
        
    }
})


// A FUNCTION FOR BORROW LOGIC
app.get('/allBorrowedBooks',async (req,res)=>{
    var data = req.body
    const email = data.email;
    try{
        var result = (await db.query('SELECT * FROM borrow_data where email = $1',[email])).rows
        res.status(200).json({'message': 'Successfull', 'books':result})
    }catch(error){
        res.status(201).json({'message': 'Error in query'})
    }
})



app.listen(5000)

/*
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Error connecting to PostgreSQL', err));

// Define the base URL for the Google Books API
const baseURL = 'https://www.googleapis.com/books/v1/volumes';

// Middleware to parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.render("index.ejs");
})

// POST route to add a book
app.post("/add-book", async (req, res) => {
  const { isbn } = req.body; // Assuming you're sending ISBN in the request body

  if (!isbn) {
    return res.status(400).json({ message: 'ISBN is required' });
  }

  try {
    // Fetch book details from Google Books API
    const response = await axios.get(${baseURL}?q=isbn:${isbn});
    const book = response.data.items[0]; // Assuming the first item is the correct book

    if (!book) {
      return res.status(404).json({ message: 'Book not found in Google Books API' });
    }

    const { title, subtitle, authors, publisher, publishedDate, description, industryIdentifiers, categories, imageLinks, averageRating } = book.volumeInfo;

    // Convert authors to array if it's a single string
    const authorsArray = Array.isArray(authors) ? authors : [authors];

    // Parse publishedDate to a valid DATE format
    let published_date = null;
    if (publishedDate) {
      published_date = new Date(publishedDate).toISOString().split('T')[0];
    }

    // Handle averageRating to ensure it's an integer
    let rating = null;
    if (averageRating) {
      rating = Math.round(averageRating); // Round to nearest integer
    }

    // Insert book details into PostgreSQL database
    const insertQuery = `
      INSERT INTO books (title, subtitle, authors, publisher, published_date, description, isbn, genre, cover_image, ratings)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    const values = [
      title || 'N/A',
      subtitle || null,
      authorsArray || ['N/A'], // Ensure authors is treated as an array
      publisher || 'N/A',
      published_date || null,
      description || null,
      industryIdentifiers ? industryIdentifiers.map(id => id.identifier).join(', ') : 'N/A',
      categories ? categories.join(', ') : 'N/A',
      imageLinks ? imageLinks.thumbnail : 'N/A',
      rating || null
    ];

    // Execute the INSERT query
    await client.query(insertQuery, values);

    res.status(201).json({ message: 'Book added successfully' });

  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/update-book", async (req, res) => {
    const { isbn, title, genre, authors, rating } = req.body;

    // console.log(isbn)
    // console.log(title)
    // console.log(genre)
    // console.log(authors)
    // console.log(rating)
    if (!isbn) {
      return res.status(400).json({ message: 'ISBN is required for updating the book' });
    }
  
    try {
      // Fetch the existing book from the database
      const selectQuery = 'SELECT * FROM books WHERE isbn = $1';
      const selectResult = await client.query(selectQuery, [isbn]);
  
      if (selectResult.rows.length === 0) {
        return res.status(404).json({ message: 'Book not found in the database' });
      }
  
      // Update the book details
      const updateQuery = `
        UPDATE books
        SET title = COALESCE($1, title),
            genre = COALESCE($2, genre),
            authors = COALESCE($3, authors),
            ratings = COALESCE($4, ratings)
        WHERE isbn = $5
      `;
  
      const updateValues = [
        title || null,
        genre || null,
        authors ? {${authors.join(',')}} : null, // Ensure authors is formatted correctly as an array
        rating || null,
        isbn
      ];
  
      // Execute the UPDATE query
      await client.query(updateQuery, updateValues);
  
      res.status(200).json({ message: 'Book updated successfully' });
  
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/delete-book", async (req, res) => {
    const { title, authors } = req.body;
  
    if (!title || !authors) {
      return res.status(400).json({ message: 'Title and authors are required to delete a book' });
    }
  
    try {
      // Convert authors to array if it's a single string
      const authorsArray = authors.split(',');
  
      // Delete the book from the database
      const deleteQuery = `
        DELETE FROM books
        WHERE title = $1 AND authors @> $2::text[]
      `;
  
      const deleteValues = [
        title,
        {${authorsArray.join(',')}} // Ensure authors is formatted correctly as an array
      ];
  
      // Execute the DELETE query
      await client.query(deleteQuery, deleteValues);
  
      res.status(200).json({ message: 'Book deleted successfully' });
  
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }); */