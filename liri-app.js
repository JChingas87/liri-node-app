var keys = require('./keys.js');
var inquirer = require('inquirer');
var spotify = require('node-spotify-api');
var request = require('request');
var twitter = require('twitter');
var omdb = require("./omdb.js");
var fs = require("fs");

var client = new twitter(keys);


if (process.argv[2].toLowerCase() === 'spotify-this-song') {
    var spotify = new Spotify({
        id: 'aded1294eefd467db8850910508297ff',
        secret: '048bc4429c804f009ce2598440e4e337'
    });

    inquirer.prompt({
        type: 'input',
        message: 'What song would you like to search?',
        name: 'song'

    }).then(function(inquirerResponse) {

        var song = inquirerResponse.song;

        var search = {
            type: 'track',
            query: song
        };
        spotify
            .search(search)
            .then(function(response) {
                console.log('---------------------------------------------------------------');
                for (var i = 0; i < response.tracks.items[0].artists.length; i++) {
                    console.log('Artist: ' + response.tracks.items[0].artists[i].name);
                }
                console.log('Song: ' + response.tracks.items[0].name);
                console.log('Preview: ' + response.tracks.items[0].external_urls.spotify);
                console.log('Album: ' + response.tracks.items[0].album.name);
            })
            .catch(function(err) {
                console.log(err);
            });
    });

} else
if (process.argv[2].toLowerCase() === "my-tweets") {

    inquirer.prompt([{
        type: 'input',
        message: 'What is your twitter username?',
        name: 'username'
    }]).then(function(inquirerResponse) {

        var params = {
            screen_name: inquirerResponse.username,
            count: 20
        };

        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                console.log('The last 20 tweets from JChingas87....');
                console.log('---------------------------------------------------------------');
                for (var i = 0; i < tweets.length; i++) {
                    console.log(tweets[i].created_at);
                    console.log(tweets[i].text);
                    console.log('---------------------------------------------------------------');
                }
            }
        });
    });
} else(process.argv[2].toLowerCase() === "movie-this") {

    inquirer.prompt([{
        type: "input",
        message: "What movie would you like to see?",
        name: "userChoice",
    }]).then(function(response) {
        omdb.get_movie(response.userChoice);
    });

    function getMovie(user_movie) {
        var omdb_api = "http: //www.omdbapi.com/?i=tt3896198&apikey=fe03367a=" + user_movie;
        request(omdb_api, function(error, response, body) {
            if (error) {
                return console.log(error);
            } else {
                console.log("------------------------")
                var movie = JSON.parse(body);
                var actors = movie.Actors;
                console.log(movie.Title);
                console.log(movie.Released);
                console.log(movie.Ratings[0].Value);
                console.log(movie.Ratings[1].Value)
                console.log(movie.Country);
                console.log(movie.Language)
                console.log("Plot: " + movie.Plot);
                console.log("Actors: " + actors);
                console.log("------------------------")


            }

        });
    }

}
getMovie();