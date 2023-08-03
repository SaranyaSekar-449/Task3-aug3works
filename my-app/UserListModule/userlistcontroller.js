
angular.module('UserListModule', [])
  .factory('UserListService', function ($http, $q, TokenService) {
    return {
      isTokenUsed: function () {
        const token = TokenService.getToken();
        return !!token; 
      },
      fetchUserList: function () {
        const token = TokenService.getToken();
        if (token) {
          return $http.get('https://api.github.com/users', {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          }).then(function (response) {
            return response.data;
          }).catch(function (error) {
            console.error('Error fetching user list:', error);
            return $q.reject(error);
          });
        } else {
          return $q.reject('No token found');
        }
      }
    };
  })
  .controller('UserListController', function ($scope, UserListService, AuthService, $http) {
    UserListService.fetchUserList().then(function (userList) {
      $scope.userList = userList;
    }).catch(function (error) {
      console.error('Error fetching user list:', error);
    });

    $scope.isTokenUsed = UserListService.isTokenUsed();
    $scope.userData = null;

    if ($scope.isTokenUsed) {
      $http.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${TokenService.getToken()}`
        }
      }).then(function (response) {
        $scope.userData = response.data;
      }).catch(function (error) {
        console.error('Error fetching user data:', error);
      });
    }
  });


