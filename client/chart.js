angular.module('stay-ltd')
  .factory('buildChart', [function () {
    var chartStructure = {
      "type": "serial",
      "theme": "light",
      "legend": {
        "equalWidths": false,
        "position": "top",
        "valueAlign": "left",
        "valueWidth": 100
      },
      "valueAxes": [{
        "stackType": "none",
        "gridAlpha": 0.07,
        "position": "left",
        "title": "Take home"
      }],
      "graphs": [{
        "fillAlphas": 0.06,
        "lineAlpha": 0.4,
        "title": "PAYE",
        "valueField": "paye",
        "balloonText": "[[description]]",
        "descriptionField": "payeBreakdown"
      }, {
        "fillAlphas": 0.06,
        "lineAlpha": 0.4,
        "title": "Limited Company",
        "valueField": "ltd"
      }, {
        "fillAlphas": 0.06,
        "lineAlpha": 0.4,
        "title": "Umbrella",
        "valueField": "umbrella",
        "balloonText": "[[description]]",
        "descriptionField": "umbrellaBreakdown"
      }],
      "plotAreaBorderAlpha": 0,
      "marginTop": 10,
      "marginLeft": 0,
      "marginBottom": 0,
      "chartScrollbar": {},
      "chartCursor": {
        "cursorAlpha": 0
      },
      "categoryField": "gross",
      "categoryAxis": {
        "startOnAxis": true,
        "axisColor": "#DADADA",
        "gridAlpha": 0.07,
        "title": "Gross Pay"
      },
      "export": {
        "enabled": true
      }
    };

    var chart = AmCharts.makeChart("chartdiv", chartStructure);
    return function(){return chart;};
  }]);