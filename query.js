const { GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql');
const {movieType} = require('./type.js');


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
        movies: {
            type: new GraphQLList(movieType),
            //type: [movieType],
            resolve: function (source, args){
                //return collection_movie.find({});
                //return [collection_movie.find({})];
                return collection_movie.find({}).toArray();
            }
        }
    }
});

exports.Query = Query;