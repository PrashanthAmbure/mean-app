var express = require('express');
var mongodb = require("mongodb");
//var mongojs = require('mongojs');
//var db = mongojs('personsList', ['personsList']);
var bodyParser = require('body-parser');

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/personsList';
var CONTACTS_COLLECTION = "personsList";
// Connect to the database before starting the application server.
mongodb.MongoClient.connect(mongoUri, function (err, database) {
	if (err) {
		console.log(err);
		process.exit(1);
	}

	// Save database object from the callback for reuse.
	db = database;
	console.log("Database connection ready");

	// Initialize the app.
	app.listen(app.get('port'));
	console.log('Server started on port:'+app.get('port'));
});

// Fetch all persons.
app.get('/personsList', function(req, res) {
	db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
		res.json(docs);
	});
});

// Add a person.
app.post('/addPerson', function(req, res) {
	db.collection(CONTACTS_COLLECTION).insert(req.body, function(err, doc) {
		res.json(doc);
	});
});

// Delete a person.
app.delete('/deletePerson/:id', function(req, res) {
	var id = req.params.id;
	db.collection(CONTACTS_COLLECTION).remove({_id: mongodb.ObjectId(id)}, function(err, doc) {
		res.json(doc);
	});
});

// Edit a person.
app.get('/editPerson/:id', function(req, res) {
	var id = req.params.id;
	db.collection(CONTACTS_COLLECTION).findOne({_id: mongodb.ObjectId(id)}, function(err, doc) {
		res.json(doc);
	});
});

// Update a person.
app.put('/updatePerson/:id', function(req, res) {
	var id = req.params.id;
	db.collection(CONTACTS_COLLECTION).findAndModify({
		_id: mongodb.ObjectId(id)
	},[
	],{
		$set: {
				name: req.body.name,
				email: req.body.email,
				phone: req.body.phone,
				country: req.body.country
			}
		},{
			new: true
		}, function(err, doc){
			if(err){
				console.log(err);
			}else{
				res.json(doc);
			}
		});
});