const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');

require('dotenv').config();

//DB connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(
    () => {
        console.log("DATABASE CONNECTED");
});

//middelwares 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//routes
app.use("/api", authRoutes);

app.use("/api", userRoutes);

app.use("/api", categoryRoutes);

app.use("/api", productRoutes);

app.use("/api", orderRoutes);

//port 
const port = process.env.PORT || 8001;

//starting service
app.listen(port, () => {
    console.log(`App is running at ${port}`);
})
