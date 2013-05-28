###
  Set-up socketIO and listen to Mars lander's instructions
###


module.exports = (app, server) ->

  # get modules
  io = require('socket.io').listen(server)
  commands = require('./commands')


  # update settings
  unless app.settings.socketIO
    app.set 'socketIO', io

  # heroku settings
  io.configure () ->
    io.set "transports", ["xhr-polling"]
    io.set "polling duration", 10


  # log all new connections
  io.sockets.on 'connection', (client) ->

    client.on 'join', (nickname) ->
      client.set 'nickname', nickname
      console.log("CONNECTED: #{nickname}")

      client.emit('welcome', { message: 'Mars Lander is idle...' });


    client.on 'commands', (data) ->
      console.log "parsing commands: #{data}"

      inputs = data.split('\n')

      # command logic
      try
        for input in inputs
          processed = false

          # skip the empty string
          continue unless input

          # go through all the commands and run it if applicable
          for command in commands
            if command.reg.test(input)
              output = command.run(input)
              client.emit('output', message: output) if output
              processed = true
              break

          if not processed
            throw 'no matching command'

      catch error
        console.log "ERROR: #{error}"
        client.emit('error', { message: error });
        return
