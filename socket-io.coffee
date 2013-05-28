###
  Setup socketIO and listen to mars lander's instructions
###

module.exports = (app, server) ->

  io = require('socket.io').listen(server)

  # update settings
  unless app.settings.socketIO
    app.set 'socketIO', io


  # log all new connections
  io.sockets.on 'connection', (client) ->

    client.on 'join', (nickname) ->
      client.set 'nickname', nickname
      console.log("CONNECTED: #{nickname}")
