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

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
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
.controller('MoviesCtrl', function($scope, $stateParams, $http) {
    $scope.movies = [];
    $scope.error = false;
    $scope.cityId = $stateParams.cityId;
    $http.get($scope.urlPrefix+"getMovies.json?cityid="+$stateParams.cityId)
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