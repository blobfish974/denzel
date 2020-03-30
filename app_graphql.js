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
const {GraphQLSchema} = require('graphql');
const {Query} = require('./query.js');
const Mongoose = require("mongoose");


 // Define the Schema
const schema = new GraphQLSchema({ query: Query });

//Setup the nodejs GraphQL server
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));


app.listen(port);
console.log(`📡 Graphql running on port ${PORT}`);






