angular.module('myApp', ['ngRoute', 'TokenModule', 'UserListModule'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'TokenModule/token.html',
        controller: 'TokenController'
      })
      .when('/fetch-users', {
        templateUrl: 'UserListModule/userlist.html',
        controller: 'UserListController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .controller('MainController', function ($scope, AuthService, $location) {
    $scope.isTokenPresent = AuthService.isTokenPresent();
    $scope.isUserListFetched = false;
  
    $scope.fetchUserList = function () {
      if ($scope.isTokenPresent) {
        AuthService.authenticate(localStorage.getItem('user'))
          .then(function (isValidToken) {
            if (isValidToken) {
              $scope.isUserListFetched = true;
              $location.path('/fetch-users');
            } else {
              alert('Invalid token. Please enter a valid GitHub token.');
            }
          })
          .catch(function (error) {
            alert('Error occurred while validating the token.');
            console.error(error);
          });
      } else {
        alert('Please enter a valid token first.');
      }
    };
  })
  .factory('AuthService', function ($q, $http) {
    return {
      isTokenPresent: function () {
        return localStorage.getItem('user') !== null;
      },
      authenticate: function (token) {
        var deferred = $q.defer();
        if (token) {
          $http.get('https://api.github.com/user', {
            headers: {
              Authorization: `token ${token}`
            }
          })
          .then(function (response) {
            if (response.status === 200) {
              console.log('Token is valid:', token);
              deferred.resolve(true); 
            } else {
              console.log('Token is invalid:', token);
              deferred.reject(false); 
            }
          })
          .catch(function (error) {
            console.log('Error occurred:', error);
            deferred.reject(false); 
            alert('Token is invalid');
          });
        } else {
          console.log('Empty token provided.');
          deferred.reject(false); 
        }
        return deferred.promise;
      }
    };
  });
