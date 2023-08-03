
app.directive('customLogin', function () {
      return {
        restrict: 'E',
        templateUrl: 'TokenModule/token.html',
        controller: 'TokenController',
        scope: {
          onLogin: '&'
        }
      };
    });
  