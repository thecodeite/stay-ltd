angular.module('stay-ltd').factory('generateChartData', [
  function() {

    function formatCurrency(num){
      var currenctString = num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      return currenctString.substr(0, currenctString.length-3);
    }

    function asPercentOf(val, tot){
      return Math.floor((val/tot) * 1000)/10;
    }

    function generateChartData(options) {
      var chartData = [];

      var valueFunction = function(num){return num;};
      if(options.asPercent){
        valueFunction = asPercentOf;
      }

      for(var gross = 20000; gross<=200000; gross+=5000) {

        var tax = calcPaye.calcIncomeTax(gross*100, 0, {yearEnd: 2015});
        var incomeTax = tax.totalPersonalTax / 100;
        
        var ni = calcPaye.calcEmployeeNi(gross*100);
        var niContribution = ni.total / 100;
     
        var paye = gross - incomeTax - niContribution;
        var grossString = formatCurrency(gross);

        var tldCalc = calcLtd.calc(gross*100, {costs: options.costs*100, expences: options.expences*100});
        var ltd = tldCalc.takeHome / 100;
        //console.log(tldCalc, ltd);

        var umbrellaFee = 52*20*100;
        var umbrellaCalc = calcLtd.calcUmbrella(gross*100, {
          umbrellaFixedFeePerWeek: 20 
        });
        var umbrella = umbrellaCalc.takeHome/100;
        
        chartData.push({
          gross: grossString,
          paye: valueFunction(paye, gross),
          payeBreakdown: asPercentOf(paye, gross) + "%" +
          " net:&pound;"+formatCurrency(paye)+
          " ni:&pound;"+formatCurrency(niContribution)+
          " tax:&pound;"+formatCurrency(incomeTax),
          ltd: valueFunction(ltd, gross),
          umbrella: valueFunction(umbrella, gross),
          umbrellaBreakdown: 
            asPercentOf(umbrella, gross) + "%" +
            " net:&pound;"+formatCurrency(umbrella)+
            " erNi:&pound;"+formatCurrency(umbrellaCalc.breakdown.employersNi)+
            " eeNi:&pound;"+formatCurrency(umbrellaCalc.breakdown.employeesNi)+
            " tax:&pound;"+formatCurrency(umbrellaCalc.breakdown.employeesTax),
        });
        
      }
      
      return chartData;
    }

    return generateChartData;
  }
]);
