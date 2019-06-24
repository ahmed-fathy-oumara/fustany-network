//Getting Express server up & running
const express = require('express');
//Importing database
const connectDB = require('./config/db');

//Initialize our app variable with express
const app = express();

//Connect Database
connectDB();

//Initialize Middleware
app.use(express.json({ extended: false }));

//Create a single endpoint to take a get request and send data to the browser
app.get('/', (req, res) => res.send('API Running'));

//Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


//Look for an enviroment variable called Port to use when we deploy to heroku and locally run it on port 5000
const PORT = process.env.port || 5000;

//Listen to port 
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));