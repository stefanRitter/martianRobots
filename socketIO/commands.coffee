###
  commands module
  exports an array of all possible Martian Robot commands
  
  Classes:
  ========

  Mars:
    resize(x,y)
    offPlanet(x,y): true when coords are off planet

  Robot
    move(commands): returns final robot position
    make(x,y,orr): makes a new robot
    revert(): checks if this robot is trying to go off planet
###



class Mars
  constructor: (@x = 0, @y = 0)->
    return

  resize: (x,y) ->
    if x > 50 or y > 50 or x < 0 or y < 0
      throw "grid size was out of bounds"

    @x = x
    @y = y
    robot.needsReset = true
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
  constructor: (@x = 0, @y = 0)->
    @orientation = ['N', 'E', 'S', 'W']
    @moveFunc = [
      (that)->
        that.y+=1
      , (that)->
        that.x+=1
      , (that)->
        that.y-=1
      , (that)->
        that.x-=1
      ]
    @oldX = 0
    @oldY = 0
    @noGoCoords = []
    @currOrient = 0
    @needsReset = true

  make: (x,y,orr)->
    if mars.offPlanet(x,y)
      throw 'your robot missed the planet'

    @x = x
    @y = y
    @currOrient = @orientation.indexOf(orr)
    @needsReset = false
    return

  revert: ()->
    for noGo in @noGoCoords
      # check if a robot has been lost here before
      if @oldX is noGo.x and @oldY is noGo.y and @currOrient is noGo.orr
        @x = @oldX
        @y = @oldY
        return true
    return false

  move: (commands)->
    if @needsReset
      throw 'no new robot'

    commands = commands.toUpperCase()
    commList = commands.split('')

    for command in commList
      switch command
        when 'L'
          @currOrient-= 1
          @currOrient = 3 if @currOrient < 0

        when 'R'
          @currOrient+= 1
          @currOrient = 0 if @currOrient > 3

        when 'F'
          @oldX = @x
          @oldY = @y

          # call the move function appropriate for the current orientation
          @moveFunc[@currOrient](@)

          # revert to old location if we know this is a dead end
          unless @.revert()
            # check if robot is lost
            if mars.offPlanet(@x, @y)
              # this robot just died
              @noGoCoords.push { x: @oldX, y: @oldY, orr: @currOrient }
              @needsReset = true
              return "#{@oldX} #{@oldY} #{@orientation[@currOrient]} LOST"

        else
          throw 'unrecognised command in Robot.move'

    return "#{@x} #{@y} #{@orientation[@currOrient]}"

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
