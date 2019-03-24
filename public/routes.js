myapp.config(['$routeProvider',function($routeProvider){
    $routeProvider

    .when('/',{
        templateUrl:'views/signup.html',
         controller:'signupcontroller',
         controllerAs:'signup'
     })
    
    .when('/callingpage/:userID',{
       templateUrl:'views/calling.html',
        controller:'callingcontroller',
        controllerAs:'calling'
    })
    
    
    
    
    }])