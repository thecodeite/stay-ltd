(function() {

  var exports = {
    calcPaye: calcPaye,
    calcIncomeTax: calcIncomeTax,
    calcEmployeeNi: calcEmployeeNi,
    calcEmployerNi: calcEmployerNi,
    calcMaxSalary: calcMaxSalary,
    calcPersonalAllowance: calcPersonalAllowance,
    breakdown: breakdown
  };

  if(typeof(module) !== 'undefined') {
    module.exports = exports;
  } else if(typeof(define) !== 'undefined') {
    define(exports);
  } else if(typeof(window) !== 'undefined') {
    window.calcPaye = exports;
  } else if(typeof(global) !== 'undefined') {
    global.calcPaye = exports;
  } else {
    console.log('No way to export my functionality!');
  }


  var allRates = {
    2014: {
      basicRate:      20, //%
      higherRate:     40, //%
      topRate:        45, //%

      divOrdinaryRate:   10,   //%
      divUpperRate:      32.5,  //%
      divAdditionalRate: 37.5,  //%

      basicBandLimit:  32010*100,  //£
      higherBandLimit: 150000*100, //£

      dividendAllowance: 0, //£
      dividendTaxCredit: 10,
      personalAllowance: 9440*100, //£

      employerNi:{
        freeRateLimit: 64100, //£ per month
        nonFreeRate: 13.8 //%
      },

      employeeNi: {
        primaryThresholdMonthly: 64600, //p
        upperEarningsLimit: 345400, //p

        primaryRate: 12, //%
        upperEarningsRate: 2 //%
      }
    }, 
    2015: {
      basicRate:      20, //%
      higherRate:     40, //%
      topRate:        45, //%

      divOrdinaryRate:   10,   //%
      divUpperRate:      32.5,  //%
      divAdditionalRate: 37.5,  //%

      basicBandLimit:  31865*100,  //£
      higherBandLimit: 150000*100, //£

      dividendAllowance: 0, //£
      dividendTaxCredit: 10,
      personalAllowance: 10000*100, //£

      employerNi:{
        freeRateLimit: 66300, //£ per month
        nonFreeRate: 13.8 //%
      },

      employeeNi: {
        primaryThresholdMonthly: 66300,
        upperEarningsLimit: 348900,

        primaryRate: 12, //%
        upperEarningsRate: 2 //%
      }
    },
    2016: {
      basicRate:      20, //%
      higherRate:     40, //%
      topRate:        45, //%

      divOrdinaryRate:   10,   //%
      divUpperRate:      32.5,   //%
      divAdditionalRate: 37.5,   //%

      basicBandLimit:  31785*100,  //£
      higherBandLimit: 150000*100, //£

      dividendAllowance: 0, //£
      dividendTaxCredit: 10,
      personalAllowance: 10600*100, //£

      employerNi:{
        freeRateLimit: 67600, //£ per month
        nonFreeRate: 13.8 //%
      },

      employeeNi: {
        primaryThresholdMonthly: 67200,
        upperEarningsLimit: 353200,

        primaryRate: 12, //%
        upperEarningsRate: 2 //%
      }

    },
    2017: {
      basicRate:      20, //%
      higherRate:     40, //%
      topRate:        45, //%

      divOrdinaryRate:   7.5,   //%
      divUpperRate:      32.5,   //%
      divAdditionalRate: 38.1,   //%

      basicBandLimit:  31785*100,  //£
      higherBandLimit: 150000*100, //£

      dividendAllowance: 5000*100, //£
      dividendTaxCredit: 0,
      personalAllowance: 10600*100, //£

      employerNi:{
        freeRateLimit: 67600, //£ per month
        nonFreeRate: 13.8 //%
      },

      employeeNi: {
        primaryThresholdMonthly: 67200,
        upperEarningsLimit: 353200,

        primaryRate: 12, //%
        upperEarningsRate: 2 //%
      }

    }
  };

  function defaultOptions(options) {
    if (options === undefined) options = {};
    if (options.yearEnd === undefined) options.yearEnd = 2016;

    return options;
  }

  function minZero(x) {
    return x < 0 ? 0 : x;
  }


  function calcIncomeTax(salaryIncome, dividendIncome, options) {
    options = defaultOptions(options);
    if(dividendIncome === undefined) dividendIncome = 0;

    var tax = {
      bands: {
        basicRateSalary: {},
        higherRateSalary: {},
        topRateSalary: {},

        basicRateDividend: {},
        higherRateDividend: {},
        topRateDividend: {}


      }
    };

    var rates = allRates[options.yearEnd];

    var effectiveDividend = dividendIncome - rates.dividendAllowance;
    effectiveDividend = (effectiveDividend*100)/(100-rates.dividendTaxCredit);
    effectiveDividend = Math.floor(effectiveDividend/100)*100;

    tax.grossTaxableIncome = effectiveDividend + salaryIncome;

    tax.personalAllowance = calcPersonalAllowance(tax.grossTaxableIncome, options);  

    var higherLimit = rates.higherBandLimit - tax.personalAllowance - rates.basicBandLimit;
    var bands = [tax.personalAllowance, rates.basicBandLimit, higherLimit];
    var bd = breakdown(salaryIncome, bands);

    var personalAllowanceLeft = tax.personalAllowance;
    var basicRateLeft = rates.basicBandLimit;
    var higherRateLeft = rates.basicBandLimit;
     
    tax.bands.basicRateSalary.amount = bd[1];
    tax.bands.higherRateSalary.amount = bd[2];
    tax.bands.topRateSalary.amount = bd[3];

    tax.bands.basicRateSalary.tax = Math.floor((tax.bands.basicRateSalary.amount  * rates.basicRate)/100);
    tax.bands.higherRateSalary.tax = Math.floor((tax.bands.higherRateSalary.amount  * rates.higherRate)/100);
    tax.bands.topRateSalary.tax = Math.floor((tax.bands.topRateSalary.amount  * rates.topRate)/100);
    tax.incomeTax = tax.bands.basicRateSalary.tax
      + tax.bands.higherRateSalary.tax
      + tax.bands.topRateSalary.tax

    var bd2 = breakdown(tax.grossTaxableIncome, bands);
    var bd3 = subtractBreakdown(bd2, bd);
    //console.log('bd', salaryIncome, bd);
    //console.log('bd2', tax.grossTaxableIncome, bd2);
    //console.log('bd3', effectiveDividend, bd3);

    tax.bands.basicRateDividend.amount = bd3[1];
    tax.bands.higherRateDividend.amount = bd3[2];
    tax.bands.topRateDividend.amount = bd3[3];



    tax.bands.basicRateDividend.tax = Math.floor((tax.bands.basicRateDividend.amount  * rates.divOrdinaryRate)/100);
    tax.bands.higherRateDividend.tax = Math.floor((tax.bands.higherRateDividend.amount  * rates.divUpperRate)/100);
    tax.bands.topRateDividend.tax = Math.floor((tax.bands.topRateDividend.amount  * rates.divAdditionalRate)/100);
    
    tax.dividendTaxCredit = Math.floor(((effectiveDividend-bd3[0]) * rates.dividendTaxCredit)/100);
    //console.log('tax.dividendTaxCredit', tax.dividendTaxCredit);
    tax.dividendTax = 
      tax.bands.basicRateDividend.tax
      + tax.bands.higherRateDividend.tax
      + tax.bands.topRateDividend.tax
      - tax.dividendTaxCredit;
  /*
    
    var bands = [personalAllowance, rates.basicBandLimit, higherLimit];
    var bd = breakdown(totalEarnings, bands);

    var ordinaryRate = bd[1] * (rates.divOrdinaryRate - rates.divOrdinaryRate);
    var higherRate = bd[2] * (rates.divUpperRate - rates.divOrdinaryRate);
    var topRate = bd[3] * (rates.divAdditionalRate - rates.divOrdinaryRate);
  */
    
    tax.totalPersonalTax = Math.floor(tax.incomeTax + tax.dividendTax);
    tax.takeHome = salaryIncome + dividendIncome - tax.totalPersonalTax;
      //+ ordinaryRateDiv
      //+ higherRateDiv
      //+ topRateDiv
      ;

      //console.log(tax);
    return tax;
      //preTaxIncome: payeIncome + dividendIncome,
      //takeHome: payeIncome + dividendIncome - totalPersonalTax,
      //breakdown : {
      //  paye: payeTax,
      //  dividend: {
      //    basicRate: {amount: bd[1], tax: 0},
      //    higherRate: {amount: bd[2], tax: higherRate},
      //    topRate: {amount: bd[3], tax: topRate},
      //  }
      //}
      //};
  }

  function calcPaye(annualIncome, options) {

    var incomeTax = calcIncomeTax(annualIncome);
    var employeeNi = calcEmployeeNi(annualIncome);
    var employerNi = calcEmployerNi(annualIncome);

    //console.log('incomeTax', incomeTax);
    //console.log('employeeNi', employeeNi);
    //console.log('employerNi', employerNi);

    var totalTax = incomeTax.total + employeeNi.total + employerNi.total;
    var takeHome = annualIncome - totalTax;

    return {
      annualIncome: annualIncome,
      takeHome: takeHome,
      totalTax: totalTax,
      taxBreakdown: {
        incomeTax: incomeTax,
        employeeNi : employeeNi,
        employerNi : employerNi
      }
    };
  }

  function calcPersonalAllowance(annualIncome, options) {
    options = defaultOptions(options);

    var personalAllowance = allRates[options.yearEnd].personalAllowance;

    if(annualIncome > 10000000) {
      if(annualIncome > 12120000) {
        personalAllowance = 0;
      } else {
        personalAllowance -= (annualIncome - 10000000)/2;
      }
    }
    return personalAllowance;
  }

  function numbersToBands(numbers) {
    var bands = [];
    var prev;

    number.forEach(function (num) {
      if(prev !== undefined) {
        bands.push(num - prev);
      }
      prev = num;
    });
    return bands;
  }

  function breakdown(total, bands) {
    var res = [];

    bands.forEach(function (b) {
      var allocation = Math.min(total, b);
      res.push(allocation);
      total -= allocation;
    });

    res.push(total);

    return res;
  }

  function subtractBreakdown(intial, sub) {
    var res = [];
    for(var i=0; i<intial.length; i++) {
      res[i] = intial[i] - (sub[i] || 0);
    }
    return res;
  }

  function calcIncomeTaxOld(annualIncome) {

    var personalAllowance = calcPersonalAllowance(annualIncome);
    var basicLimit = 31785 * 100;
    var higherLimit = (150000 * 100) - personalAllowance - basicLimit;
  /*
    var inPersonalAllowance = Math.min(personalAllowance, annualIncome);
    var leftToTax = annualIncome - inPersonalAllowance;

    var atBasicRate = Math.min(3178500, leftToTax);
    leftToTax = leftToTax - atBasicRate;

    var atHigherRate = Math.min(15000000-3178500, leftToTax);
    var atTopRate  = leftToTax - atHigherRate;
  */
    var bands = [personalAllowance, basicLimit, higherLimit];
    var bd = breakdown(annualIncome, bands);
    //console.log(bd);
    
    var atBasicRate = bd[1];
    var atHigherRate = bd[2];
    var atTopRate = bd[3];

    var basicTax = atBasicRate * 0.2;
    var higherTax = atHigherRate * 0.4;
    var topTax = atTopRate * 0.45;

    return {
      total : basicTax + higherTax + topTax,
      personalAllowance: personalAllowance,
      basicTax: {amount: atBasicRate, tax:basicTax},
      higherTax: {amount: atHigherRate, tax:higherTax},
      topTax: {amount: atTopRate, tax:topTax}
    };
  }

  function calcEmployeeNi(annualIncome, options) {
    options = defaultOptions(options);
    var rates = allRates[options.yearEnd].employeeNi;

    // free rate < £8,060 (672 /m)
    // 12% rate £8,060 - £42,380
    // 2% rate > £42,380
    var r = function (x) {return Math.round(x);};
    var monthlyIncome = annualIncome/12;

    var twelveRate = rates.primaryThresholdMonthly;// 806000;//(15500/7)*365;
    var twoRate = rates.upperEarningsLimit - twelveRate;// 4238000;//(81500/7)*365;

    //var atTwelvePercent = Math.min(Math.max(0, monthlyIncome - twelveRate), twoRate-twelveRate);
    //var atTwoPercent = Math.max(0, monthlyIncome - twoRate);

    var bands = [twelveRate, twoRate];
    var bd = breakdown(monthlyIncome, bands);

    var atTwelvePercent = bd[1];
    var atTwoPercent = bd[2];

    var twelveTax = r(atTwelvePercent * (rates.primaryRate/100));
    var twoTax = r(atTwoPercent * (rates.upperEarningsRate/100));

    return {
      total : r(twelveTax + twoTax)*12,
      twelveRateTax: {amount: r(atTwelvePercent*12), tax:r(twelveTax*12)},
      twoTax: {amount: r(atTwoPercent*12), tax:r(twoTax*12)}
    };
  }

  function calcEmployerNi(annualIncome, options) {
    options = defaultOptions(options);
    var rates = allRates[options.yearEnd].employerNi;


    // free rate < £8,112 (£676/m)
    // 13.8% rate  > £8,112 (£676/m)
    var r = function (x) {return Math.round(x);};
    var monthlyIncome = annualIncome/12;
    //console.log('monthlyIncome', monthlyIncome);


    var atPayRate = Math.max(0, monthlyIncome - rates.freeRateLimit);

    //console.log('atPayRate', atPayRate);

    var tax = r(atPayRate * (rates.nonFreeRate/100)); //

    return {
      total : r(tax)*12,
      payRateTax: {amount: r(atPayRate*12), tax: r(tax*12)}
    };
  }

  function calcMaxSalary(profit, options) {
    options = defaultOptions(options);
    var rates = allRates[options.yearEnd].employerNi;
    //console.log('rates', rates);

    // Max salary is the max salary that can be paid, given a profix

    var profitPerMonth = profit / 12;

    var taxableProfit = profitPerMonth - rates.freeRateLimit;

    if(taxableProfit < 0) {
      return profit;
    }

    var taxableSalaryPerMonth = taxableProfit / (1+(rates.nonFreeRate/100));

    return Math.round((taxableSalaryPerMonth + rates.freeRateLimit) * 12);

    // profit = salary + ni
    // ni = salary * 0.12
    // profit = salary + (salary * 0.12)
    // profit = salary * 1.12
    // salary = proit / 1.12;
  }
})();
