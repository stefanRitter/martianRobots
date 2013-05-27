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

  var testMission = "5 3\n1 1 E\nrfrfrfrf\n\n3 2 N\nfrrfllffrrfll\n\n0 3 W\nllfffLflfl",
      output = '<div>1 1 E</div><div>3 3 N LOST</div><div>2 3 S</div>';

  describe("run test mission: " + testMission, function() {

    beforeEach(function() {
      $('textarea').val(testMission);
      $('input:submit').submit();
      $('textarea').val(testMission);  // put mission back after deletion
    });

    it("should output the correct final state of the three robots", function() {
      expect($('.outputHistory').html()).toBe(output);
    });
  });


  describe('testing command exceptions', function() {

    beforeEach(function() {
      $('audio')[0].volume = 0;  // turn HAL's audio off
    });

    afterEach(function() {
      HAL9000.reset();  // remove error message
    });

    it("should throw an exception if planet is not set yet", function() {
      App.mars.x = App.mars.y = 0;

      expect(function() {
        App.robot.makeNewRobot('1 1 E');
      }).toThrow('no valid planet found');
    });

    it("should throw an exception if robot missed the planet", function() {
      expect(function() {
        App.mars.resize(30, 20);
        App.robot.makeNewRobot(40, 4, 'E');
      }).toThrow('your robot missed the planet');
    });

    it("should throw an exception if planet size is out of bounds (<0)", function() {
      expect(function() {
        App.mars.resize(5, -20);
      }).toThrow('grid size was out of bounds');
    });

    it("should throw an exception if planet size is out of bounds (>50)", function() {
      expect(function() {
        App.mars.resize(54, 20);
      }).toThrow('grid size was out of bounds');
    });
  });
});
