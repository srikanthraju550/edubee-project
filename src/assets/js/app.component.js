var app = angular.module('app', ['BotDetectCaptcha']);

app.config(function($routeProvider, captchaSettingsProvider) {
  captchaSettingsProvider.setSettings({
    captchaEndpoint: 'captcha-endpoint/simple-botdetect.php'
  });
});

app.controller('BasicController', function($scope, $http, Captcha) {

  // captcha validation messages
  $scope.successMessages = '';
  $scope.errorMessages = '';
  
  // basic captcha url
  var basicUrl = 'basic.php';
  
  $scope.validate = function() {

    // create new BotDetect AngularJS Captcha instance
    var captcha = new Captcha();

    // use validateUnsafe() method to perform client-side captcha validation
    captcha.validateUnsafe(function(isCaptchaCodeCorrect) {

      if (isCaptchaCodeCorrect) {
        
        // after UI form validation passed, 
        // we will need to validate captcha at server-side once before we save form data in database, etc.
        
        // captcha id for validating captcha at server-side
        var captchaId = captcha.captchaId;
        
        // captcha code input value for validating captcha at server-side
        var captchaCode = $scope.captchaCode;

        var postData = {
          captchaId: captchaId,
          captchaCode: captchaCode
        };
        
        $http({
          method: 'POST',
          url: basicUrl,
          data: JSON.stringify(postData)
        })
          .then(function(response) {
            if (response.data.success) {
              // captcha validation passed at server-side
              $scope.successMessages = 'CAPTCHA validation passed.';
              $scope.errorMessages = null;
            } else {
              // captcha validation failed at server-side
              $scope.errorMessages = 'CAPTCHA validation falied.';
              $scope.successMessages = null;
            }
            
            // always reload captcha image after validating captcha at server-side 
            // in order to update new captcha code for current captcha id
            captcha.reloadImage();
          }, function(error) {
            console.log(error.data);
          });
      } else {
        $scope.errorMessages = 'CAPTCHA validation falied.';
        $scope.successMessages = null;
      }
    });
  };
   
});