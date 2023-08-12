// const connectToMongo=require('./db');
// connectToMongo();
// // const cors=require('cors');
// // const express=require('express')
// // const app=express();
// // const port=4000

// // app.use(cors());
// // app.use(express.json())

// // app.listen(port,()=>[
// //     console.log(`Example at ${port}`)
// // ])
// const express = require('express')
// const app = express()
// const port = 3000

// // Available Routes
// app.use('/api/auth', require('./routes/auth')) // require is used for linking auth file to this
// // app.use('/api/notes', require('./routes/notes'))

// app.get('/', (req, res) => {
//   res.send('Hello World! for Aditya Verma')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

const connectToMongo = require('./db');
require("dotenv").config();
connectToMongo();

const cors = require('cors');
const express = require('express'); // INSTALL EXPRESS
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// app.use(express.json()); // To parse JSON bodies
// app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// Available Routes
app.use('/api/auth', require('./routes/auth')); // require is used for linking the auth file to this
app.use('/api/notes', require('./routes/notes'));

app.get('/', (req, res) => {
  res.send('Hello World! for Aditya Verma');
});

app.listen(port, () => {
  console.log(`MyNotes App listening on port ${port}`);
});
