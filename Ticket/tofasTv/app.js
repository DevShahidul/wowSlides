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

var appCtrl = angular.module("appCtrl", []);
