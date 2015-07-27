var chai = require('chai');
var calcPaye = require('../calc-paye');
var JsonFormater = require('../JsonFormater');

chai.should();

if(false) describe('PAYE Tax helpers', function () {

  describe('breakdown', function () {
    describe('two bands', function () {
      it('should allocate all to first band if ammount is less', function (){
        var res = calcPaye.breakdown(500, [1000]);
        res.should.eql([500, 0]);
      });

      it('should fill first allocation and put rest in second', function (){
        var res = calcPaye.breakdown(1200, [1000]);
        res.should.eql([1000, 200]);
      });
    });

    describe('three bands', function () {

      it('should fill first allocation and put rest in second and leave third empty', function (){
        var res = calcPaye.breakdown(1200, [1000, 500]);
        res.should.eql([1000, 200, 0]);
      });

      it('should fill first two allocations and put rest in thrid', function (){
        var res = calcPaye.breakdown(2200, [1000, 500]);
        res.should.eql([1000, 500, 700]);
      });
    });
  });
});