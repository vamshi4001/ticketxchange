angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};
  // $scope.urlPrefix = "http://home.venublog.com/ticketsws/index.php/data/";
  $scope.urlPrefix = "http://localhost:8888/ticketsws/index.php/data/";    
})
.controller('LoginCtrl', function ($scope, $location, $state, $stateParams, $http, $ionicPopup, $ionicLoading, CityService, UserService) {
  $scope.user = {};
  $scope.show = function(message){
      $scope.loading = $ionicLoading.show({
          content: '<i class="ion-load-c"></i> '+ message,
          animation: 'fade-in',
          noBackdrop: false,
          maxWidth: 200,
          showDelay: 500
      });
  }
  if(UserService.getUserObj().id){
    if(CityService.getCityObj().id){
      $location.path("/app/movies/"+CityService.getCityObj().id);
    }
    else{
      $location.path("/app/cities");   
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
    $scope.show("Logging in");
    $http.get($scope.urlPrefix+"/userLogin.json?uname="+$scope.user.uname+"&password="+$scope.user.password+"&t="+Date.now()).
    success(function(data){      
      if(data.isSuccess){
        if(data.result.length==1){
          UserService.setUserObj(data.result[0]);
          $ionicLoading.hide();
          if(CityService.getCityObj().id){
            $location.path("/app/movies/"+CityService.getCityObj().id)
          }
          else{
            $location.path("/app/cities"); 
          }
        }
        else{
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: "Login Information",
            content: "Invalid Credentials!"
          })
        }                      
      }
      else{
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: "Login Information",
          content: "Invalid Credentials!"
        })
      }      
    }).
    error(function(){
      $ionicLoading.hide();
      console.log("Error");
    })
  }
})
.controller('SkipLoginCtrl', function ($scope, $location, $state, $stateParams, $http, $ionicPopup, $ionicLoading, CityService, UserService, UtilitiesService) {
  if($stateParams.cityId){
    $scope.cityid = $stateParams.cityId;
    if(UserService.getUserObj().id){
      $location.path("/app/movies/"+$scope.cityid);
    }    
  }    
})
.controller('SignupCtrl', function ($scope, $location, $state, $stateParams, $http, $ionicPopup, $ionicLoading, CityService) {
  $scope.user = {};
  $scope.show = function(message){
      $scope.loading = $ionicLoading.show({
          content: '<i class="ion-load-c"></i> '+ message,
          animation: 'fade-in',
          noBackdrop: false,
          maxWidth: 200,
          showDelay: 500
      });
  }
  $scope.goHome = function(){
    if(CityService.getCityObj().id){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    else{
      $location.path("/app/home");
    }
  }  
  $scope.signup = function(){
    $scope.show("Signing up");
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
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: "Signup Information",
        content: "Signed up successfully!"
      })
      if(CityService.getCityObj().id){
        $location.path("/app/home/"+CityService.getCityObj().id)
      }
      else{
        $location.path("/app/cities"); 
      }
    }).
    error(function(){
      $ionicLoading.hide();
      console.log("Error");
    })
  }
})
.controller('CitiesCtrl', function ($scope, $location, $state, $stateParams, $http, $ionicPopup, $ionicLoading, CityService) {
    $scope.cities = [];
    $scope.error = ""; 
    $scope.show = function(message){
        $scope.loading = $ionicLoading.show({
            content: '<i class="ion-load-c"></i> '+ message,
            animation: 'fade-in',
            noBackdrop: false,
            maxWidth: 200,
            showDelay: 500
        });
    }
    $scope.goHome = function(){
      if(CityService.getCityObj().id){
        $location.path("/app/home/"+CityService.getCityObj().id);
      }
      else{
        $location.path("/app/home");
      }
    }
    $scope.getCities = function(){
      $scope.show("Fetching cities");
      $http.get($scope.urlPrefix+"getCities.json?t="+Date.now())
      .success(function(data){
        $ionicLoading.hide();
        if(data.result && data.result.length>0){
          $scope.cities = data.result;
        }
        else{
          $scope.error = "No cities found";
        }
      })
      .error(function(){
        $ionicLoading.hide();
        console.log("Error");
      })
    }

    $scope.selectCity = function(id){
      $http.get($scope.urlPrefix+"getCities.json?cityId="+id+"&t="+Date.now())
      .success(function(data){
        CityService.setCityObj(data.result[0]);
        window.localStorage['city'] = data.result[0];
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
.controller('UserEndingCtrl', function ($scope, $stateParams, $location, $state, $http, $ionicPopup, $ionicLoading, CityService) {
  $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    
})
.controller('UserMoviesCtrl', function ($scope, $stateParams, $location, $state, $http, $ionicPopup, $ionicLoading, CityService, UtilitiesService) {
    $scope.movies = [];
    $scope.error = false;
    $scope.cityId = "";
    $scope.formatSmallDate = UtilitiesService.formatSmallDate;
    $scope.show = function(message){
        $scope.loading = $ionicLoading.show({
            content: '<i class="ion-load-c"></i> '+ message,
            animation: 'fade-in',
            noBackdrop: false,
            maxWidth: 200,
            showDelay: 500
        });
    }
    $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    $scope.getMovies = function(){
      $scope.show("Fetching movies");
      $http.get($scope.urlPrefix+"getMoviesTickets.json?cityid="+$scope.cityId+"&t="+Date.now())
      .success(function(data){
        // console.log(data);
        $ionicLoading.hide();
        if(data.result && data.result.length>0){
          var groups = {};
          for(var i=0;i<data.result.length;i++){
            if(groups[data.result[i].id]){
              groups[data.result[i].id].push(data.result[i]);
            }
            else{
              groups[data.result[i].id] = []
              groups[data.result[i].id].push(data.result[i]);
            }
          }
          var arr = Object.keys(groups).map(function(k) { return groups[k] });
          $scope.movies = arr;          
        }
        else{          
          $scope.error = true;
        }
      })
      .error(function(){
        $ionicLoading.hide();
        console.log("Error");
      })
    }
    if($stateParams.cityId){
      $http.get($scope.urlPrefix+"getCities.json?cityId="+$stateParams.cityId+"&t="+Date.now())
      .success(function(data){
        CityService.setCityObj(data.result[0]);
        $scope.cityId = CityService.getCityObj().id;
        $scope.getMovies();
      })
    }    
    else if(CityService.getCityObj().id){
      //console.log(CityService.getCityObj());
      $scope.cityId = CityService.getCityObj().id;
      $scope.getMovies();
    }
    else{
      $location.path("/app/cities")
    }
})
.controller('MoviesCtrl', function ($scope, $stateParams, $http, $ionicPopup, $ionicLoading, CityService, $location) {
    $scope.movies = [];
    $scope.error = false;
    $scope.cityId = "";
    $scope.show = function(){
        $scope.loading = $ionicLoading.show({
            content: '<i class=" ion-load-c"></i> Fetching Movies',
            animation: 'fade-in',
            noBackdrop: false,
            maxWidth: 200,
            showDelay: 500
        });
    }
    $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    $scope.getMovies = function(){
      $scope.show();
      $http.get($scope.urlPrefix+"getMovies.json?cityid="+$scope.cityId+"&t="+Date.now())
      .success(function(data){
        // console.log(data);
        $ionicLoading.hide();
        if(data.result && data.result.length>0){
          for (var i = 0; i < data.result.length; i++) {
            data.result[i]
            data.result[i].genreArr = [];
            if(data.result[i].genre){
              data.result[i].genreArr = data.result[i].genre.split("|");
            }
          };
          $scope.movies = data.result;          
          $scope.cityName = CityService.getCityObj().city;
          $ionicLoading.hide();          
        }
        else{          
          $scope.error = true;
        }
      })
      .error(function(){
        $ionicLoading.hide();
        console.log("Error");
      })
    }
    if($stateParams.cityId){
      $http.get($scope.urlPrefix+"getCities.json?cityId="+$stateParams.cityId+"&t="+Date.now())
      .success(function(data){
        CityService.setCityObj(data.result[0]);
        $scope.cityId = CityService.getCityObj().id;        
        $scope.getMovies();
      })
    }    
    else if(CityService.getCityObj().id){
      // console.log(CityService.getCityObj());
      $scope.cityId = CityService.getCityObj().id;      
      $scope.getMovies();
    }    
    else{
      $location.path("/app/cities");
    }
})
.controller('TheatresCtrl', function ($scope, $stateParams, $http, $location, $ionicPopup, $ionicLoading, CityService) {
    $scope.theatres = [];
    $scope.error = false;
    $scope.cityId = $stateParams.cityId;
    $scope.movieId = $stateParams.movieId;
    $scope.show = function(message){
	      $scope.loading = $ionicLoading.show({
	          content: '<i class=" ion-load-c"></i> '+ message,
	          animation: 'fade-in',
	          noBackdrop: false,
	          maxWidth: 200,
	          showDelay: 500
	      });        
	  }
    $scope.getTheatres = function(){
      $scope.show("Fetching theaters");
    	$http.get($scope.urlPrefix+"getTheatres.json?movieid="+$stateParams.movieId+"&cityid="+$stateParams.cityId+"&t="+Date.now())
	    .success(function(data){
	      // console.log(data);
        $ionicLoading.hide();
	      if(data.result && data.result.length>0){	      	
	        $scope.theatres = data.result;
	        $scope.movie = data.movie[0];
	      }
	      else{	      	
	        $scope.error = true;
	      }
	    })
	    .error(function(){
	     $ionicLoading.hide();
	      console.log("Error");
	    })
    }    
    $scope.getTheatres();
    

    $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    
})

.controller('LogoutCtrl', function ($scope, $stateParams, $location, $state, $http, $ionicPopup, $ionicLoading, UtilitiesService, CityService, UserService) {
  $scope.show = function(message){
      $scope.loading = $ionicLoading.show({
          content: '<i class=" ion-load-c"></i> '+ message,
          animation: 'fade-in',
          noBackdrop: false,
          maxWidth: 200,
          showDelay: 500
      });        
  }
  UserService.removeUserObj();
  setTimeout(function(){
    $scope.show("Logging out");
    $location.path("/app/home");
  },2000);  
})
.controller('HomeCtrl', function ($scope, $stateParams, $location, $state, $http, $ionicPopup, $ionicLoading, UtilitiesService, CityService, UserService) {
  $scope.loggedinUser = "Guest";
  $scope.isLogedin = false;
  $scope.show = function(message){
        $scope.loading = $ionicLoading.show({
            content: '<i class=" ion-load-c"></i> '+ message,
            animation: 'fade-in',
            noBackdrop: false,
            maxWidth: 200,
            showDelay: 500
        });        
  }
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
  $scope.logout = function(){
    UserService.removeUserObj();
    $location.path("/app/home/"+CityService.getCityObj().id);    
  }  
})
.controller('PostedTicketsCtrl', function ($scope, $stateParams, $location, $state, $http, $ionicPopup, $ionicLoading, UtilitiesService, CityService) {
  $scope.tmid = $stateParams.tmid;
  $scope.show = function(message){
        $scope.loading = $ionicLoading.show({
            content: '<i class=" ion-load-c"></i> '+ message,
            animation: 'fade-in',
            noBackdrop: false,
            maxWidth: 200,
            showDelay: 500
        });        
    }
  $scope.goHome = function(){
    $location.path("/app/home/"+CityService.getCityObj().id);
  }
  $scope.show("Fetching data");
  $http.get($scope.urlPrefix+"getPostedTickets.json?tmid="+$scope.tmid+"&t="+Date.now())
  .success(function(data){
    // console.log(data);
    $ionicLoading.hide();
    if(data.result && data.result.length>0){
      $scope.list = data.result;
    }
    else{
      $scope.error = true;
    }
  })
  .error(function(){
    $ionicLoading.hide();
    console.log("Error");
  })
})
.controller('MyticketsCtrl', function ($scope, $location, $state, $stateParams, $http, $ionicPopup, $ionicLoading, UtilitiesService, CityService, UserService) {
  $scope.error = false;
  $scope.formatTime = UtilitiesService.formatTime;
  $scope.formatDate = UtilitiesService.formatDate;
  $scope.show = function(message){
        $scope.loading = $ionicLoading.show({
            content: '<i class=" ion-load-c"></i> '+ message,
            animation: 'fade-in',
            noBackdrop: false,
            maxWidth: 200,
            showDelay: 500
        });        
    }
  $scope.goHome = function(){
    $location.path("/app/home/"+CityService.getCityObj().id);
  }
  $scope.removeTicket = function(ticketid){
    $scope.show("Removing ticket");
    $http.get($scope.urlPrefix+"removeMyTicket.json?ticketid="+ticketid+"&t="+Date.now())
    .success(function(data){
      $ionicLoading.hide();
      if(data.isSuccess){
        $ionicPopup.alert({
          title: "Ticket deletion",
          content: "Ticket deleted successfully!"
        })        
      }
      else{
        $ionicPopup.alert({
          title: "Ticket deletion",
          content: "Something went wrong! Try again later"
        })         
      }
    })
    .error(function(){
      $ionicLoading.hide();
      console.log("Error");
    })  
  }  
  $scope.show("Fetching your tickets");
  $http.get($scope.urlPrefix+"getMyTickets.json?userid="+UserService.getUserObj().id+"&t="+Date.now())
    .success(function(data){
      $ionicLoading.hide();
      if(data.result && data.result.length>0){
        $scope.list = data.result;
      }
      else{
        $scope.error = true;
      }
    })
    .error(function(){
      $ionicLoading.hide();
      console.log("Error");
    })
})
.controller('UserTheatresCtrl', function ($scope, $location, $state, $stateParams, $http, $ionicPopup, $ionicLoading, UtilitiesService, CityService) {
    $scope.theatres = [];
    $scope.error = false;
    $scope.movie = {}
    $scope.cityId = $stateParams.cityId;
    $scope.movieId = $stateParams.movieId;
    $scope.formatTime = UtilitiesService.formatTime;
    $scope.show = function(message){
        $scope.loading = $ionicLoading.show({
            content: '<i class=" ion-load-c"></i> '+ message,
            animation: 'fade-in',
            noBackdrop: false,
            maxWidth: 200,
            showDelay: 500
        });        
    }
    $scope.getTickets = function(tmid){
      $location.path("/app/postedtickets/"+tmid);
    }
    $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    $scope.show("Fetching data...");
    $http.get($scope.urlPrefix+"getTickets.json?cityid="+$scope.cityId+"&movieid="+$scope.movieId+"&date="+$stateParams.date+"&t="+Date.now())
    .success(function(data){      
      if(data.result){
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
        $ionicLoading.hide();
        if(data.result && data.result.length>0){
          $scope.theatres = data.result;
        }
        else{
          $scope.error = true;
        }
      }
      else{
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: "Error",
          content: "Error while fetching tickets"
        })
      }
    })
    .error(function(){
      $ionicLoading.hide();
      console.log("Error");
    })
})
.controller('DatesCtrl', function ($scope, $stateParams, $http, $location, $state, $ionicPopup, $ionicLoading, UtilitiesService, CityService) {
    $scope.theatres = [];
    $scope.error = false;
    $scope.movie = {};
    $scope.cityId = $stateParams.cityId;
    $scope.movieId = $stateParams.movieId;
    $scope.formatDate = UtilitiesService.formatDate;
    $scope.show = function(message){
        $scope.loading = $ionicLoading.show({
            content: '<i class=" ion-load-c"></i> '+ message,
            animation: 'fade-in',
            noBackdrop: false,
            maxWidth: 200,
            showDelay: 500
        });        
    }
    $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    $scope.show("getting dates");
    $http.get($scope.urlPrefix+"getDates.json?movieid="+$stateParams.movieId+"&cityid="+$stateParams.cityId+"&t="+Date.now())
    .success(function(data){
      // console.log(data);
      $ionicLoading.hide();
      if(data.result && data.result.length>0){
        $scope.dates = data.result;
        $scope.movie = data.movie[0];
      }
      else{
        $scope.error = true;
      }
    })
    .error(function(){
      $ionicLoading.hide();
      console.log("Error");
    })
})
.controller('ShowtimesCtrl', function ($scope, $stateParams, $location, $state, $http, $ionicPopup, $ionicLoading, UtilitiesService, CityService) {
    $scope.theatres = [];
    $scope.error = false;
    $scope.cityId = $stateParams.cityId;
    $scope.movieId = $stateParams.movieId;
    $scope.theatreId = $stateParams.theatreId;
    $scope.formatTime = UtilitiesService.formatTime;
    $scope.formatDate = UtilitiesService.formatDate;
    $scope.show = function(message){
        $scope.loading = $ionicLoading.show({
            content: '<i class=" ion-load-c"></i> '+ message,
            animation: 'fade-in',
            noBackdrop: false,
            maxWidth: 200,
            showDelay: 500
        });        
    }
    // console.log(UtilitiesService.formatTime("1100"));
    $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    $scope.addTickets = function(tmid, showtime){      
      $location.path("/app/postticket/"+$scope.cityId+"/"+tmid);
    }
    $scope.show("fetching showtimes");
    $http.get($scope.urlPrefix+"getShows.json?movieid="+$stateParams.movieId+"&theatreid="+$stateParams.theatreId+"&t="+Date.now())
    .success(function(data){
      if(data.result){
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

          $ionicLoading.hide();
        
        if(data.result && data.result.length>0){
          $scope.shows = data.result;
        }
        else{
          $scope.error = true;
        }
      }
      else{
        $ionicLoading.hide();
        $scope.error = true;
        console.log("Error");
      }
    })
    .error(function(){
      $ionicLoading.hide();
      console.log("Error");
      $scope.error = true;
    })
})
.controller('PostTicketCtrl', function ($scope, $stateParams, $http, $location, $state, $ionicPopup, $ionicLoading, UtilitiesService, CityService, UserService) {
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
  $scope.show = function(message){
        $scope.loading = $ionicLoading.show({
            content: '<i class=" ion-load-c"></i> '+ message,
            animation: 'fade-in',
            noBackdrop: false,
            maxWidth: 200,
            showDelay: 500
        });        
    }
  //get User details
  var userObj = UserService.getUserObj();
  $scope.post.name = userObj.fullname;
  $scope.post.phone = userObj.contactnumber;
  //get movieid theatreid showid and date
  $scope.show("Fetching info");
  $http.get($scope.urlPrefix+"getInfoTMID.json?tmid="+$scope.showId+"&t="+Date.now())
  .success(function(data){
    var movieId = data.result[0].movieid;
    var theatreId = data.result[0].theatreid;
    $scope.date = data.result[0].date;
    var showTime = data.result[0].showtimes;
      $ionicLoading.hide();

      //getMovieDetails
      $scope.show("Fetching movie info");
      $http.get($scope.urlPrefix+"getMovies.json?movieId="+movieId+"&t="+Date.now())
      .success(function(data){
        $ionicLoading.hide();
        $scope.movieName = data.result[0].name;
        $scope.imageurl = data.result[0].imageurl
      })
      .error(function(){
        $ionicLoading.hide();
        $scope.error = true;
      })
      

      //getTheatreDetails
      $scope.show("Fetching theatre info");
      $http.get($scope.urlPrefix+"getTheatres.json?theatreId="+theatreId+"&t="+Date.now())
      .success(function(data){
        $ionicLoading.hide();
        $scope.theatreName = data.result[0].name;
        $scope.theatreLocation = data.result[0].location
      })
      .error(function(){
        $ionicLoading.hide();
        $scope.error = true;
      })
      
      //getShowDetails
      $scope.showTime = showTime;    
  })
  .error(function(){
    $ionicLoading.hide();
    $scope.error = true;
  })
  $scope.goHome = function(){
      $location.path("/app/home/"+CityService.getCityObj().id);
    }
    
  $scope.postTickets = function(){
    $scope.show("Posting ticket");
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
      var flag = 0;
      var message = "<ul>";
      if(!data.quantity || data.quantity<=0){
        flag =1;
        message += "<li>There must be atleast 1 ticket</li>";
      }
      if(!data.name || data.name.length<1){
        flag =1;
        message += "<li>What would you love to be called?</li>"
      }
      if(!data.phone || data.phone.toString().length<10){
        flag =1;
        message += "<li>How can we reach you?</li>";
      }
      if(!data.price || data.price<0){
        flag =1;
        message += "<li>Price can't go below Rs.0/-</li>";
      }
      if(flag == 1){
        message+="</ul>";
        $ionicPopup.alert({
          title: "Errors while posting",
          content: message
        })
      }
      else{
        $http({
                    method: "post",
                    url: $scope.urlPrefix+"/newTicket.json",
                    data: data
            }).
            success(function(edata, status, headers){
              $ionicLoading.hide();
              $ionicPopup.alert({
                title: "Ticket Post",
                content: "Ticket posted successfully!"
              })
              $scope.goHome();
            }).
            error(function(){
              $ionicLoading.hide();
              console.log("Error");
            })
      }
      
  }
})