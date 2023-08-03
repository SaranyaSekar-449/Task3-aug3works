
var app = angular.module('TokenModule', []);
app.factory('TokenService', function () {
  var token = ''; 

  return {
    getToken: function () {
      return token;
    },
    setToken: function (newToken) {
      token = newToken;
    }
  };
});
app.controller('TokenController', function ($scope, AuthService, $location, TokenService) {
  $scope.login = function () {
    AuthService.authenticate($scope.token).then(function (success) {
      if (success) {
        alert('Token is valid. You can now fetch users.');
        TokenService.setToken($scope.token); 
        $location.path('/fetch-users');
      } else {
        alert('Invalid token. Please try again.');
      }
    });
  };
});

