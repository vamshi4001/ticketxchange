angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};
  // $scope.urlPrefix = "http://home.venublog.com/ticketsws/index.php/data/";
  $scope.urlPrefix = "http://localhost/ticketsws/index.php/data/";
})
.controller('LoginCtrl', function ($scope, $location, $state, $stateParams, $http, CityService, UserService) {
  $scope.user = {};
  if(UserService.getUserObj().id){
    if(CityService.getCityObj().id){
      $location.path("/app/movies/"+CityService.getCityObj().id);
    }
  }
  $scope.goHome = function(){
    if(CityService.getCityObj().id){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    else{
      $location.path("/app/home");
    }
  }  
  $scope.login = function(){        
    $http.get($scope.urlPrefix+"/userLogin.json?uname="+$scope.user.uname+"&password="+$scope.user.password).
    success(function(data){
      if(data.isSuccess){
        if(data.result.length==1){
          UserService.setUserObj(data.result[0]);
          if(CityService.getCityObj().id){
            $location.path("/app/home/"+CityService.getCityObj().id)
          }
          else{
            $location.path("/app/cities"); 
          }
        }
        else{
          alert("Login failed! Try again")
        }                      
      }
      else{
        alert("Login failed! Try again")
      }      
    }).
    error(function(){
      console.log("Error");
    })
  }
})
.controller('SignupCtrl', function ($scope, $location, $state, $stateParams, $http, CityService) {
  $scope.user = {};
  $scope.goHome = function(){
    if(CityService.getCityObj().id){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    else{
      $location.path("/app/home");
    }
  }  
  $scope.signup = function(){
    var data = {
      name: $scope.user.name,
      password: $scope.user.password,
      email: $scope.user.email,
      phone: $scope.user.phone
    }      
    $http({
        method: "post",
        url: $scope.urlPrefix+"/newUser.json",
        data: data
    }).
    success(function(edata, status, headers){
      alert("Signed up successfully");
      if(CityService.getCityObj().id){
        $location.path("/app/home/"+CityService.getCityObj().id)
      }
      else{
        $location.path("/app/cities"); 
      }
    }).
    error(function(){
      console.log("Error");
    })
  }
})
.controller('CitiesCtrl', function ($scope, $location, $state, $stateParams, $http, CityService) {
    $scope.cities = [];
    $scope.error = ""; 
    $scope.goHome = function(){
      if(CityService.getCityObj().id){
        $location.path("/app/home/"+CityService.getCityObj().id);
      }
      else{
        $location.path("/app/home");
      }
    }
    $scope.getCities = function(){
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

    $scope.selectCity = function(id){
      $http.get($scope.urlPrefix+"getCities.json?cityId="+id)
      .success(function(data){
        CityService.setCityObj(data.result[0]);
        $location.path("/app/home/"+CityService.getCityObj().id);
      })
    }
    if($stateParams.command=="change"){
      $scope.getCities();
    }
    else{
      if(CityService.getCityObj().id){
        $location.path("/app/home/"+CityService.getCityObj().id);      
      }
      else{
        $scope.getCities(); 
      }
    }

})
.controller('UserEndingCtrl', function ($scope, $stateParams, $location, $state, $http, CityService) {
  $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    
})
.controller('UserMoviesCtrl', function ($scope, $stateParams, $location, $state, $http, CityService) {
    $scope.movies = [];
    $scope.error = false;
    $scope.cityId = "";
    $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
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
.controller('MoviesCtrl', function ($scope, $stateParams, $http, CityService, $location) {
    $scope.movies = [];
    $scope.error = false;
    $scope.cityId = "";
    $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
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
.controller('TheatresCtrl', function ($scope, $stateParams, $http, $location, CityService) {
    $scope.theatres = [];
    $scope.error = false;
    $scope.cityId = $stateParams.cityId;
    $scope.movieId = $stateParams.movieId;
    $http.get($scope.urlPrefix+"getTheatres.json?movieid="+$stateParams.movieId+"&cityid="+$stateParams.cityId)
    .success(function(data){
      // console.log(data);
      if(data.result && data.result.length>0){
        $scope.theatres = data.result;
        $scope.movie = data.movie[0];
      }
      else{
        $scope.error = true;
      }
    })
    .error(function(){
      console.log("Error");
    })

    $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    
})
.controller('HomeCtrl', function ($scope, $stateParams, $location, $state, $http, UtilitiesService, CityService, UserService) {
  $scope.loggedinUser = "Guest";
  $scope.isLogedin = false;
  if(UserService.getUserObj().id){
    $scope.isLogedin = true;
    $scope.loggedinUser = UserService.getUserObj().fullname;
  }
  if($stateParams.cityId && $stateParams.cityId!="undefined"){
    $scope.cityid = $stateParams.cityId;
    $scope.selectedCity = "";
    console.log(CityService.getCityObj());
    $scope.selectedCity = CityService.getCityObj().city;    
  }
  else{
    $location.path("/app/cities");
  }
    
})
.controller('PostedTicketsCtrl', function ($scope, $stateParams, $location, $state, $http, UtilitiesService, CityService) {
  $scope.tmid = $stateParams.tmid;
  $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
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
.controller('MyticketsCtrl', function ($scope, $location, $state, $stateParams, $http, UtilitiesService, CityService) {
  console.log("I came here");
})
.controller('UserTheatresCtrl', function ($scope, $location, $state, $stateParams, $http, UtilitiesService, CityService) {
    $scope.theatres = [];
    $scope.error = false;
    $scope.movie = {}
    $scope.cityId = $stateParams.cityId;
    $scope.movieId = $stateParams.movieId;
    $scope.formatTime = UtilitiesService.formatTime;
    $scope.getTickets = function(tmid){
      $location.path("/app/postedtickets/"+tmid);
    }
    $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    $http.get($scope.urlPrefix+"getTickets.json?cityid="+$scope.cityId+"&movieid="+$scope.movieId+"&date="+$stateParams.date)
    .success(function(data){
      var groups = [];
      $scope.movie = data.movie[0];
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
.controller('DatesCtrl', function ($scope, $stateParams, $http, $location, $state, UtilitiesService, CityService) {
    $scope.theatres = [];
    $scope.error = false;
    $scope.movie = {};
    $scope.cityId = $stateParams.cityId;
    $scope.movieId = $stateParams.movieId;
    $scope.formatDate = UtilitiesService.formatDate;
    $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    $http.get($scope.urlPrefix+"getDates.json?movieid="+$stateParams.movieId+"&cityid="+$stateParams.cityId)
    .success(function(data){
      // console.log(data);
      if(data.result && data.result.length>0){
        $scope.dates = data.result;
        $scope.movie = data.movie[0];
      }
      else{
        $scope.error = true;
      }
    })
    .error(function(){
      console.log("Error");
    })
})
.controller('ShowtimesCtrl', function ($scope, $stateParams, $location, $state, $http, UtilitiesService, CityService) {
    $scope.theatres = [];
    $scope.error = false;
    $scope.cityId = $stateParams.cityId;
    $scope.movieId = $stateParams.movieId;
    $scope.theatreId = $stateParams.theatreId;
    $scope.formatTime = UtilitiesService.formatTime;
    $scope.formatDate = UtilitiesService.formatDate;
    // console.log(UtilitiesService.formatTime("1100"));
    $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    $scope.addTickets = function(tmid, showtime){      
      $location.path("/app/postticket/"+$scope.cityId+"/"+tmid);
    }
    $http.get($scope.urlPrefix+"getShows.json?movieid="+$stateParams.movieId+"&theatreid="+$stateParams.theatreId)
    .success(function(data){
      $scope.movie = data.movie[0];
      $scope.theatre = data.theatre[0];
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
.controller('PostTicketCtrl', function ($scope, $stateParams, $http, $location, $state, UtilitiesService, CityService, UserService) {
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
  var userObj = UserService.getUserObj();
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
  $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    
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
              $scope.goHome();
            }).
            error(function(){
              console.log("Error");
            })
  }
})