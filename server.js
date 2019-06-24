
//Getting Express server up & running
const express = require('express');

//Initialize our app variable with express
const app = express();

//Create a single endpoint to take a get request and send data to the browser
app.get('/', (req, res) => res.send('API Running'));

//Look for an enviroment variable called Port to use when we deploy to heroku and locally run it on port 5000
const PORT = process.env.port || 5000;

//Listen to port 
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));