const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const cors = require('cors');
const sandbox = require('./server/sandbox.js');

const express = require('express');
const helmet = require('helmet');
const {PORT} = require('./server/constants');

const CONNECTION_URL = "mongodb+srv://user:user@cluster0-mnlus.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "denzel_database";

const app = express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());
app.options('*', cors());

var database, collection;

app.listen(PORT, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection_movie = database.collection("denzel_movies");
        collection_awesome = database.collection("denzel_awesome_movies");
        console.log("Connected to databse named `" + DATABASE_NAME + "`!");
    });
});

app.get("/test", (request, response) => { //Request to get all denzel movies
    collection_movie.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
    //response.send({'ack': true});
});

//request.params.actor
//response.send({'total':data.length})

app.get("/movies/populate/:id", (request, response) => {
    collection_movie.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send({'total':result.length});
    });
});

app.get("/movies/populateTRUE/:id", (request, response) => {
	
	const result =  sandbox(request.params.id,77);
    collection.insert(request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

app.get("/movies", (request, response) => {
    collection_awesome.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get("/movies/:id", (request, response) => {
	console.log(request.params.id)
    collection_movie.findOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});







console.log(`📡 Running on port ${PORT}`);






