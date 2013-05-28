###
  commands module
  exports an array of possible Martian Robot commands
###


module.exports = [
                  {
                    name: 'gridSize'
                    reg: /^\d+ \d+$/
                    run: (command) ->
                      grid = command.match(this.reg)
                      grid = grid[0].split(' ')
                      x = parseInt(grid[0], 10)
                      y = parseInt(grid[1], 10)

                      # App.mars.resize(x, y);
                      "Mars x:#{x} y:#{y}"
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

                      # App.robot.makeNewRobot(x,y,orr)
                      "Robot created at x:#{x} y:#{y} orr:#{orr}"
                  },
                  {
                    name: 'moveRobot'
                    reg: /^[lrf]+$/i
                    run: (command) ->
                      # App.robot.moveRobot(command)
                      command
                  }
                ]
