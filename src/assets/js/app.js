catalog = {};

catalog.ang = angular.module('catalog', []).config(function( $interpolateProvider ){ $interpolateProvider.startSymbol('[[').endSymbol(']]'); });

catalog.ang.controller('configuration', function($scope, $http) {

    $scope.current_client = null;
    $scope.new_client = null;

    $scope.loading = function(show, text){
        if(show){
            $('body').prepend("<div id=main-loader style='background: rgba(255,255,255,1) center center no-repeat; z-index: 19999; width:100%; height:200%; position:absolute;'><h3 style='margin-top:300px;' class='text-muted text-center'>"+text || "Loading"+"</h3></div>");
        }else{
            $('#main-loader').remove();
        }
    };

    $scope.add_site = function(){
        $scope.current_client.sites.push({
            "name" : "Site name",
            "path" : "site-path",
            "repo" : "",
            "hosts" : [],
            "accesskey" : null,
            "show_config" : true
        });
    };

    $scope.remove_host = function(site, host){
        if(confirm("Please confirm: you want remove the host: " + host + "?")){
            index = site.hosts.indexOf(host)
            site.hosts.splice(index, 1);
        }
        return;
    };

    $scope.add_host = function(site, host){
        site.hosts.push(site.new_host);
        site.new_host = undefined;
        return;
    };

    $scope.open_client = function(client){
        $scope.current_client = client;
    };

    $scope.addnew_client = function(){
        $scope.current_client = null;
        $scope.new_client = {
            "name" : "Client name",
            "path" : "client-path",
            "sites" : []
        };
        $scope.current_client = $scope.new_client;
    };

    $scope.add_client = function(client){
        $scope.configuration.clients.push($scope.new_client);
        $scope.current_client = null;
        $scope.new_client = null;
    };

    $scope.configure_site = function(site){
        for( i in $scope.current_client.sites ){ $scope.current_client.sites[i].show_config = false; }
        site.show_config = site.show_config == true ? false : true;
    };

    $scope.cancel = function(client){
        $scope.current_client = null;
    };

    $scope.load = function(client){
        if(confirm("Please confirm: you want load this config?")){
            $scope.current_client = null;
            $scope.loading(true, "Publishing configurations...");
        }
        return;
    };

    $scope.configuration = {
        "ssh_keys" : [
            {"name" : "david key", "content" : "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC4ACDwbegDq7nYZKl0+842bOxE1HuHiEKqGYCyzMrNOGb0OrjQsLpuzeCexmcwnVa3MXALdq8ERiYKa919X9ekYZp19q5Bgmt3vQM7kdQ6yt0WRyMJD94nP2zCLgWwTCdZmg49a6YkxmEyzQQ4ND6yx9gWadyZ96YuBJR/2aG5JeYxLnZd1ohxNL3kgrrxSCUdzfSo6eLPuGcdD2JpKthTQUcB7lipvp6AOOPCiyBi4e0zWHRQEHceXAl7LP/+csABOqcsa9JhnsVN3j8y0mhvbey3nAYJp0tdKamUULcE/aZ8wFRavA2pBXAReKvD//FSVywkhHAqoBHqyqWm/UQ7 inonjs@MacBook-Pro.home"},
            {"name" : "bruno key", "content" : "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC4ACDwbegDq7nYZKl0+842bOxE1HuHiEKqGYCyzMrNOGb0OrjQsLpuzeCexmcwnVa3MXALdq8ERiYKa919X9ekYZp19q5Bgmt3vQM7kdQ6yt0WRyMJD94nP2zCLgWwTCdZmg49a6YkxmEyzQQ4ND6yx9gWadyZ96YuBJR/2aG5JeYxLnZd1ohxNL3kgrrxSCUdzfSo6eLPuGcdD2JpKthTQUcB7lipvp6AOOPCiyBi4e0zWHRQEHceXAl7LP/+csABOqcsa9JhnsVN3j8y0mhvbey3nAYJp0tdKamUULcE/aZ8wFRavA2pBXAReKvD//FSVywkhHAqoBHqyqWm/UQ7 inonjs@MacBook-Pro.home"}
        ],
        "clients" : [
            {
                "name" : "Rednose",
                "path" : "rednose",
                "sites" : []
            },
            {
                "name" : "Madel",
                "path" : "madel",
                "sites" : []
            }
        ]
    };

    $scope.initialize = function(){};

    // start main functions
    $scope.initialize();

});


catalog.ang.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});
