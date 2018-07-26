var express = require('express');
var bodyParser = require('body-parser');
var Library = require('../Models/Library');

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

// Create a new book in the library
router.post('/', function (req, res) {
  Library.create({
    cover : req.body.cover,
    title : req.body.title,
    author : req.body.author,
    numberOfPages : req.body.numberOfPages,
    publishDate : req.body.publishDate,
    rating: req.body.rating
  },
  function (err, book) {
    if (err) return res.status(500).send("There was a problem adding the information to the database.");
    res.status(200).send(book);
  });
});

// Returns all books in the Library
router.get('/', function (req, res) {
 console.log('Getting...');
 Library.find({}, function (err, books) {
   if (err) return res.status(500).send("There was a problem finding books in library.");
   res.status(200).send(books);
   console.log("Got all books")
 });
});

// Returns ONE book from the Library
router.get('/:id', function (req, res) {
 console.log('Getting book...');
 Library.findById(req.params.id, function (err, book) {
   if (err) return res.status(500).send("There was a problem finding books in library.");
   res.status(200).send(book);
   console.log("Got 1 book")
 });
});

//Edits a book in the Library
router.put('/:id', function (req, res) {
 console.log('Editing...');
 Library.findByIdAndUpdate(req.params.id, req.body, {new:true},
   function(err, books){
     if (err) return res.status(500).send("There was a problem editing the book.");
     res.status(200).send(books.title + " was edited.");
   }
 );
});

//Deletes a book in the Library
router.delete('/:id', function (req, res) {
 console.log('deleting...');
 Library.findByIdAndRemove(req.params.id, function (err, book) {
   console.log(req.params.id);
   if (err) return res.status(500).send("There was a problem deleting the book.");
   res.status(200).send(book.title + " was deleted.");
 });
});

module.exports = router;
