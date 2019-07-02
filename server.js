//Getting Express server up & running
const express = require('express');
//Importing database
const connectDB = require('./config/db');
//Getting Path NodeJS module
const path = require('path');

//Initialize our app variable with express
const app = express();

//Connect Database
connectDB();

//Initialize Middleware
app.use(express.json({ extended: false }));

//Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


//Look for an enviroment variable called Port to use when we deploy to heroku and locally run it on port 5000
const PORT = process.env.PORT || 5000;

//Listen to port 
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));