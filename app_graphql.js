const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const cors = require('cors');
// const sandbox = require('./server/sandbox');


const express = require('express');
const helmet = require('helmet');
const {PORT} = require('./server/constants');


const CONNECTION_URL = "mongodb+srv://user:user@cluster0-mnlus.mongodb.net/test?retryWrites=true&w=majority";

const DATABASE_NAME = "denzel_database";


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
const {Query} = require('./graphql_files/query.js');
const {movieType} = require('./graphql_files/type.js');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    buildSchema
} = require('graphql');



 // Define the Schema
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


const schema = new GraphQLSchema({ query: Query });



app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));



app.listen(PORT, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection_movie = database.collection("denzel_movies");
        //collection_awesome = database.collection("denzel_awesome_movies");
        console.log("Connected to databse named `" + DATABASE_NAME + "`!");
        console.log(`📡 Graphql running on port ${PORT}`);
    });
});




