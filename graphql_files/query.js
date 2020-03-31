const { GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql');
const {movieType} = require('./type.js');

const METASCORE = 77;

const imdb = require('../server/imdb');

//Define the Query
const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        // test endpoint
        hello: {
            type: GraphQLString,

            resolve: function () {
                return "Hello World";
            }
        },
        //return all movies
        all_movies: { 
            type: GraphQLList(movieType),
            //type: [movieType],
            resolve: function (source, args){
                //return collection_movie.find({});
                //return [collection_movie.find({})];
                return collection_movie.find({}).toArray();
            }
        },
        // Fetch a random must-watch movie
        movies: { 
            type: GraphQLList(movieType),
            resolve: function (source, args){

                //return all must watch movies:
                //var result= collection_movie.find({"metascore" : {$gt:METASCORE}}).toArray();

                //1rst method -> not wwroking properly
                /*
                var query = {"metascore" : {$gt:METASCORE}};
                var number_of_movies = collection_movie.count(query);
                console.log(number_of_movies);
                var random_value = Math.floor(Math.random() * number_of_movies);
                console.log(random_value);
                var result = collection_movie.find(query).limit(1).skip(random_value).toArray();
                */

                result= collection_movie.aggregate([{ $match:{"metascore" : {$gt:METASCORE}}},{ $sample: { size: 1 } }]).toArray();
                return result;
                
            }
        },
        //Search for Denzel's movies. 
        movies_search: { 
            type: GraphQLList(movieType),
            args:{
                limit: {type: GraphQLInt},
                metascore: {type:GraphQLInt}
            },
            resolve: function (source, args){

                //define inputs
                let limit= args.limit || 5;
                let metascore_= args.metascore || 0;
                console.log("limit: " + limit)
                metascore_=parseInt(metascore_,10)
                console.log('metascore: ' + metascore_ + ' type: ' + typeof metascore_);

                //query
                var greater_query={$gt:metascore_};
                result=collection_movie.find({"metascore" : greater_query}).limit(limit).sort( { "metascore": -1 } ).toArray();
                return result;
                
            }
        },
        //Fetch a specific movie
        movies_search_id: { 
            type: GraphQLList(movieType),
            args:{
                id: {type: GraphQLString}
            },
            resolve: function (source, args){

                //query
                var query={ "id": args.id };
                result=collection_movie.find(query).toArray();
                return result;
                
            }
        },
        // Populate the database with all the movies from IMDb from actor with a specific id
        movies_populate_id: { 
            type: GraphQLString,
            args:{
                id: {type: GraphQLString}
            },
            resolve: async function (source, args){

                //we load the movies
                const movies = await imdb(args.id);

                //first we delete all the elements of the collection
                collection_movie.deleteMany({}); 

                //then we populate the collection
                collection_movie.insertMany(movies);

                //return number of results
                var result='total movies:' + movies.length
                console.log('total movies:'+ movies.length);
                return result;
                
            }
        },
        //Save a watched date and a review
        movies_review_id: { 
            type: GraphQLString,
            args:{
                date: {type: GraphQLString},
                review: {type: GraphQLString},
                movie_id: {type: GraphQLString}
            },
            resolve: async function (source, args){

                //define inputs
                let date_= args.date || null;
                let review_= args.review || null;
                var movie_id=args.movie_id;
                var data= "{ id:"+ movie_id + ", date:"+ date_ +", review:" +review_+"}";
                console.log(data);

                //query
                var myquery = { "id": movie_id };
                var newvalues = { $set: {date: date_, review: review_ }};
                collection_movie.update(myquery, newvalues, { upsert: true });
                return data;
                
            }
        }
    }


    
});







exports.Query = Query;