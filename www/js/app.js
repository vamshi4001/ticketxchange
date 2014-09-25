// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers'])

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
    .state('app.cities', {
      url: "/cities",
      views: {
        'menuContent' :{
          templateUrl: "templates/cities.html",
          controller: 'CitiesCtrl'
        }
      }
    })
    .state('app.movielist', {
      url: "/movies",
      views: {
        'menuContent' :{
          templateUrl: "templates/movies.html",
          controller: 'MoviesCtrl'
        }
      }
    })
    .state('app.movies', {
      url: "/movies/:cityId",
      views: {
        'menuContent' :{
          templateUrl: "templates/movies.html",
          controller: 'MoviesCtrl'
        }
      }
    })
    .state('app.theatres', {
      url: "/theatres/:cityId/:movieId",
      views: {
        'menuContent' :{
          templateUrl: "templates/theatres.html",
          controller: 'TheatresCtrl'
        }
      }
    })
    .state('app.showtimes', {
      url: "/showtimes/:cityId/:movieId/:theatreId",
      views: {
        'menuContent' :{
          templateUrl: "templates/showtimes.html",
          controller: 'ShowtimesCtrl'
        }
      }
    })
    .state('app.postticket', {
      url: "/postticket/:cityId/:movieId/:theatreId/:showId/:showTime",
      views: {
        'menuContent' :{
          templateUrl: "templates/postticket.html",
          controller: 'PostTicketCtrl'
        }
      }
    })









    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html"
        }
      }
    })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/playlists/:playlistId",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlist.html",
          controller: 'PlaylistCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/cities');
});

app.service('UtilitiesService', function(){
  return{
    formatTime : function(time){
      return time.substring(0, 2) + ":" + time.substring(2);
    }
  }
});

app.service("UserService", function(){
  var userObj = {};
  return {
    setUserObj : function(obj){
      userObj = obj;
    },
    getUserObj : function(){
      return userObj;
    },
    removeUserObj : function(){
      userObj = {};
    }
  }
});

app.service("CityService", function(){
  var cityObj = {};
  return {
    setCityObj : function(obj){
      cityObj = obj;
    },
    getCityObj : function(){
      return cityObj;
    },
    removeCityObj : function(){
      cityObj = null;
    }
  }
})
