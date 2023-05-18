// Create a new flashcard
app.post('/', (req, res) => {
    const { question, answer } = req.body;
  
    // Insert the flashcard into the database
    const collection = db.collection('flashcards');
    collection.insertOne({ question, answer }, (err, result) => {
      if (err) {
        console.error('Failed to create flashcard:', err);
        res.sendStatus(500);
        return;
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
  
      res.render('flashcards', { flashcards });
    });
  });
  