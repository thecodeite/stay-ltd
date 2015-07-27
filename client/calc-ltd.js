(function(){


  if(typeof calcPaye === 'undefined') {
    if(typeof(require) === 'function') {
      calcPaye = require('./calc-paye.js');
    } else {
      console.error('Can`t import calc-paye');
    }
  }

  var exports = {
    calc: calc,
    calcUmbrella: calcUmbrella
  };

  if(typeof(module) !== 'undefined') {
    module.exports = exports;
  } else if(typeof(define) !== 'undefined') {
    define(exports);
  } else if(typeof(window) !== 'undefined') {
    window.calcLtd = exports;
  } else if(typeof(global) !== 'undefined') {
    global.calcLtd = exports;
  } else {
    console.log('No way to export my functionality!');
  }

  function calc(revenue, options) {
    var res = {};

    if(options === undefined) options = {};
    if(options.expences === undefined) options.expences = 0;//240000;
    if(options.costs === undefined) options.costs = 0;//240000;
    if(options.salary === undefined) options.salary = 583200;
    

    // split up income into three streams [salary, expences, dividends]
    var profit = revenue;

    var paiedAsCosts = Math.min(profit, options.costs);
    profit -=  paiedAsCosts;

    var takenAsExpences = Math.min(profit, options.expences);
    profit -=  takenAsExpences;

    var maxSalary = calcPaye.calcMaxSalary(profit, options);
    var takenAsSalary = Math.min(profit, options.salary, maxSalary);
    res.takenAsSalary = takenAsSalary;
    profit -= takenAsSalary;

    var employerNi = calcPaye.calcEmployerNi(takenAsSalary, options);

    profit -= employerNi.total;
    res.profit = profit;

    if(profit < 100){
      profit = 0;
    }

    var corpTax = profit * 0.2;
    res.dispursable = profit - corpTax;

    var takenAsDividend = res.dispursable;

    var incomeTax = calcPaye.calcIncomeTax(takenAsSalary, takenAsDividend, options);
    var employeeNi = calcPaye.calcEmployeeNi(takenAsSalary, options);
    //console.log(tax);

    res.personalTax =  incomeTax.totalPersonalTax;
    res.companyTaxes = {
      total: corpTax + employerNi.total,
      corpTax: corpTax,
      employerNi: employerNi.total
    };
    res.takeHome = incomeTax.takeHome + takenAsExpences - employeeNi.total;
    res.profit = profit;
    res.incomeTaxBreakdown = incomeTax;
    res.employeeNiBreakdown = employeeNi;
    res.companyBreakdown = {
      overheads: {
        costs: paiedAsCosts,
        expences: takenAsExpences,
        nationalInsurance: employerNi.total,
        total: paiedAsCosts + takenAsExpences + employerNi.total
      },
      salaries : {
        emplyees: [takenAsSalary],
        total: takenAsSalary
      },
      corporationTax: corpTax,
      dispursable: res.dispursable    
    }
    return res;
  }

  function calcUmbrella(revenue, options){
    var overhead = 0;
    var res = {
      breakdown: {
        employersNi: 0,
        employeesNi: 0,
        employeesTax: 0,
        totalTax: 0,
        umbrellaFee: 0,
        netIncome: 0
      }
    };

    if(options.umbrellaFixedFeePerWeek) {
      overhead += options.umbrellaFixedFeePerWeek * 52;
    }

    if(options.umbrellaFixedFeePerMonth) {
      overhead += options.umbrellaFixedFeePerMonth * 12;
    }

    var companyTax = calc(revenue, {
      costs: overhead,
      salary: Infinity,
    })

    res.companyTax = companyTax;

    res.breakdown.employersNi = companyTax.companyTaxes.employerNi;
    res.breakdown.employeesNi = companyTax.employeeNiBreakdown.total;
    res.breakdown.employeesTax = companyTax.incomeTaxBreakdown.totalPersonalTax;
    res.breakdown.totalTax = companyTax.companyTaxes.employerNi +
      companyTax.employeeNiBreakdown.total +
      companyTax.incomeTaxBreakdown.totalPersonalTax;
    res.breakdown.umbrellaFee = overhead;
    res.takeHome = res.breakdown.netIncome = revenue - overhead - res.breakdown.totalTax;

    return res;

  }
})();

