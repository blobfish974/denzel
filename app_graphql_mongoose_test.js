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

// -------------------- GRAPHQL -----------------------


//add librairies
const graphqlHTTP = require('express-graphql');
//const {Query} = require('./query.js');
//const {movieType} = require('./type.js');
const Mongoose = require("mongoose").set('debug', true); //to see requests send by mongoose
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql');

/*
Mongoose.connect(CONNECTION_URL);

Mongoose.connection.once('open', () => {
    console.log('connected to database');
});*/
/*
Mongoose.connect(CONNECTION_URL, function(error){
    if(error) console.log(error);
        console.log("connection state:" + Mongoose.connection.readyState);
        console.log("connection successful");
});*/

Mongoose.connect(CONNECTION_URL,{ useNewUrlParser: true }).catch(
    (error)=> console.log(JSON.stringify(error))
    )


 // Define the Schema
//const schema = new GraphQLSchema({ query: Query });
const movieSchema = new GraphQLSchema({
    link: String,
    id: String,
    metascore: Number,
    poster: String,
    rating: Number,
    synopsis: String,
    title: String,
    votes: Number, 
    year: Number

});


const MovieModel = Mongoose.model("denzel_movies", {
    firstname: String,
    lastname: String
});



// Define Movie Type
movieType = new GraphQLObjectType({
    name: 'Movie',
    fields: {
        link: { type: GraphQLString },
        metascore: { type: GraphQLInt },
        synopsis: { type: GraphQLString },
        title: { type: GraphQLString },
        year: { type: GraphQLInt }

    }
});


//Define the Query
const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        hello: {
            type: GraphQLString,

            resolve: function () {
                return "Hello World";
            }
        },
        movie: {
            type: movieType,
            args: {
                id: { type: GraphQLInt }
                // id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: function (source, args) {
                return _.find(movies, { id: args.id });
            }
        },
        movies: {
            type: GraphQLList(movieType),
            resolve(parent,args){
                return MovieModel.find({}).exec();
            }
        }
    }
});

const schema = new GraphQLSchema({ query: Query });

console.log(Mongoose.connection.readyState);
MovieModel
  .find({
  })
  .then(doc => {
    console.log(doc)
  })
  .catch(err => {
    console.error(err)
  })


//Setup the nodejs GraphQL server
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));


app.listen(PORT);
console.log(`📡 Graphql running on port ${PORT}`);






