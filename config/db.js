const express = require('express');
const mysql = require('mysql');


const conn = mysql.createConnection({
    host: "localhost",
    database: "sample",
    user: "root",
    password: "",
});

conn.connect();

module.exports = conn;