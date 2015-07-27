var chai = require('chai');
var calcLtd = require('../calc-ltd');
var calcPaye = require('../calc-paye');

chai.should();

if(false) describe('When calculating the tax when operating through a limited company', function () {
  it('the sum of the breakdown should total turnover', function () {
    var turnover = 12000000;
    var tax = calcLtd.calc(12000000);
    

    var bd = tax.companyBreakdown;
    turnover.should.equal(bd.overheads.total + bd.salaries.total + bd.corporationTax + bd.dispursable);

    //console.log(tax);
  })

  if(false) it('should be able to calculate being inside IR35', function (){
    var turnover = 12000000;
    var tax = calcLtd.calc(12000000, {salary: 12000000, overheads: 104*12*100});

    console.log(tax);
  });
});

if(false)describe('When calculating going through an Umbrella it', function (){
  var turnover = 12*8000*100;
  var tax = calcLtd.calcUmbrella(turnover, {umbrellaFixedFeePerMonth: 105*100, yearEnd: 2016});

  console.log(tax);



  it('should have employers NI of £875.90', function () {
    Math.floor(tax.breakdown.employersNi/12).should.equal(87590);
  });

  it('should have employees NI of £412.95', function () {
    Math.floor(tax.breakdown.employeesNi/12).should.equal(41295);
  });

  it('should have employees Tax of £1,944.58', function () {
    Math.floor(tax.breakdown.employeesTax/12).should.equal(194458);
  });

  it('should have total tax of £3,233.43', function () {
    Math.floor(tax.breakdown.totalTax/12).should.equal(323343);
  });

  it('should have an umbrella fee of £105.00', function () {
    Math.floor(tax.breakdown.umbrellaFee/12).should.equal(10500);
  });

  it('should have a net income of £4,661.72', function () {
    Math.floor(tax.breakdown.netIncome/12).should.equal(466172);
  });

});
