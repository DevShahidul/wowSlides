var app = angular.module("courseList", []);
app.controller("recentCourseList", function($scope) {
    $scope.todayCourses = [
        { "name":"WCM - İş Güvenliği 7 Adım Yaklaşımı", "hour":"10.00",  "trainer":"Işıl Taysever", "className":"A202", "targetGroup":"TOFAS" },
        { "name":"Etkili Sunum Teknikleri", "hour":"12.00",  "trainer":"Selim Aladağ", "className":"A203", "targetGroup":"TOFAS" },
        { "name":"Altı Sigma (Yeşil Kuşak) Atölye 1", "hour":"14.00",  "trainer":"Yener Ünsal", "className":"D3", "targetGroup":"TEDARİKÇİ" },
        { "name":"Satınalma Hakkında Kitaplarda Yazmayanlar", "hour":"09.00",  "trainer":"Onur Dinçarslan", "className":"D6", "targetGroup":"TOFAS" },
        { "name":"Deneyimleri Analiz Etmek", "hour":"11.00",  "trainer":"Bora Özkent", "className":"D5", "targetGroup":"TOFAS" },
        { "name":"Hayatımızdaki Davetsiz Misafir: Deprem", "hour":"10.00",  "trainer":"Akın Ergür", "className":"D4", "targetGroup":"TEDARİKÇİ" },
    ];
});

app.controller("personCourseList", function($scope) {
    $scope.personInfo = {
        "name" : "Evan Rachel Wood",
        "profileImg" : "http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-ginger-guy.png",
        "courses" : [
        { "name":"WCM - İş Güvenliği 7 Adım Yaklaşımı", "hour":"10.00",  "trainer":"Işıl Taysever", "className":"D2", "targetGroup":"TOFAS" , "startDate":"06.07.1992", "endDate":"06.07.2050"},
        { "name":"Etkili Sunum Teknikleri", "hour":"12.00",  "trainer":"Selim Aladağ", "className":"D1", "targetGroup":"TOFAS", "startDate":"06.07.1992", "endDate":"06.07.2050" },
        { "name":"Altı Sigma (Yeşil Kuşak) Atölye 1", "hour":"14.00",  "trainer":"Yener Ünsal", "className":"D3", "targetGroup":"TEDARİKÇİ", "startDate":"06.07.1992", "endDate":"06.07.2050" },
        { "name":"Satınalma Hakkında Kitaplarda Yazmayanlar", "hour":"09.00",  "trainer":"Onur Dinçarslan", "className":"D6", "targetGroup":"TOFAS", "startDate":"06.07.1992", "endDate":"06.07.2050" },
        { "name":"Deneyimleri Analiz Etmek", "hour":"11.00",  "trainer":"Bora Özkent", "className":"D5", "targetGroup":"TOFAS", "startDate":"06.07.1992", "endDate":"06.07.2050" },
        { "name":"Hayatımızdaki Davetsiz Misafir: Deprem", "hour":"10.00",  "trainer":"Akın Ergür", "className":"D4", "targetGroup":"TEDARİKÇİ", "startDate":"06.07.1992", "endDate":"06.07.2050" },
        ]
    };
});

var appCtrl = angular.module("appCtrl", ['ng-virtual-keyboard']);


appCtrl.config(['VKI_CONFIG', function(VKI_CONFIG){
  VKI_CONFIG.position = {
    of: null,
    my: 'center top',
    at: 'center top',
    at2: 'center bottom'
  };
  VKI_CONFIG.tabNavigation = true;
  VKI_CONFIG.css = {
    container: 'ui-widget-content ui-widget ui-corner-all ui-helper-clearfix',
    buttonDefault: 'ui-state-default ui-corner-all',
       // hovered button
       buttonHover: 'ui-state-hover',
       // Action keys (e.g. Accept, Cancel, Tab, etc);
       // this replaces "actionClass" option
       buttonAction: 'ui-state-active',
       // Active keys
       // (e.g. shift down, meta keyset active, combo keys active)
       buttonActive: 'ui-state-active',
       // used when disabling the decimal button {dec}
       // when a decimal exists in the input area
       buttonDisabled: 'ui-state-disabled',
       // {empty} button class name
       buttonEmpty: 'ui-keyboard-empty'
  };
  VKI_CONFIG.extensions = {
    addTyping: false
  };
}])

appCtrl.controller('ExampleCtrl', ['$scope', 'ngVirtualKeyboardService', function($scope, ngVirtualKeyboardService){
  $scope.t01Config = {
    layout: 'alpha',
    extensions: {
      addTyping: false
    }
  };

  $scope.t04Config = {
    layout: 'international',
    autoAccept: true,
    extensions: {
      addScramble: {randomizeOnce: false},
      addTyping: false
    }
  };

  $scope.onKeyboardClick = function(id){
    var keyboard = ngVirtualKeyboardService.getKeyboardById(id);
    if (keyboard) {
      if (keyboard.isOpen) {
        keyboard.close();
      } else {
        keyboard.reveal();
      }
    }
  };

  $scope.t05Config = {
    layout: 'alpha',
    extensions: {
      addTyping: false
    },
    events: {
      keyboardChange: function(e, kb, el) {
        console.log(e.type + ', "' + el.value + '", "' + kb.$preview.val() + '"');
      },
      change: function(e, kb, el) {
        console.log(e.type + ', "' + el.value + '", "' + kb.$preview.val() + '"');
      }
    }
  };

  $scope.t06Config = {
    layout: 'alpha',
    extensions: {
      addTyping: false
    },
    autoAccept: true,
    usePreview: false,
    autoUpdateModel: true
  };

  $scope.t06Change = function() {
    console.log('t06 value changed');
  };
}]);
