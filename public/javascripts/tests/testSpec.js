/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *
 *  Test mission with Jasmine
 *
 */


describe("MartianRobot", function() {

  describe("run test mission", function() {
    var testMission = "5 3\n1 1 E\nrfrfrfrf\n\n3 2 N\nfrrfllffrrfll\n\n0 3 W\nllfffLflfl",
        output = '<div>1 1 E</div><div>3 3 N LOST</div><div>2 3 S</div>';

    beforeEach(function() {
      $('textarea').val(testMission);
      $('input:submit').submit();
    });

    it("should output the final state of the three robots", function() {
      expect($('.outputHistory').html()).toBe(output);
    });
  });
});