const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Set up routes
app.get('/', (req, res) => {
    res.render('index');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

MongoClient.connect(url, (err, client) => {
    if (err) {
        console.error('Failed to connect to MongoDB:', err);
        return;
    }

    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    // Additional code for interacting with the database can be added here

    // Close the MongoDB connection when the server is closed
    process.on('SIGINT', () => {
        client.close(() => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

// Create a new flashcard
app.post('/', (req, res) => {
    const { question, answer } = req.body;

    // Insert the flashcard into the database
    const collection = db.collection('flashcards');
    collection.insertOne({ question, answer }, (err, result) => {
        if (err) {
            console.error('Failed to creare flashcard:', err);
            res.sendStatus(500);
            return
        }

        console.log('Flashcard created:', result.ops[0]);
        res.redirect('/');
    });
});

// Retrieve all flashcards
app.get('/flashcards', (req, res) => {
    const collection = db.collection('flashcards');
    collection.find({}).toArray((err, flashcards) => {
      if (err) {
        console.error('Failed to retrieve flashcards:', err);
        res.sendStatus(500);
        return;
      }
  
      res.render('flashcards', { flashcards: flashcards }); // Pass flashcards as an object
    });
  });