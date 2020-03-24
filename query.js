const { GraphQLObjectType,
    GraphQLString,
    GraphQLInt
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
            type: movieType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve: function (source, args) {
                return _.find(movies, { id: args.id });
            }
        }
    }
});

exports.Query = Query;