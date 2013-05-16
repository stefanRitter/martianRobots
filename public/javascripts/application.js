/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *
 */


// *********************************************************************************************************** APP
var App = new (Backbone.View.extend({

  Models: {},
  Views: {},
  Collections: {},

  router: {},

  events: {},

  start: function() {
    Backbone.history.start({ pushState: true });
  },

  mars: {},
  robot: {}
}))({el: document.body});


// *********************************************************************************************************** MODELS
App.Models.Mars = Backbone.Model.extend({});
App.mars = new App.Models.Mars();


App.Models.Robot = Backbone.Model.extend({

  degrees:     ['0deg', '90deg',  '180deg',  '270deg'],
  orientation: ['N',    'E',      'S',       'W']
});
App.robot = new App.Models.robot();


// *********************************************************************************************************** VIEWS
App.Views.Mars = Backbone.View.extend({});


App.Views.Input = Backbone.View.extend({});


App.Views.Output = Backbone.View.extend({});


// *********************************************************************************************************** ROUTER
App.router = new (Backbone.Router.extend({

  routes: {
    "(/)*path": "index"
  },

  index: function() {
    var tempView1 = new App.Views.Mars(),
        tempView2 = new App.Views.Input(),
        tempView3 = new App.Views.Output();
  }
}))();


// *********************************************************************************************************** READY
$(function() {
  App.start();
});
