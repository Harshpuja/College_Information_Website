const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3333;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_database', {
  useNewUrlParser: true, // Use the new URL parser
  useUnifiedTopology: true // Use the new server discovery and monitoring engine
})
.then(() => {
  console.log('MongoDB Connected');
  // Start your server or perform other operations here
  // Define your routes and middleware here
  // Start the server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});


// Create a Schema for the Data
const ItemSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    dob: Date,
    course: String,
    password: String // Changed to String from Number
});

// Create a Model
const Item = mongoose.model('Item', ItemSchema);

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle POST request for form submission
app.post('/items', (req, res) => {
    const newItem = new Item({
        name: req.body.yourname,
        email: req.body.emailaddress,
        phone: req.body.phone,
        dob: req.body.dob,
        course: req.body.course,
        password: req.body.password
    });

    newItem.save()
        .then(() => res.redirect('index.html')) // Redirect to index page upon successful submission
        .catch(err => {
            console.error('Error saving data to MongoDB:', err);
            res.status(500).send("Internal Server Error");
        });
});
