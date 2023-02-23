angular.module('stay-ltd').factory('generateChartData', [
  function() {

    function formatCurrency(num){
      var currenctString = num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      return currenctString.substr(0, currenctString.length-3);
    }

    function asPercentOf(val, tot){
      if(tot === 0) return val <= 0?0:100.0;
      return Math.floor((val/tot) * 1000)/10;
    }

    function generateChartData(options) {
      var chartData = [];

      var valueFunction = function(num){return num;};
      if(options.asPercent){
        valueFunction = asPercentOf;
      }

      for(var gross = options.start; gross<=options.end; gross+=Math.max(options.step, 100)) {
        if(gross === 0){gross = 1;}
        var employee = calcPaye.calcEmployeeTakehome(gross*100, {
          yearEnd: options.yearEnd,
          studentLoanRemaining: (options.studentLoanRemaining||0)*100
        });
        //var incomeTax = tax.totalPersonalTax / 100;
        
        //var ni = calcPaye.calcEmployeeNi(gross*100, {yearEnd: options.yearEnd});
        //var niContribution = ni.total / 100;
     
        //var paye = gross - incomeTax - niContribution;
        //var paye  = employee.takeHome;

        var tldCalc = calcLtd.calc(gross*100, {
          yearEnd: options.yearEnd,
          salary: options.salary*100,
          costs: options.costs*100, 
          expenses: options.expenses*100,
          studentLoanRemaining: (options.studentLoanRemaining||0)*100
        });
        var ltd = tldCalc.takeHome / 100;
        //console.log(tldCalc, ltd);

        var umbrellaFee = 52*20*100;
        var umbrellaCalc = calcLtd.calcUmbrella(gross*100, {
          yearEnd: options.yearEnd,
          umbrellaFixedFeePerWeek: 20,
          studentLoanRemaining: (options.studentLoanRemaining||0)*100
        });
        var umbrella = umbrellaCalc.takeHome/100;
        
        chartData.push({
          gross: formatCurrency(gross),
          paye: valueFunction(employee.takeHome / 100, gross),
          payeBreakdown: asPercentOf(employee.takeHome / 100, gross) + "%" +
            " net:&pound;"+formatCurrency(employee.takeHome / 100)+
            " ni:&pound;"+formatCurrency(employee.ni.total / 100)+
            " tax:&pound;"+formatCurrency(employee.incomeTax.total / 100),
          ltd: valueFunction(ltd, gross),
          ltdBreakdown: asPercentOf(ltd, gross) + "%" +
          " net:&pound;"+formatCurrency(ltd) +
          " salary:&pound;"+formatCurrency(tldCalc.takenAsSalary/100) +
          " dividend:&pound;"+formatCurrency(tldCalc.takenAsDividend/100),
          umbrella: valueFunction(umbrella, gross),
          umbrellaBreakdown: 
            asPercentOf(umbrella, gross) + "%" +
            " net:&pound;"+formatCurrency(umbrella)+
            " erNi:&pound;"+formatCurrency(umbrellaCalc.breakdown.employersNi/100)+
            " eeNi:&pound;"+formatCurrency(umbrellaCalc.breakdown.employeesNi/100)+
            " tax:&pound;"+formatCurrency(umbrellaCalc.breakdown.employeesTax/100),
        });
        if(gross === 1){gross = 0;}
      }
      
      return chartData;
    }

    return generateChartData;
  }
]);
