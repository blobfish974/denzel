const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const cors = require('cors');
// const sandbox = require('./server/sandbox');
const imdb = require('./server/imdb');

const express = require('express');
const helmet = require('helmet');
const {PORT} = require('./server/constants');


const CONNECTION_URL = "mongodb+srv://user:user@cluster0-mnlus.mongodb.net/test?retryWrites=true&w=majority";

const DATABASE_NAME = "denzel_database";
const METASCORE = 77;

const app = express();

app.use(cors({origin: 'http://localhost:9292'}));

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
        //collection_awesome = database.collection("denzel_awesome_movies");
        console.log("Connected to databse named `" + DATABASE_NAME + "`!");
    });
});

app.get("/movies/all", (request, response) => { //Request to get all denzel movies
    collection_movie.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
    //response.send({'ack': true});
});


// Populate the database with all the movies from IMDb from actor with a specific id
app.get("/movies/populate/:id", async (request, response) => { //takes approximatively 20 secondes
    try {
	    //const result = await sandbox.start(request.params.id,77) ;
		// const result = await sandbox(start(request.params.id,77));
		actor = await request.params.id;
		console.log(actor);
		const movies = await imdb(actor);
        //const awesome = movies.filter(movie => movie.metascore >= METASCORE);
        
		// console.log(movies);
        collection_movie.deleteMany({}); //first we delete all the elements of the collection
	    collection_movie.insertMany(movies, (error, result) => { 
	        if(error) {
	            return response.status(500).send(error);
	        }
	        // response.send(result.ops);
            response.send({'total movies:':result.ops.length});
	    });
        /*
        collection_awesome.deleteMany({});
        collection_awesome.insertMany(awesome, (error, result) => { 
            if(error) {
                return response.status(500).send(error);
            }
            // response.send(result.ops);
            response.send({'total awesome movies:':result.ops.length});
        });*/
  } catch (error) {
    console.log(error)
  }
});


// Fetch a random must-watch movie
app.get("/movies", (request, response) => {
    collection_movie.find({"metascore" : {$gt:METASCORE}}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        var number_of_movies=result.length;
        var random_value=Math.floor(Math.random() * (number_of_movies));
        response.send(result[random_value]);
        console.log("random value=" + random_value);
    });
});

//Search for Denzel's movies. 
app.get("/movies/search", (request, response) => {
    try {
        let limit= request.query.limit || 5;
        let metascore_= request.query.metascore || 0;
        console.log("limit: " + limit)
        metascore_=parseInt(metascore_,10)
        console.log('metascore: ' + metascore_ + ' type: ' + typeof metascore_);

        var greater_query={$gt:metascore_}
        //var greater_query={$gt:76}

        collection_movie.find({"metascore" : greater_query}).sort( { "metascore": -1 } ).toArray((error, result) => {
            if(error) {
                return response.status(500).send(error);
            }
            response.send(result.slice(1,limit+1));
        });
  } catch (error) {
    console.log(error)
  }
});

//Save a watched date and a review.
app.post("/movies/:id", (request, response) => {
     try {
        let date_= request.query.date || null;
        let review_= request.query.review || null;
        var movie_id=request.params.id.toString();
        var data= {movie_id,date_,review_};
        console.log(data);
        /*
        collection_review.insertOne(data, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }*/
        //var myquery = { "_id": new ObjectId(movie_id) };
        var myquery = { "id": movie_id };
        var newvalues1 = { $set: {date: date_, review: review_ },  $setOnInsert: {date: date_, review: review_ }};
        var newvalues = { $set: {date: date_, review: review_ }};
        //collection_movie.update(myquery, data, { upsert: true } ,(error, result) => {
        collection_movie.update(myquery, newvalues, { upsert: true } ,(error, result) => {
        if(error) {
            return response.status(500).send(error);
        }

        response.send(data);
    });
  } catch (error) {
    console.log(error)
  }
    
});



//Fetch a specific movie
app.get("/movies/:id", (request, response) => {
	var movie_id=request.params.id.toString();
    //var myquery = { "_id": new ObjectId(movie_id) };
    var myquery = { "id": movie_id };
    // collection_movie.findOne({ "_id": new ObjectId(obj_id) }, (error, result) => {
    collection_movie.findOne(myquery, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});






