angular.module('stay-ltd', ['ngStorage'])
  .controller('graphController', ['$scope', 'buildChart', 'generateChartData', '$localStorage', 'defaultOptions',
    function($scope, buildChart, generateChartData, $localStorage, defaultOptions) {
    
      $scope.$storage = $localStorage.$default({
        options: defaultOptions()
      });
      
      $scope.options = $scope.$storage.options;

      $scope.chart = buildChart();

      $scope.chart.dataProvider = generateChartData($scope.options);
      $scope.chart.validateData();
      $scope.chart.write('chartdiv');

      $scope.updateGraph = function(){
        $scope.chart.dataProvider = generateChartData($scope.options);
        $scope.chart.validateData();
      };

      $scope.resetOptions = function() {
        $scope.options = defaultOptions();
        $scope.updateGraph();
      };

    
    }])
  .directive('convertToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(val) {
        return parseInt(val, 10);
      });
      ngModel.$formatters.push(function(val) {
        return '' + val;
      });
    }
  };
}).factory('defaultOptions', [function() {
  
  return function() {
    return {
          start: 1000,
          end:  150000,
          step:   5000,
          yearEnd: 2016,
          asPercent: true,
          salary: 9600,
          costs: 3000,
          expenses: 0
        };
  }
  }]);