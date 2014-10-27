angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};
  $scope.urlPrefix = "http://localhost:8888/ticketsws/index.php/data/";

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

.controller('CitiesCtrl', function($scope, $location, $stateParams, $http, CityService) {
    $scope.cities = [];
    $scope.error = "";
    if(CityService.getCityObj().id){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    else{
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
    }    
})
.controller('UserEndingCtrl', function($scope, $stateParams, $http, CityService) {

})
.controller('UserMoviesCtrl', function($scope, $stateParams, $http, CityService) {
    $scope.movies = [];
    $scope.error = false;
    $scope.cityId = "";
    $scope.getMovies = function(){
      $http.get($scope.urlPrefix+"getMovies.json?cityid="+$scope.cityId)
      .success(function(data){
        // console.log(data);
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
      //console.log(CityService.getCityObj());
      $scope.cityId = CityService.getCityObj().id;
      $scope.getMovies();
    }
})
.controller('MoviesCtrl', function($scope, $stateParams, $http, CityService) {
    $scope.movies = [];
    $scope.error = false;
    $scope.cityId = "";
    $scope.getMovies = function(){
      $http.get($scope.urlPrefix+"getMovies.json?cityid="+$scope.cityId)
      .success(function(data){
        // console.log(data);
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
      // console.log(CityService.getCityObj());
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
      // console.log(data);
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
.controller('HomeCtrl', function($scope, $stateParams, $http, UtilitiesService) {
  $scope.cityid = $stateParams.cityId;
})
.controller('PostedTicketsCtrl', function($scope, $stateParams, $http, UtilitiesService) {
  $scope.tmid = $stateParams.tmid;
  $http.get($scope.urlPrefix+"getPostedTickets.json?tmid="+$scope.tmid)
    .success(function(data){
      // console.log(data);
      if(data.result && data.result.length>0){
        $scope.list = data.result;
      }
      else{
        $scope.error = true;
      }
    })
    .error(function(){
      console.log("Error");
    })
})
.controller('UserTheatresCtrl', function($scope, $location,   $stateParams, $http, UtilitiesService) {
    $scope.theatres = [];
    $scope.error = false;
    $scope.cityId = $stateParams.cityId;
    $scope.movieId = $stateParams.movieId;
    $scope.formatTime = UtilitiesService.formatTime;
    $scope.getTickets = function(tmid){
      $location.path("/app/postedtickets/"+tmid);
    }
    $http.get($scope.urlPrefix+"getTickets.json?cityid="+$scope.cityId+"&movieid="+$scope.movieId+"&date="+$stateParams.date)
    .success(function(data){
      var groups = [];
      for (var i = 0; i < data.result.length; i++) {
        var theatreid = data.result[i]['theatreid'];
        if(groups[theatreid]){
          groups[theatreid].push({            
            "tickets": data.result[i].tickets_available,
            "tmid": data.result[i].theatre_movie_id,
            "showtime":data.result[i].show_time
          })
        }
        else{
          groups[theatreid] = [{
            "tickets": data.result[i].tickets_available,
            "tmid": data.result[i].theatre_movie_id,
            "showtime":data.result[i].show_time
          }];          
        }        
      };
      
      for (var i = 0; i < data.result.length; i++) {
        data.result[i]["shows"] = groups[data.result[i].theatreid];
        var totalTickets = 0;
        for (var j = 0; j < data.result[i]["shows"].length; j++) {
          totalTickets += parseInt(data.result[i]["shows"][j].tickets)
        };
        data.result[i].totalTickets = totalTickets;
      }
      var arr = {};

      for ( var i=0; i < data.result.length; i++ )
          arr[data.result[i]['theatreid']] = data.result[i];
      data.result = new Array();
      for ( var key in arr )
          data.result.push(arr[key]);
      // console.log(data);
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
.controller('DatesCtrl', function($scope, $stateParams, $http, UtilitiesService) {
    $scope.theatres = [];
    $scope.error = false;
    $scope.cityId = $stateParams.cityId;
    $scope.movieId = $stateParams.movieId;
    $scope.formatDate = UtilitiesService.formatDate;
    $http.get($scope.urlPrefix+"getDates.json?movieid="+$stateParams.movieId+"&cityid="+$stateParams.cityId)
    .success(function(data){
      // console.log(data);
      if(data.result && data.result.length>0){
        $scope.dates = data.result;
      }
      else{
        $scope.error = true;
      }
    })
    .error(function(){
      console.log("Error");
    })
})
.controller('ShowtimesCtrl', function ($scope, $stateParams, $location, $http, UtilitiesService) {
    $scope.theatres = [];
    $scope.error = false;
    $scope.cityId = $stateParams.cityId;
    $scope.movieId = $stateParams.movieId;
    $scope.theatreId = $stateParams.theatreId;
    $scope.formatTime = UtilitiesService.formatTime;
    $scope.formatDate = UtilitiesService.formatDate;
    // console.log(UtilitiesService.formatTime("1100"));
    $scope.addTickets = function(tmid, showtime){      
      $location.path("/app/postticket/"+$scope.cityId+"/"+tmid);
    }
    $http.get($scope.urlPrefix+"getShows.json?movieid="+$stateParams.movieId+"&theatreid="+$stateParams.theatreId)
    .success(function(data){
      var groups = [];
      for (var i = 0; i < data.result.length; i++) {
        var date = data.result[i]['date'];
        if(groups[date]){
          groups[date].push({            
            "tmid": data.result[i].id,
            "showtime":data.result[i].showtimes
          })
        }
        else{
          groups[date] = [{
            "tmid": data.result[i].id,
            "showtime":data.result[i].showtimes
          }];          
        }        
      };
      
      for (var i = 0; i < data.result.length; i++) {
        data.result[i]["shows"] = groups[data.result[i].date];        
        data.result[i]["totalshows"] = groups[data.result[i].date].length;        
      }
      
      var arr = {};

      for ( var i=0; i < data.result.length; i++ )
          arr[data.result[i]['date']] = data.result[i];
      data.result = new Array();
      for ( var key in arr )
          data.result.push(arr[key]);


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
  // console.log($stateParams);
  $scope.post = {};

  $scope.movieName = "";
  $scope.imageurl = "";
  $scope.theatreName = "";
  $scope.theatreLocation = "";
  $scope.showTime = "";
  $scope.showId = $stateParams.tmid;
  $scope.cityId = $stateParams.cityId;
  $scope.post.needOnlinePayment = false;
  $scope.formatDate = UtilitiesService.formatDate;
  //get User details
  var userObj = {
                  id: "2",
                  emailid: "avinash.palleti@gmail.com",
                  fullname: "Avinash Reddy",
                  contactnumber: "9242610583",
                  cityid: null
                };
  $scope.post.name = userObj.fullname;
  $scope.post.phone = userObj.contactnumber;
  //get movieid theatreid showid and date
  $http.get($scope.urlPrefix+"getInfoTMID.json?tmid="+$scope.showId)
  .success(function(data){
    var movieId = data.result[0].movieid;
    var theatreId = data.result[0].theatreid;
    $scope.date = data.result[0].date;
    var showTime = data.result[0].showtimes;
      

      //getMovieDetails
      $http.get($scope.urlPrefix+"getMovies.json?movieId="+movieId)
      .success(function(data){
        $scope.movieName = data.result[0].name;
        $scope.imageurl = data.result[0].imageurl
      })
      .error(function(){
        $scope.error = true;
      })
      

      //getTheatreDetails
      $http.get($scope.urlPrefix+"getTheatres.json?theatreId="+theatreId)
      .success(function(data){
        $scope.theatreName = data.result[0].name;
        $scope.theatreLocation = data.result[0].location
      })
      .error(function(){
        $scope.error = true;
      })
      
      //getShowDetails
      $scope.showTime = UtilitiesService.formatTime(showTime);    
  })
  
  $scope.postTickets = function(){
      var data = {
        "name": $scope.post.name,
        "phone": $scope.post.phone,
        "quantity": $scope.post.tickets,
        "showId": $scope.showId,
        "needOnlinePayment": $scope.post.needOnlinePayment,
        "user":userObj.id,
        "price":$scope.post.cost,
        "date": $scope.date,
        "cityid": $scope.cityId
      };
      console.log(data);
      $http({
                    method: "post",
                    url: $scope.urlPrefix+"/newTicket.json",
                    data: data
            }).
            success(function(edata, status, headers){
              alert("Ticket posted successfully");
              $location.path("app/home/"+$scope.cityId);
            }).
            error(function(){
              console.log("Error");
            })
  }
})