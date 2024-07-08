const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const loginRoute=require('./routes/auth');
const projectRoute=require('./routes/project')

// Connect to the database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
  // Use CORS middleware
  app.use(cors(corsOptions));


app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Your client domain
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});


// Define Routes
app.use('/api/auth', loginRoute); //// http://localhost:5000/api/auth
app.use('/api/project', projectRoute);  //// http://localhost:5000/api/project



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));















