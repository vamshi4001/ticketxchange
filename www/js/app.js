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
.factory('DataStore', function() {
    //create datastore with default values
    var DataStore = {
        city:       'Miami',
        latitude:   25.7877,
        longitude:  80.2241 
      };

    DataStore.setCity = function (value) {
       DataStore.city = value;
    };

    DataStore.setLatitude = function (value) {
       DataStore.longitude = value;
    };

    DataStore.setLongitude = function (value) {
       DataStore.longitude = value;
    };

    return DataStore;
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
    .state('app.home', {
      url: "/home/:cityId",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html",
          controller: 'HomeCtrl'
        }
      }
    })
    .state('app.login', {
      url: "/login",
      views: {
        'menuContent' :{
          templateUrl: "templates/login.html",
          controller: 'LoginCtrl'
        }
      }
    })
    .state('app.logout', {
      url: "/logout",
      views: {
        'menuContent' :{
          templateUrl: "templates/logout.html",
          controller: 'LogoutCtrl'
        }
      }
    })
    .state('app.skiplogin', {
      url: "/skiplogin/:cityId",
      views: {
        'menuContent' :{
          templateUrl: "templates/skiplogin.html",
          controller: 'SkipLoginCtrl'
        }
      }
    })
    .state('app.mytickets', {
      url: "/mytickets",
      views: {
        'menuContent' :{
          templateUrl: "templates/mytickets.html",
          controller: 'MyticketsCtrl'
        }
      }
    })
    .state('app.signup', {
      url: "/signup",
      views: {
        'menuContent' :{
          templateUrl: "templates/signup.html",
          controller: 'SignupCtrl'
        }
      }
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
    .state('app.cityChange', {
      url: "/cities/:command",
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
    .state('app.umovies', {
      url: "/umovies/:cityId",
      views: {
        'menuContent' :{
          templateUrl: "templates/umovies.html",
          controller: 'UserMoviesCtrl'
        }
      }
    })
    .state('app.uending', {
      url: "/uending/:cityId",
      views: {
        'menuContent' :{
          templateUrl: "templates/uending.html",
          controller: 'UserEndingCtrl'
        }
      }
    })
    .state('app.dates', {
      url: "/dates/:cityId/:movieId",
      views: {
        'menuContent' :{
          templateUrl: "templates/dates.html",
          controller: 'DatesCtrl'
        }
      }
    })
    .state('app.utheatres', {
      url: "/utheatres/:cityId/:movieId/:date",
      views: {
        'menuContent' :{
          templateUrl: "templates/utheatres.html",
          controller: 'UserTheatresCtrl'
        }
      }
    })
    .state('app.postedticket', {
      url: "/postedtickets/:tmid",
      views: {
        'menuContent' :{
          templateUrl: "templates/viewtickets.html",
          controller: 'PostedTicketsCtrl'
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
      url: "/postticket/:cityId/:tmid",
      views: {
        'menuContent' :{
          templateUrl: "templates/postticket.html",
          controller: 'PostTicketCtrl'
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
    },
    formatDate : function(inpdate){
      var dt = new Date(inpdate);
      var day = dt.getDay();
      var mon = dt.getMonth();
      var date = dt.getDate();
      var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
      var dayNames = ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];      
      return dayNames[day]+" "+date+" "+monthNames[mon];
    },
    formatSmallDate: function(inpdate){
      var dt = new Date(inpdate);
      var day = dt.getDay();
      var mon = dt.getMonth();
      var date = dt.getDate();
      var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
      // var dayNames = ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];      
      return date+" "+monthNames[mon];
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
      cityObj = {};
    }
  }
})
