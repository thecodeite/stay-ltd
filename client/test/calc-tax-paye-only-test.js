var chai = require('chai');
var calcPaye = require('../calc-paye');
var JsonFormater = require('../JsonFormater');

chai.should();

if(false) describe('calc-paye in 2015-16', function () {

  describe('calcIncomeTax with only salary', function () {

    it('should give total tax as £0.00 for an income of £10,000.00', function () {
      var tax = calcPaye.calcIncomeTax(1000000);
      
      tax.totalPersonalTax.should.equal(0);
      tax.personalAllowance.should.equal(1060000);
      tax.bands.basicRateSalary.tax.should.equal(0);
      tax.bands.higherRateSalary.tax.should.equal(0);
      tax.bands.topRateSalary.tax.should.equal(0);
    });

    it('should give total tax as £2,080.00 for an income of £21,000.00', function () {
      var tax = calcPaye.calcIncomeTax(2100000);
      
      tax.totalPersonalTax.should.equal(208000);
      tax.personalAllowance.should.equal(1060000);
      tax.bands.basicRateSalary.tax.should.equal(208000);
      tax.bands.higherRateSalary.tax.should.equal(0);
      tax.bands.topRateSalary.tax.should.equal(0);
    });

    it('should give total tax as £9,403.00 for an income of £50,000.00', function () {
      var tax = calcPaye.calcIncomeTax(5000000);
      
      tax.totalPersonalTax.should.equal(940300);
      tax.personalAllowance.should.equal(1060000);
      tax.bands.basicRateSalary.tax.should.equal(635700);
      tax.bands.higherRateSalary.tax.should.equal(304600);
      tax.bands.topRateSalary.tax.should.equal(0);
    });

    it('should give total tax as £29,403.00 for an income of £100,000.00', function () {
      var tax = calcPaye.calcIncomeTax(10000000);
      
      tax.totalPersonalTax.should.equal(2940300);
      tax.personalAllowance.should.equal(1060000);
      tax.bands.basicRateSalary.tax.should.equal(635700);
      tax.bands.higherRateSalary.tax.should.equal(2304600);
      tax.bands.topRateSalary.tax.should.equal(0);
    });

    it('should give total tax as £35,403.00 for an income of £110,000.00', function () {
      var tax = calcPaye.calcIncomeTax(11000000);
      
      tax.totalPersonalTax.should.equal(3540300);
      tax.personalAllowance.should.equal(560000);
      tax.bands.basicRateSalary.tax.should.equal(635700);
      tax.bands.higherRateSalary.tax.should.equal(2904600);
      tax.bands.topRateSalary.tax.should.equal(0);
    });

    it('should give total tax as £42,123.00 for an income of £121,200.00', function () {
      var tax = calcPaye.calcIncomeTax(12120000);
      
      tax.totalPersonalTax.should.equal(4212300);
      tax.personalAllowance.should.equal(0);
      tax.bands.basicRateSalary.tax.should.equal(635700);
      tax.bands.higherRateSalary.tax.should.equal(3576600);
      tax.bands.topRateSalary.tax.should.equal(0);
    });

    it('should give total tax as £53,643 for an income of £150,000.00', function () {
      var tax = calcPaye.calcIncomeTax(15000000);
      
      tax.totalPersonalTax.should.equal(5364300);
      tax.personalAllowance.should.equal(0);
      tax.bands.basicRateSalary.tax.should.equal(635700);
      tax.bands.higherRateSalary.tax.should.equal(4728600);
      tax.bands.topRateSalary.tax.should.equal(0);
    });

    it('should give total tax as £53,643 for an income of £200,000.00', function () {
      var tax = calcPaye.calcIncomeTax(20000000);
      
      tax.totalPersonalTax.should.equal(7614300);
      tax.personalAllowance.should.equal(0);
      tax.bands.basicRateSalary.tax.should.equal(635700);
      tax.bands.higherRateSalary.tax.should.equal(4728600);
      tax.bands.topRateSalary.tax.should.equal(2250000);
    });
  });

  describe('calcIncomeTax with salary + dividends', function () {

    if(false)it('should give total tax as £0.00 for an income of £10,000.00 and net dividends of £10,000.00', function () {
      var tax = calcPaye.calcIncomeTax(1000000, 1000000);
      
      tax.totalPersonalTax.should.equal(0);
      tax.personalAllowance.should.equal(1060000);
    });


    if(false)it('should give total tax as £0.00 for an income of £10,060.00 and net dividends of £20,325.00', function () {
      var tax = calcPaye.calcIncomeTax(1006000, 2032500);
      
      tax.totalPersonalTax.should.equal(0);
      tax.personalAllowance.should.equal(1060000);
    });
  });

/*
    it('should give total tax as £2,080.00 for an income of £21,000.00', function () {
      var tax = calcPaye.calcIncomeTax(2100000);
      
      tax.totalPersonalTax.should.equal(208000);
      tax.personalAllowance.should.equal(1060000);
      tax.bands.basicRateSalary.tax.should.equal(208000);
      tax.bands.higherRateSalary.tax.should.equal(0);
      tax.bands.topRateSalary.tax.should.equal(0);
    });

    it('should give total tax as £9,403.00 for an income of £50,000.00', function () {
      var tax = calcPaye.calcIncomeTax(5000000);
      
      tax.totalPersonalTax.should.equal(940300);
      tax.personalAllowance.should.equal(1060000);
      tax.bands.basicRateSalary.tax.should.equal(635700);
      tax.bands.higherRateSalary.tax.should.equal(304600);
      tax.bands.topRateSalary.tax.should.equal(0);
    });

    it('should give total tax as £29,403.00 for an income of £100,000.00', function () {
      var tax = calcPaye.calcIncomeTax(10000000);
      
      tax.totalPersonalTax.should.equal(2940300);
      tax.personalAllowance.should.equal(1060000);
      tax.bands.basicRateSalary.tax.should.equal(635700);
      tax.bands.higherRateSalary.tax.should.equal(2304600);
      tax.bands.topRateSalary.tax.should.equal(0);
    });

    it('should give total tax as £35,403.00 for an income of £110,000.00', function () {
      var tax = calcPaye.calcIncomeTax(11000000);
      
      tax.totalPersonalTax.should.equal(3540300);
      tax.personalAllowance.should.equal(560000);
      tax.bands.basicRateSalary.tax.should.equal(635700);
      tax.bands.higherRateSalary.tax.should.equal(2904600);
      tax.bands.topRateSalary.tax.should.equal(0);
    });

    it('should give total tax as £42,123.00 for an income of £121,200.00', function () {
      var tax = calcPaye.calcIncomeTax(12120000);
      
      tax.totalPersonalTax.should.equal(4212300);
      tax.personalAllowance.should.equal(0);
      tax.bands.basicRateSalary.tax.should.equal(635700);
      tax.bands.higherRateSalary.tax.should.equal(3576600);
      tax.bands.topRateSalary.tax.should.equal(0);
    });

    it('should give total tax as £53,643 for an income of £150,000.00', function () {
      var tax = calcPaye.calcIncomeTax(15000000);
      
      tax.totalPersonalTax.should.equal(5364300);
      tax.personalAllowance.should.equal(0);
      tax.bands.basicRateSalary.tax.should.equal(635700);
      tax.bands.higherRateSalary.tax.should.equal(4728600);
      tax.bands.topRateSalary.tax.should.equal(0);
    });

    it('should give total tax as £53,643 for an income of £200,000.00', function () {
      var tax = calcPaye.calcIncomeTax(20000000);
      
      tax.totalPersonalTax.should.equal(7614300);
      tax.personalAllowance.should.equal(0);
      tax.bands.basicRateSalary.tax.should.equal(635700);
      tax.bands.higherRateSalary.tax.should.equal(4728600);
      tax.bands.topRateSalary.tax.should.equal(2250000);
    });
  */

  if(false) describe('calcEmployeeNi', function () {
    it('should give total employee NI as £0.00 for an income of £4,000.00', function () {

      var tax = calcPaye.calcEmployeeNi(400000);
      
      tax.totalPersonalTax.should.equal(0);
      tax.twelveRateTax.tax.should.equal(0);
      tax.twoTax.tax.should.equal(0);
    });

    it('should give total employee NI as £0.00 for an income of £8,060.00', function () {

      var tax = calcPaye.calcEmployeeNi(806000);
      
      tax.totalPersonalTax.should.equal(0);
      tax.twelveRateTax.tax.should.equal(0);
      tax.twoTax.tax.should.equal(0);
    });

    it('should give total employee NI as £232.80 for an income of £10,000.00', function () {

      var tax = calcPaye.calcEmployeeNi(1000000);
      
      tax.totalPersonalTax.should.equal(23232);
      tax.twelveRateTax.amount.should.equal(193600);
      tax.twelveRateTax.tax.should.equal(23232);
      tax.twoTax.tax.should.equal(0);
    });

    it('should give total employee NI as £4,118.40 for an income of £42,384.00', function () {

      var tax = calcPaye.calcEmployeeNi(4238400);
      
      tax.totalPersonalTax.should.equal(411840);
      tax.twelveRateTax.amount.should.equal(3432000);
      tax.twelveRateTax.tax.should.equal(411840);
      tax.twoTax.tax.should.equal(0);
    });

    it('should give total employee NI as £4,470.72 for an income of £60,000.00', function () {

      var tax = calcPaye.calcEmployeeNi(6000000);

      tax.totalPersonalTax.should.equal(447072);
      tax.twelveRateTax.amount.should.equal(3432000);
      tax.twelveRateTax.tax.should.equal(411840);
      tax.twoTax.amount.should.equal(1761600);
      tax.twoTax.tax.should.equal(35232);
    });
  });

  if(false) describe('calcEmployerNi', function () {
    it('should give total employer NI as £0.00 for an income of £4,000.00', function () {

      var tax = calcPaye.calcEmployerNi(400000);
      
      tax.totalPersonalTax.should.equal(0);
    });

    it('should give total employer NI as £0.00 for an income of £8,112.00', function () {

      var tax = calcPaye.calcEmployerNi(811200);
      
      tax.totalPersonalTax.should.equal(0);
    });

    it('should give total employer NI as £232.80 for an income of £12,000.00', function () {

      var tax = calcPaye.calcEmployerNi(1200000);
      
      tax.totalPersonalTax.should.equal(53652);
    });
  });

  if(false) describe('calcTax', function() {
    it('should match FreeAgent', function () {

      var tax = calcPaye.calcTax(1200000, 7351040);
      
      var jf = new JsonFormater();
      console.log(jf.format(tax));
    });
  });
});

if(false) describe('Calculating maximum salary', function(){
  it('should equal profit when profit equal or less than £7,956', function() {
    calcPaye.calcMaxSalary(750000).should.equal(750000);
    calcPaye.calcMaxSalary(795600).should.equal(795600);
  });

  describe('should equal employers ni when profit is greater than £8,064, like:', function() {
    var testData = [1000000, 2000000, 10000000];

    testData.forEach(function(data){
      it('£'+data, function(){
        var profit = data;
        var maxSalary = calcPaye.calcMaxSalary(profit);
        var emplyersNi = calcPaye.calcEmployerNi(maxSalary).total;

        console.log('maxSalary:', maxSalary, 'emplyersNi:', emplyersNi);

        Math.round((maxSalary+emplyersNi)/100).should.equal(profit/100);
      })
    });

    
  });
});