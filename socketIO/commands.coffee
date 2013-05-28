###
  commands module
  exports an array of all possible Martian Robot commands
  
  Classes:
  ========

  Mars

  Robot
###


class Mars
  constructor: (@x = 0, @y = 0)->
    return

  resize: (x,y) ->
    if x > 50 or y > 50 or x < 0 or y < 0
      throw "grid size was out of bounds"

    @x = x
    @y = y
    return

  offPlanet: (x,y) ->
    if @x is 0 and @y is 0
      throw 'no valid planet found'

    if x > @x or x < 0 or y > @y or y < 0
      return true
    else
      return false

mars = new Mars()


class Robot
  constructor: ->
    return

  make: (x,y,orr)->
    return "Robot created at x:#{x} y:#{y} orr:#{orr}"

  move: (commands)->
    return "Robot moved according to #{commands}"

robot = new Robot()


module.exports = [
                  {
                    name: 'gridSize'
                    reg: /^\d+ \d+$/
                    run: (command) ->
                      grid = command.match(this.reg)
                      grid = grid[0].split(' ')
                      x = parseInt(grid[0], 10)
                      y = parseInt(grid[1], 10)

                      mars.resize(x, y);  
                  },
                  {
                    name: 'newRobot'
                    reg: /^\d+\s\d+\s[NESW]$/i
                    run: (command) ->
                      newRobot = command.match(this.reg)
                      newRobot = newRobot[0].split(' ')
                      x = parseInt(newRobot[0], 10)
                      y = parseInt(newRobot[1], 10)
                      orr = newRobot[2]

                      robot.make(x,y,orr) 
                  },
                  {
                    name: 'moveRobot'
                    reg: /^[lrf]+$/i
                    run: (command) ->
                      robot.move(command)
                  }
                ]
