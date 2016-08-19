module.exports = (function () {
    'use strict';

    var each = require('pro-singulis');
    var immutable = require('immutabilis');
    var todo = require('./Todo');
    var utils = require('alchemy.js/lib/Utils');

    return function TodoList(cfg) {

        /**
         * @class
         * @name todo.entities.TodoList
         */
        return utils.melt({

            vdom: {
                stateMap: function (appState) {
                    var todos = appState.val('todos');
                    var allCompleted = true;

                    for (var i = 0, l = todos.length; i < l; i++) {
                        allCompleted = allCompleted && todos[i].completed;
                    }

                    return immutable.fromJS({
                        hasTodos: todos.length > 0,
                        allCompleted: allCompleted,
                    });
                },

                renderer: function (ctx) {
                    var h = ctx.h;
                    var hasTodos = ctx.state.val('hasTodos');
                    var allCompleted = ctx.state.val('allCompleted');

                    return h('.main', {
                        className: hasTodos ? '' : 'hidden'
                    }, [
                        h('input.toggle-all', {
                            type: 'checkbox',
                            checked: allCompleted,
                        }),

                        h('label', {
                            htmlFor: 'toggle-all'
                        }, 'Mark all as complete'),

                        h('ul.todo-list', null, ctx.renderAllChildren())
                    ]);
                },
            },

            events: {
                'change .toggle-all': function (e, state, sendMessage) {
                    sendMessage('todo:updateall', {
                        completed: !state.val('allCompleted'),
                    });
                },
            },

            children: function (state) {
                return each(state.val('todos'), function (t) {
                    return todo({
                        id: t.id
                    });
                });
            }
        }, cfg || {});
    };
}());
