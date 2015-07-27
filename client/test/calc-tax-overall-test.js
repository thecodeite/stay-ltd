var chai = require('chai');
var calcPaye = require('../calc-paye');
var JsonFormater = require('../JsonFormater');

chai.should();

describe('Calculating overall tax', function () {

  describe('match ContractCalculator results', function(){
    describe('year 2015/16', function(){
      var tax = calcPaye.calcIncomeTax(8000*100, 79200*100, {yearEnd: 2016});

      console.log(tax);

       it('should have a take home of £75,136', function(){
        Math.floor(tax.takeHome/100).should.equal(75136);
      });
    });
  });

  if(false) describe('match FreeAgent results', function(){
    if(false) describe('year 2015/16', function(){
      var tax = calcPaye.calcIncomeTax(1200000, 4700000, {yearEnd: 2016});
      //console.log(tax);

      it('should have a total intome of £64,222.00', function(){
        tax.grossTaxableIncome.should.equal(6422200);
      });

      it('should have a personal allowance of £10,000.00', function(){
        tax.personalAllowance.should.equal(1000000);
      });

      it('should pay 20% on £2000 of salary totalling £400', function(){
        tax.bands.basicRateSalary.amount.should.equal(200000);
        tax.bands.basicRateSalary.tax.should.equal(40000);
      });

      it('should pay 10% on £29,865 of dividends totalling 2986.50', function(){
        tax.bands.basicRateDividend.amount.should.equal(2986500);
        tax.bands.basicRateDividend.tax.should.equal(298650);
      });
   
      it('should pay 32.5% on £22,357 of dividends totalling £7266.02', function(){
        tax.bands.higherRateDividend.amount.should.equal(2235700);
        tax.bands.higherRateDividend.tax.should.equal(726602);
      });

      it('should have a dividend tax credit of £5,222.20 applied', function() {
        tax.dividendTaxCredit.should.equal(522220);
      });

      it('should have a total tax due of £5,430.32', function() {
        tax.totalPersonalTax.should.equal(543032);
      });
    });

     describe('year 2014/15', function(){
      var tax = calcPaye.calcIncomeTax(1200000, 4700000, {yearEnd: 2015});
      //console.log(tax);

      it('should have a total intome of £64,222.00', function(){
        tax.grossTaxableIncome.should.equal(6422200);
      });

      it('should have a personal allowance of £10,000.00', function(){
        tax.personalAllowance.should.equal(1000000);
      });

      it('should pay 20% on £2000 of salary totalling £400', function(){
        tax.bands.basicRateSalary.amount.should.equal(200000);
        tax.bands.basicRateSalary.tax.should.equal(40000);
      });

      it('should pay 10% on £29,865 of dividends totalling 2986.50', function(){
        tax.bands.basicRateDividend.amount.should.equal(2986500);
        tax.bands.basicRateDividend.tax.should.equal(298650);
      });
   
      it('should pay 32.5% on £22,357 of dividends totalling £7266.02', function(){
        tax.bands.higherRateDividend.amount.should.equal(2235700);
        tax.bands.higherRateDividend.tax.should.equal(726602);
      });

      it('should have a dividend tax credit of £5,222.20 applied', function() {
        tax.dividendTaxCredit.should.equal(522220);
      });

      it('should have a total tax due of £5,430.32', function() {
        tax.totalPersonalTax.should.equal(543032);
      });
    });

    describe('year 2013/14 with a salary of £12,000 and dividends of £32,000', function(){
      var tax = calcPaye.calcIncomeTax(1200000, 3200000, {yearEnd: 2014});
      //console.log(tax);

      it('should have a total intome of £47,555.00', function(){
        tax.grossTaxableIncome.should.equal(4755500);
      });

      it('should have a personal allowance of £9,440.00', function(){
        tax.personalAllowance.should.equal(944000);
      });

      it('should pay 20% on £2,560.00 of salary totalling £512.00', function(){
        tax.bands.basicRateSalary.amount.should.equal(256000);
        tax.bands.basicRateSalary.tax.should.equal(51200);
      });

      it('should pay 10% on £29,450.00 of dividends totalling £2,945.00', function(){
        tax.bands.basicRateDividend.amount.should.equal(2945000);
        tax.bands.basicRateDividend.tax.should.equal(294500);
      });
   
      it('should pay 32.5% on £6,105.00 of dividends totalling £1,984.12', function(){
        tax.bands.higherRateDividend.amount.should.equal(610500);
        tax.bands.higherRateDividend.tax.should.equal(198412);
      });

      it('should have a dividend tax credit of £3,555.50 applied', function() {
        tax.dividendTaxCredit.should.equal(355550);
      });

      it('should have a total tax due of £1,885.62', function() {
        tax.totalPersonalTax.should.equal(188562);
      });
    });
  });
});