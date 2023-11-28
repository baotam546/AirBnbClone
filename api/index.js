const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Place = require('./models/Place');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
require('dotenv').config();
const jwtSecretKey = process.env.secretKey;
const port = 4000;
const bcryptSalt = bcrypt.genSaltSync(10);
const multer = require('multer');
const fs = require('fs');
const photosMiddleware = multer({ dest: 'uploads' })

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URI, {
    dbName: 'AirBnb',
});

app.get('/test', (req, res) => {
    res.json({ message: 'hello' })
})

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name: name,
            email: email,
            password: bcrypt.hashSync(password, bcryptSalt),
        })
        res.json(userDoc);
    } catch (error) {
        res.status(422).json({ message: error });
    }

})

app.get('/profile', async (req, res) => {
    const { token } = req.cookies;
    try {
        if (token) {
            jwt.verify(token, jwtSecretKey, {}, async (err, user) => {
                if (err) throw err;
                const { name, email, _id } = await User.findById(user.id)
                res.json({
                    user: { name, email, _id }
                });
            })
        } else {
            res.json('refresh error');
        }
    } catch (error) {
        console.log(error);
    }

})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userDoc = await User.findOne({ email });

        if (userDoc) {
            const passOk = bcrypt.compareSync(password, userDoc.password);
            if (passOk) {
                //logged in
                jwt.sign({
                    email: userDoc.email,
                    id: userDoc._id,
                    name: userDoc.name
                }, jwtSecretKey, {}, (err, token) => {
                    if (err) throw err;
                    console.log('Setting cookie...');
                    try {
                        res.cookie('token', token, { secure: false, httpOnly: false, path: '/' }).json(userDoc);

                    } catch (error) {
                        console.log(error);
                    }

                })
            } else {
                res.status(422).json('pass not ok')
            }
        } else {
            res.json('not found')
        }
    } catch (error) {

    }
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('logouted');
})


app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg'
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    })
    res.json(newName)
})

app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.')
        console.log('parts', parts);

        const ext = parts[parts.length - 1];
        console.log('ext', ext);
        const newPath = path + '.' + ext;
        console.log('newPath', newPath);
        fs.renameSync(path, newPath);
        uploadFiles.push(newPath.replace('uploads\\', ''));
        console.log('uploadFiles', uploadFiles);
    }
    res.json(uploadFiles);
})
// create place
app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
    jwt.verify(token, jwtSecretKey, {}, async (err, user) => {
        if (err) throw err;
        const place = await Place.create({
            owner: user.id,
            title,
            address,
            photos: addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price
        })

        res.json(place);
    })
})
// get all places
app.get('/places', async (req, res) => {
    res.json(await Place.find());
})
// get user places
app.get('/user-places', async (req, res) => {
    const { token } = req.cookies;
    try {
        jwt.verify(token, jwtSecretKey, {}, async (err, user) => {
            if (err) throw err;
            const { id } = user;
            res.json(await Place.find({ owner: id }));
        })
    } catch (error) {
        console.log(error);
    }
})
// get place by id
app.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
})

app.put('/places', async (req, res) => {

    const { token } = req.cookies;
    const { id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
    jwt.verify(token, jwtSecretKey, {}, async (err, user) => {
        const placeData = await Place.findById(id);
        if (err) throw err;
        if (user.id === placeData.owner.toString()) { 
            placeData.set(
                {
                    title,
                    address,
                    photos: addedPhotos,
                    description,
                    perks,
                    extraInfo,
                    checkIn,
                    checkOut,
                    maxGuests,
                    price
                }
            );
            await placeData.save();
            res.json(placeData);
        }
    })
})

app.listen(port)

