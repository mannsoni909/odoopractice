const express = require('express')
const pg = require('pg')
const nm = require('nodemailer')
const cors = require('cors')

const app=express()

app.use(express.json())
app.use(cors())

// const db = new pg.Client({
//     user: "postgres",
//     host: "localhost",
//     database: "hackaprac",
//     password: "mann9",
//     port: 5432,
// })
// db.connect();

// var trans = nm.createTransport({
//     service:'Gmail',
//     auth : {
//       user : "rudra.dave5972@gmail.com",
//       pass : "xpjp ejcv sztv ofin"
//     }
// });

// app.post('/otp', async (req,res)=>{
//     console.log("OK")
//     var email = req.body.email
//     try{
//         var result = await db.query('SELECT * FROM userlog where email = $1',[email])
//         if(result.rows.length != 0){
//             res.status(201).json({message : 'Error in registering, Email might be already taken'})
//         }else{
//             const otp = Math.floor(100000 + Math.random() * 900000).toString();
//             console.log(otp);
//             var mail = {
//                 from:"sender@gmail.com",
//                 to : email,
//                 subject : "Email Verification",
//                 html : `<h1>Here's your OTP buddy : ${otp}</h1>`
//             };
//             trans.sendMail(mail,(err,info)=>{
//             if(err){
//                 console.error(err.message);
//                 res.status(201).send({message : 'Error sending OTP, email might be invalid'})
//             }else{
//                 console.log(info);
//                 res.send(200).send({message: 'Successfull' , 'OTP': otp})
//             }
//             });
//         }
//     }catch(err){
//         console.log(err);
//         res.status(201).json({message : 'Error in registering, Email might be already taken'})
//     }
// })

app.post('/signup',(req,res)=>{
    const user=req.body
    users.push(user)
    console.log(user)
    res.status(200).json({message:"Successful"})
    res.send()
})

// const users=[{email:'m@gmail.com',password:'mann1234'}]
app.post('/',(req,res)=>{
    const logUser=req.body
    console.log(logUser)
    var userExist = false
    for (var user of users){
        if(user.email===logUser.email && user.password===logUser.password){
            userExist=true
        }
    }
        if (userExist){
            res.status(200).json({message:"Successful"})
        }
        else{
            res.status(201).json({message:"Invalid Details"})
        }
        res.send()
})

app.listen(5000)