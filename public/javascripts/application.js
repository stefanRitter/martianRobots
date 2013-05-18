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
 *  App.Views.HAL9000: HAL is an artificial intelligence that controls all systems
 */


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
  x: 50,
  y: 50,

  resize: function(x,y) {
    if ( x > 50 || y > 50 || x < 0 || y < 0) return false;

    this.x = x;
    this.y = y;
    this.trigger('resize');

    return true;
  },

  offPlanet: function(x,y) {
    if (x > this.x || x < 0 || y > this.y || y < 0) return true;
    return false;
  }
});
App.mars = new App.Models.Mars();


App.Models.Robot = Backbone.Model.extend({
  degrees:     ['0deg', '90deg',  '180deg',  '270deg'],         // TODO: for css-translate
  orientation: ['N',    'E',      'S',       'W',     'LOST'],  // for output
  moveFunc: [function(that){that.y+=1;}, function(that){that.x+=1;}, function(that){that.y-=1;}, function(that){that.x-=1;}],
  currOrient: 0,
  x: 0,
  y: 0,
  oldX: 0,
  oldY: 0,
  noGoCoords: [],
  needsReset: false,

  initialize: function() {
    // declare this robot invalid if mars gets resized
    var that = this;
    this.listenTo(App.mars, 'resize', function() { that.needsReset = true; noGoCoords = []; } );
  },

  makeNewRobot: function(x,y,orr) {
    if (App.mars.offPlanet(x,y)) return false;

    this.x = x;
    this.y = y;
    this.currOrient = this.orientation.indexOf(orr);
    this.needsReset = false;

    return true;
  },

  moveRobot: function(commands) {
    if (this.needsReset)  return false;

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
        alert('no go');
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
  // TODO: collect dead robots
});


// *********************************************************************************************************** VIEWS
App.Views.Mars = Backbone.View.extend({
  className: 'mars',

  render: function() {
    // TODO: render mars, robot, and dead robots
    return this;
  }
});


App.Views.Input = Backbone.View.extend({
  className: 'input',

  template: _.template( '<form>' +
                          '<input type="text" name="commands" value="enter commands here" />' +
                          '<input type="submit" />' +
                        '</form>' +
                        '<div class="commandHistory"></div>'),

  events: { submit: "readInput"},

  render: function() {
    this.$el.html( this.template( this.model.attributes ));

    // automatically select content when activated
    this.$("input:text")
        .focus(function () { $(this).select(); } )
        .mouseup(function (e) {e.preventDefault(); });

    return this;
  },

  commands: [
              {
                name: 'gridSize',
                reg: /\d+ \d+$/, // digits, space, digits, end of line
                run: function(command) {
                  var grid = command.match(this.reg);
                  grid = grid[0].split(' ');
                  var x = parseInt(grid[0], 10),
                      y = parseInt(grid[1], 10);

                  if (! App.mars.resize(x, y) ) {
                    // grid size was out of bounds
                    $('audio')[0].play();
                  }
                }
              },
              {
                name: 'newRobot',
                reg: /\d+\s\d+\s[NESW]$/i, // digits, space, digits, space, N E S W n e s w
                run: function(command) {
                  var newRobot = command.match(this.reg);
                  newRobot = newRobot[0].split(' ');
                  var x = parseInt(newRobot[0], 10),
                      y = parseInt(newRobot[1], 10),
                      orr = newRobot[2];

                  if (! App.robot.makeNewRobot(x,y,orr)) {
                    $('audio')[0].play();
                  }
                }
              },
              {
                name: 'moveRobot',
                reg: /[lrf]+$/i, // any number of l r f L R F
                run: function(command) {
                  if (! App.robot.moveRobot(command)) {
                    $('audio')[0].play();
                  }
                }
              }
            ],

  readInput: function(e) {
    e.preventDefault();
    e.stopPropagation();

    // add command to command history
    var command = $('input[name=commands]').val();
    $('.commandHistory').prepend('<div>' + _.escape(command) + '</div>');
    this.$("input:text").val('');

    // go through all the commands and run it if applicable
    for(var i = 0, len = this.commands.length; i < len; i++) {
      if( this.commands[i].reg.test(command) ) {
        this.commands[i].run(command);
        return;
      }
    }

    // no command matched
    $('audio')[0].play();
  }
});


App.Views.Output = Backbone.View.extend({
  className: 'output',

  initialize: function() {
    // listen to robot changes
    this.listenTo(this.model, 'change', this.update);
  },

  update: function() {
    $('.outputHistory').prepend('<div>' + this.model.getOutput() + '</div>');
  },

  render: function() {
    this.$el.html('<div class="outputTitle">output:</div><div class="outputHistory"></div>');
    return this;
  }
});


App.Views.HAL9000 = Backbone.View.extend({
  className: 'hal',

  render: function() {
    this.$el.html( '<img src="../images/hal.png" />' +
                   '<audio>' +
                      '<source src="../sounds/cantdo.ogg" type="audio/ogg">' +
                      '<source src="../sounds/cantdo.mp3" type="audio/mpeg">' +
                   '</audio>' );
    return this;
  }
});


// *********************************************************************************************************** ROUTER
App.router = new (Backbone.Router.extend({
  routes: {
    "(/)*path": "index"
  },

  index: function() {
    var mars = new App.Views.Mars({ model: App.mars }),
        input = new App.Views.Input({ model: App.robot }),
        output = new App.Views.Output({ model: App.robot }),
        hal = new App.Views.HAL9000({});
        $app = $('#app');

    $app.append(mars.render().el);
    $app.append(input.render().el);
    $app.append(hal.render().el);
    $app.append(output.render().el);
  }
}))();


// *********************************************************************************************************** READY
$(function() {
  App.start();
});
