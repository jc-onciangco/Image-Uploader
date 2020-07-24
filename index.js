const express = require('express');
const multer = require('multer');
const path = require('path');
const ejs = require('ejs');

const app = express();

app.use(express.static('./public'));

const storage = multer.diskStorage({
    destination: './public/images/',
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {fileSize: 100000000}, 
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|gif|png|/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }
    else{
        cb('Error: Images Only!');
    }
}

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('index.ejs',{
                msg: err
            })
        }
        else {
            if(req.file === undefined){
                res.render('index.ejs', {
                    msg: 'Error: No file selected'
                });
            }
            else {
                res.render('index.ejs', {
                    msg: 'File Uploaded',
                    file: `images/${req.file.filename}`
                })
            }
        }
    });
});


app.listen(3000,() => console.log('Server running...'));