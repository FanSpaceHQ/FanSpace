const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/.env` })

// Express Setup
const express = require('express');
const cors = require('cors');
const app = express();

// Parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:4000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}



app.use(cors(corsOptions));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
})

const multer =require('multer')
const upload = multer()
app.use(upload.array()); 
app.use(express.static('public'));

const userRoutes = require ('./routes/userRoutes')
app.use('/api/users', userRoutes)

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));


app.listen(process.env.REACT_APP_SERVER_PORT, () => {
    console.log('App listening on port ' + process.env.REACT_APP_SERVER_PORT);
  })