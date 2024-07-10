// import express from "express";
// import pg from "pg";
// import nm from "nodemailer";

const express = require('express')
const pg = require('pg')
const nm = require('nodemailer')
const cors = require('cors')

// import cors from 'cors'
const app = express()
var trans = nm.createTransport({
    service:'Gmail',
    auth : {
      user : "rudra.dave5972@gmail.com",
      pass : "xpjp ejcv sztv ofin"
    }
});

// xpjp ejcv sztv ofin

app.use(express.json())
// app.use(express.urlencoded({extended:true}))
app.use(cors())

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "hackaprac",
    password: "mann9",
    port: 5432,
})
db.connect();

var data1;

app.post('/otp', async (req,res)=>{
    var email = req.body.email
    try{
        var result = await db.query('SELECT * FROM userlog where email = $1',[email])
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
app.post('/signup',async (req,res)=>{
    const data= req.body
    var username = data.name
    var password = data.password
    var email = data.email
    try{
        await db.query('INSERT into userlog(username,password,email) values ($1,$2,$3)',[username,password,email])
        console.log('Done');
        res.status(200).json({message:"Successful"})
    }catch(err){
        console.log(err);
        res.status(201).json({message : 'Error in registering, username might be taken'})
    }
    
    res.send()
})

app.post('/',async (req,res)=>{
    const data= req.body
    var email = data.email
    var password = data.password
    try{
        var result = await db.query('SELECT * FROM userlog where email = $1 AND password = $2',[email,password])
        if(result.rows.length != 0){
            res.status(200).json({message :'Successful'})
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

app.get('/home',(req,res)=>{
    res.send(data1)
})

app.listen(5000)