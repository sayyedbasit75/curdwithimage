const express = require('express');
const app = express()
const cors = require('cors')
const db = require('./config/db');
const bodyParser = require('body-Parser');
const multer = require('multer');
// const path = require('path');
var path = './public/uploads';

app.use(bodyParser.json());

app.use(cors());
app.use(express.static(__dirname+'/public'));
// app.use(express.static(path.join(__dirname, '/public/uploads')));
// app.use(express.static('uploads'));


port = 3000;


let storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, path)
    },
    filename: (req, file, cb) =>{
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
});

// path.extname(file.originalname)

let upload = multer({
    storage : storage
})

app.get("/get", (req, res)=>{

    const sql = `SELECT * FROM tb_events`;

    db.query(sql, (err, result)=>{
        if(err){
            res.send(400).send({
                ack: true,
                message:"no data found..."
            }) 
            } else{
                res.json({
                    ack: true,
                    result
                })
        }
    })

});


app.post("/insert", upload.single('image'), (req , res)=>{
// app.post("/insert", (req , res)=>{

    const body = req.body;

    const sql = `INSERT INTO tb_events (name, description, photo) VALUES ("${req.body.name}", "${req.body.description}", "${req.file.filename}")`;
    // const sql = `INSERT INTO tb_events (name, description, photo) VALUES ("${req.body.name}", "${req.body.description}", "${req.body.photo}")`;


    db.query(sql, (err, result)=>{
        console.log(sql)
        if(err){
            res.status(400).send({
                ack: false,
                message:"unable to insert data..."
            })
        } else {
            res.json({
                ack: true,
                message:"data inserted successfully..."
            })
        }
    })

});

app.put("/update/:id", (req ,res)=>{
    const body = req.body;
    id = req.params.id;

    sql = `UPDATE tb_events SET name="${body.name}", description="${body.description}", photo="${body.photo}" WHERE id = ${id}`;

    db.query(sql, (err, result)=>{
        if(err){
            res.send(400).send({
                ack: true,
                message: "Unable to update..."
            })
        } else {
            res.json({
                ack: true,
                message: "updated successfully...",
                // result
            })
        }
    })

})

app.delete("/delete/:id", (req, res)=>{

    const id = req.params.id;
    sql = `DELETE FROM tb_events WHERE id = ${id}`

    db.query(sql, (err, result)=>{
        if(err){
            res.status(400).send({
                ack: false,
                message: "unable to delelte.."
            })
        } else {
            res.json({
                ack: true,
                message:"Delelte successfully..."
            })
        }
    })
});

app.post("/api/image", upload.single('image'), (req, res)=>{
    sql = `INSERT INTO tb_events (photo) VALUES ("${req.file.filename}")`
    // db.query(sql, (err, result)=>{
       
    // })
    if(!req.file){
        res.send({
            ack: false,
            message: 'no photo available'
        })
    } else{
        res.json({
            ack: true,
            message: 'uploaded successfully...'
        })
        var query = db.query(sql, (err, result) =>{
            console.log('inserted data');
         });
    }
    })
    

app.listen(port, ()=>{
    console.log("Server app and running...on Port No", port)
})