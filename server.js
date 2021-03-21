//server.js
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

console.log('May Node be with you');

MongoClient.connect(
  'mongodb+srv://yoda:TheForce231@cluster0.uyfth.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useUnifiedTopology: true },
  (err, client) => {
    if (err) return console.log(err);
    console.log('Connected To Database');

    const db = client.db('star-wars-quotes');
    const quotesCollection = db.collection('quotes');

    app.get('/', (req, res) => {
      db.collection('quotes')
        .find()
        .toArray()
        .then((results) => {
          res.render('index.ejs', { quotes: results });
        })
        .catch();
    });

    app.post('/quotes', (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect('/');
        })
        .catch((error) => console.log(error));
      console.log(req.body);
    });

    app.put('/quotes', (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: 'yoda' },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => res.json('Success'))
        .catch((error) => console.error(error));
    });

    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json('Deleted Darth Vadar\'s quote')
        })
        .catch(error => console.error(error))
    })

  }
);

app.listen(3000, function () {
  console.log('Listening in on 3000');
});
