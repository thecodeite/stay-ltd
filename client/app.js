angular.module('stay-ltd', [])
  .controller('graphController', ['$scope', 'buildChart', 'generateChartData', 
    function($scope, buildChart, generateChartData) {
    
      $scope.options = {
        asPercent: true,
        costs: 3000,
        expences: 0
      };

      $scope.chart = buildChart();

      $scope.chart.dataProvider = generateChartData($scope.options);
      $scope.chart.validateData();
      $scope.chart.write('chartdiv');

      $scope.updateGraph = function(){
        $scope.chart.dataProvider = generateChartData($scope.options);
        $scope.chart.validateData();
      };

    
    }]);