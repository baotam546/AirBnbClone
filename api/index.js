const express = require('express');
const app = express();
const cors = require('cors');
const  mongoose  = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser');
require('dotenv').config();
const jwtSecretKey = process.env.secretKey;
const port = 4000;

const bcryptSalt = bcrypt.genSaltSync(10);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URI, {
    dbName: 'AirBnb', 
  });

app.get('/test',(req,res)=>{
    res.json({message:'hello'})
})

app.post('/register', async (req,res)=>{
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
        name: name,
        email: email,
        password:bcrypt.hashSync(password, bcryptSalt ),
    })
    res.json(userDoc);
    } catch (error) {
        res.status(422).json({message:error});
    }
    
})

app.get('/profile', async(req,res)=>{
   const {token} = req.cookies;
   try {
    if(token){
        jwt.verify(token, jwtSecretKey, {}, async (err, user)=>{
            if(err) throw err;
            const {name, email,_id} = await User.findById(user.id)
            res.json({name, email,_id});
        })
    }else{
        res.json('refresh error');
    }
   } catch (error) {
    console.log(error);
   }
   
})

app.post('/login', async (req,res)=>{
    const { email, password } = req.body;
    try {
        const userDoc = await User.findOne({email});
        
        if(userDoc){
            const passOk = bcrypt.compareSync(password, userDoc.password);
            if(passOk){
                //logged in
                jwt.sign({
                    email:userDoc.email, 
                    id:userDoc._id, 
                    name:userDoc.name
                }, jwtSecretKey, {}, (err,token)=>{
                    if(err) throw err;
                    console.log('Setting cookie...');
                    try {
                        res.cookie('token', token, { secure: false,httpOnly: false,path: '/' }).json(userDoc);
                        
                    } catch (error) {
                        console.log(error);
                    }
                    
                })
            }else{
                res.status(422).json('pass not ok')
            }
        }else{
            res.json('not found')
        }
    } catch (error) {
        
    }
})

app.listen(port)