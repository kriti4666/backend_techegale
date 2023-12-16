const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const connection = require("./config/db")
const cors = require("cors")

const customerRoutes = require('./routes/customer');
const managerRoutes = require('./routes/manager');

const app = express();
app.use(express.json());
app.use(cors())


app.use('/auth', authRoutes);
app.use('/customer', customerRoutes);
app.use('/manager', managerRoutes);



app.get("/", (req, res) => {
  res.send("Welcome")
})

app.listen(process.env.PORT || 8080, async (req, res) => {
    try {
      await connection;
      console.log("connection successfull");
    } catch (error) {
      console.log("connection to database failed");
      console.log(error);
    }
    console.log(`listening on port ${process.env.PORT}`);
  });