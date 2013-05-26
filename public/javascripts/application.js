/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *
 *  Classes:
 *  ========
 *
 *  App: manages global namespace of this app
 *
 *
 *
 *  App.Models.Mars: Model of Mars, manages Mars' current size, triggers 'resize'
 *
 *  App.Models.Robot: Model of active robot, manages robot movement, 
 *                    listens to Mars 'resize', queries Mars for its dimensions, triggers 'change'
 *
 *  App.Models.DeadRobots: Collection of dead robots, which where either lost or the connection severed, triggers 'add'
 *
 *
 *
 *  App.Views.Mars: View of planet Mars, listens to Mars 'resize', DeadRobots 'add', and Robot 'change'
 *
 *  App.Views.Input: View of input console, delegates commands to either Mars or Robot
 *
 *  App.Views.Output: View of robot output, listens to Robot 'change'
 *
 *  App.Views.HAL9000: HAL is an artificial intelligence that controls all systems, and throws exception
 *
 */
(function() {


// *********************************************************************************************************** APP
var App = new (Backbone.View.extend({

  // class definitions
  Models: {},
  Views: {},
  Collections: {},

  router: {},

  events: {},

  // global models
  mars: {},
  robot: {},

  start: function() {
    Backbone.history.start({ pushState: true });
  }
}))({el: document.body});


// *********************************************************************************************************** MODELS
App.Models.Mars = Backbone.Model.extend({
  x: 0,
  y: 0,

  resize: function(x,y) {
    if ( x > 50 || y > 50 || x < 0 || y < 0) {
      HAL9000.error('grid size was out of bounds');
    }

    this.x = x;
    this.y = y;
    this.trigger('resize');
    return true;
  },

  offPlanet: function(x,y) {
    if (this.x === 0 && this.y === 0) {
      HAL9000.error('no valid planet found');
    }
    if (x > this.x || x < 0 || y > this.y || y < 0) return true;
    return false;
  }
});
App.mars = new App.Models.Mars();


App.Models.Robot = Backbone.Model.extend({
  orientation: ['N',    'E',      'S',       'W'],        // for output
  moveFunc: [function(that){that.y+=1;}, function(that){that.x+=1;}, function(that){that.y-=1;}, function(that){that.x-=1;}],
  currOrient: 0,
  x: 0,
  y: 0,
  oldX: 0,
  oldY: 0,
  noGoCoords: [],
  needsReset: true,

  initialize: function() {
    // declare this robot invalid if mars gets resized
    var that = this;
    this.listenTo(App.mars, 'resize', function() { that.needsReset = true; that.noGoCoords = []; } );
  },

  makeNewRobot: function(x,y,orr) {
    if (App.mars.offPlanet(x,y)) {
      HAL9000.error('your robot missed the planet');
    }

    this.x = x;
    this.y = y;
    this.currOrient = this.orientation.indexOf(orr);
    this.needsReset = false;

    return true;
  },

  moveRobot: function(commands) {
    if (this.needsReset) {
      HAL9000.error('no new robot');
    }

    commands = commands.toUpperCase();
    var commList = commands.split('');

    for (var i = 0, len = commList.length; i < len; i++) {
      switch (commList[i]){
        case 'L':
          this.currOrient-=1;
          this.currOrient = (this.currOrient < 0) ? 3 : this.currOrient;
          break;

        case 'R':
          this.currOrient+=1;
          this.currOrient = (this.currOrient > 3) ? 0 : this.currOrient;
          break;

        case 'F':
          this.oldX = this.x;
          this.oldY = this.y;

          // call the move function appropriate for the current orientation
          this.moveFunc[this.currOrient](this);

          // revert to old location if we know this is a dead end
          if (! this.revert()) {

            // check if robot is lost
            if ( App.mars.offPlanet( this.x, this.y)) {
              // this robot just died
              this.noGoCoords.push({x: this.oldX, y: this.oldY, orr: this.currOrient});
              this.needsReset = true;
              this.x = this.oldX; this.y = this.oldY;
              this.trigger('change');
              return true;
            }
          }
          break;

        default:
          HAL9000.error('deep error in command recognition');
          return false;
      }
    }

    this.trigger('change');
    return true;
  },

  revert: function() {
    var oldX = this.oldX, oldY = this.oldY, orr = this.currOrient, noGos = this.noGoCoords;

    for(var i = 0, len = noGos.length; i < len; i++) {
      // check if a robot has been lost here before
      if (oldX === noGos[i].x && oldX === noGos[i].y && orr === noGos[i].orr) {
        this.x = oldX; this.y = oldY;
        return true;
      }
    }
    return false;
  },

  getOutput: function() {
    var status = this.x + ' ' + this.y + ' ' + this.orientation[this.currOrient];
    return (this.needsReset) ? (status + ' LOST') : status;
  }
});
App.robot = new App.Models.Robot();


App.Models.DeadRobots = Backbone.Collection.extend({
  model: App.Models.Robot
});


// *********************************************************************************************************** VIEWS
App.Views.Mars = Backbone.View.extend({
  className: 'mars',
  degrees:     ['0deg', '90deg',  '180deg',  '270deg'],   // TODO: position robots via css-translate

  initialize: function() {
    // TODO: listen to Mars reset, DeadRobots add, and Robot change
  },

  render: function() {
    // TODO: render mars, robot, and dead robots
    return this;
  }
});


App.Views.Input = Backbone.View.extend({
  className: 'input',

  template: _.template($('#InputView').html()),

  events: { submit: "readInput"},

  render: function() {
    this.$el.html( this.template( this.model.attributes ));

    // automatically select content when activated
    this.$("textarea")
        .focus(function () { $(this).select(); } )
        .mouseup(function (e) {e.preventDefault(); });

    return this;
  },

  commands: [
              {
                name: 'gridSize',
                reg: /^\d+ \d+$/, // beginning of line: ^, digits, space, digits, end of line: $
                run: function(command) {
                  var grid = command.match(this.reg);
                  grid = grid[0].split(' ');
                  var x = parseInt(grid[0], 10),
                      y = parseInt(grid[1], 10);

                  App.mars.resize(x, y);
                }
              },
              {
                name: 'newRobot',
                reg: /^\d+\s\d+\s[NESW]$/i, // digits, space, digits, space, N E S W n e s w
                run: function(command) {
                  var newRobot = command.match(this.reg);
                  newRobot = newRobot[0].split(' ');
                  var x = parseInt(newRobot[0], 10),
                      y = parseInt(newRobot[1], 10),
                      orr = newRobot[2];

                  App.robot.makeNewRobot(x,y,orr);
                }
              },
              {
                name: 'moveRobot',
                reg: /^[lrf]+$/i, // any number of l r f L R F
                run: function(command) {
                  App.robot.moveRobot(command);
                }
              }
            ],

  readInput: function(e) {
    e.preventDefault();
    e.stopPropagation();

    var input = $('textarea').val(),
        inputs = input.split('\n');

    $('textarea').val('');  // empty text area
    HAL9000.reset();        // reset errors

    try {
      for (var j = 0, l = inputs.length; j < l; j++) {

        var command = inputs[j],
            processed = false;

        if (command === '') continue; // skip the empty string

        // go through all the commands and run it if applicable
        for(var i = 0, len = this.commands.length; i < len; i++) {
          if( this.commands[i].reg.test(command) ) {
            this.commands[i].run(command);
            processed = true;
            break;
          }
        }

        if (! processed) {
          HAL9000.error('no matching command');
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
});


App.Views.Output = Backbone.View.extend({
  className: 'output',

  initialize: function() {
    // listen to robot changes
    this.listenTo(this.model, 'change', this.updateRobot);
  },

  updateRobot: function() {
    $('.outputHistory').append('<div>' + this.model.getOutput() + '</div>');
  },

  render: function() {
    this.$el.html('<div class="outputTitle">output:</div><div class="outputHistory"></div>');
    return this;
  }
});


App.Views.HAL9000 = Backbone.View.extend({
  className: 'hal',

  render: function() {
    this.$el.html( $('#HALView').html() );
    return this;
  },

  reset: function() {
    $('.error').text('');
  },

  error: function(message) {
    $('audio')[0].play();
    message = message || 'an unknown error occurred';
    $('.error').text(message);
    throw message;
  }
});
window.HAL9000 = new App.Views.HAL9000();


// *********************************************************************************************************** ROUTER
App.router = new (Backbone.Router.extend({
  routes: {
    "(/)*path": "index"
  },

  index: function() {
    var mars = new App.Views.Mars({ model: App.mars }),
        input = new App.Views.Input({ model: App.robot }),
        output = new App.Views.Output({ model: App.robot }),
        $app = $('#app');

    $app.append(input.render().el);
    $app.append(HAL9000.render().el);
    $app.append(output.render().el);
    // $app.append(mars.render().el);
  }
}))();


// *********************************************************************************************************** READY
$(function() {
  App.start();
});


}).call(this);
