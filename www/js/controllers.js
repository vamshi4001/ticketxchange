angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};
  $scope.urlPrefix = "http://localhost:8888/tickets/index.php/data/";

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('CitiesCtrl', function($scope, $stateParams, $http) {
    $scope.cities = [];
    $scope.error = "";
    $http.get($scope.urlPrefix+"getCities.json")
    .success(function(data){
      if(data.result && data.result.length>0){
        $scope.cities = data.result;
      }
      else{
        $scope.error = "No cities found";
      }
    })
    .error(function(){
      console.log("Error");
    })
})
.controller('MoviesCtrl', function($scope, $stateParams, $http, CityService) {
    $scope.movies = [];
    $scope.error = false;
    $scope.cityId = "";
    $scope.getMovies = function(){
      $http.get($scope.urlPrefix+"getMovies.json?cityid="+$scope.cityId)
      .success(function(data){
        console.log(data);
        if(data.result && data.result.length>0){
          $scope.movies = data.result;
        }
        else{
          $scope.error = true;
        }
      })
      .error(function(){
        console.log("Error");
      })
    }
    if($stateParams.cityId){
      $http.get($scope.urlPrefix+"getCities.json?cityId="+$stateParams.cityId)
      .success(function(data){
        CityService.setCityObj(data.result[0]);
        $scope.cityId = CityService.getCityObj().id;
        $scope.getMovies();
      })
    }    
    else{
      console.log(CityService.getCityObj());
      $scope.cityId = CityService.getCityObj().id;
      $scope.getMovies();
    }    
})
.controller('TheatresCtrl', function($scope, $stateParams, $http) {
    $scope.theatres = [];
    $scope.error = false;
    $scope.cityId = $stateParams.cityId;
    $scope.movieId = $stateParams.movieId;
    $http.get($scope.urlPrefix+"getTheatres.json?movieid="+$stateParams.movieId+"&cityid="+$stateParams.cityId)
    .success(function(data){
      console.log(data);
      if(data.result && data.result.length>0){
        $scope.theatres = data.result;
      }
      else{
        $scope.error = true;
      }
    })
    .error(function(){
      console.log("Error");
    })
})
.controller('ShowtimesCtrl', function ($scope, $stateParams, $http, UtilitiesService) {
    $scope.theatres = [];
    $scope.error = false;
    $scope.cityId = $stateParams.cityId;
    $scope.movieId = $stateParams.movieId;
    $scope.theatreId = $stateParams.theatreId;
    $scope.formatTime = UtilitiesService.formatTime;
    // console.log(UtilitiesService.formatTime("1100"));
    $http.get($scope.urlPrefix+"getShows.json?movieid="+$stateParams.movieId+"&theatreid="+$stateParams.theatreId)
    .success(function(data){
      console.log(data);
      if(data.result && data.result.length>0){
        $scope.shows = data.result;
      }
      else{
        $scope.error = true;
      }
    })
    .error(function(){
      console.log("Error");
    })
})
.controller('PostTicketCtrl', function ($scope, $stateParams, $http, $location, UtilitiesService) {
  $scope.error = false;

  $scope.post = {};

  $scope.movieName = "";
  $scope.imageurl = "";
  $scope.theatreName = "";
  $scope.theatreLocation = "";
  $scope.showTime = "";
  $scope.showId = $stateParams.showId;
  //getMovieDetails
  $http.get($scope.urlPrefix+"getMovies.json?movieId="+$stateParams.movieId)
  .success(function(data){
    $scope.movieName = data.result[0].name;
    $scope.imageurl = data.result[0].imageurl
  })
  .error(function(){
    $scope.error = true;
  })
  //getTheatreDetails
  $http.get($scope.urlPrefix+"getTheatres.json?theatreId="+$stateParams.theatreId)
  .success(function(data){
    $scope.theatreName = data.result[0].name;
    $scope.theatreLocation = data.result[0].location
  })
  .error(function(){
    $scope.error = true;
  })
  //getShowDetails
  $scope.showTime = UtilitiesService.formatTime($stateParams.showTime);

  $scope.postTickets = function(){
      var data = {
        "name": $scope.post.name,
        "phone": $scope.post.phone,
        "tickets": $scope.post.tickets,
        "showId": $scope.showId,
        "user":1,
        "price":270
      };
      console.log(data);
      $http({
                    method: "post",
                    url: $scope.urlPrefix+"/newTicket.json",
                    data: data
            }).
            success(function(edata, status, headers){
              alert("Ticket posted successfully");
              $location.path("app/movies");
            }).
            error(function(){
              console.log("Error");
            })
  }
})