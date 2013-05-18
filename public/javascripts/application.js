/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *
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
  // TODO: register mars' grid
});
App.mars = new App.Models.Mars();


App.Models.Robot = Backbone.Model.extend({
  degrees:     ['0deg', '90deg',  '180deg',  '270deg'],
  orientation: ['N',    'E',      'S',       'W'],
  currOrient: 0,

  getOrientation: function() {
    return this.degrees[this.currOrient];
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
                        '</form>'),

  events: { submit: "readInput"},

  render: function() {
    this.$el.html( this.template( this.model.attributes ));
    return this;
  },

  readInput: function(e) {
    e.preventDefault();
    e.stopPropagation();

    // TODO: handle input
    var command = $('input[name=commands]').val();

    $('audio')[0].play();
  }
});


App.Views.Output = Backbone.View.extend({
  className: 'output',

  initialize: function() {
    // TODO: listen to robot changes
  },

  render: function() {
    // TODO: display robot position on change
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
