var expect = require('chai').expect;

function hiHello(hello) {
  return new Promise(function(resolve, reject) {
    var newHello = hello + ' nothing';
    resolve(newHello);
  });
}

function thisIsTest() {
  return new Promise(function(resolve, reject) {
    var hello = 'test';
    resolve(hello);
  });
}

function callTest() {
  thisIsTest().then(function(hello) {
    return hiHello(hello);
  }).then(function(newHello) {
    console.log(newHello);
  });
}

describe('When creating the hiHello string', function() {
  describe('And the function thisIsTest is called', function() {
    it('should return the value test', function() {
      return thisIsTest().then(function(result) {
        expect(result).to.equal('test');
      });
    });
  });

  describe('And the function hiHello is called', function() {
    it('should return the value test nothing', function() {
      return hiHello('test').then(function(result) {
        expect(result).to.equal('test nothing');
      });
    });
  });
});
