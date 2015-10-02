module.exports = (function () {
    'use strict';

    var each = require('pro-singulis');

    /**
     * @class
     * @name todo.entities.TodoList
     */
    return {
        globalToLocal: function (appState) {
            var todos = appState.val('todos');
            var todoIds = [];
            var allCompleted = true;

            for (var i = 0, l = todos.length; i < l; i++) {
                todoIds.push(todos[i].id);
                allCompleted = allCompleted && todos[i].completed;
            }

            return {
                todos: todoIds,
                allCompleted: allCompleted,
            };
        },

        state: {
            todos: [],
            allCompleted: false
        },

        vdom: {
            renderer: function (ctx) {
                var h = ctx.h;
                var todos =  ctx.state.val('todos');
                var hasTodos = todos.length > 0;
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

                    h('ul.todo-list', null, each(todos, ctx.placeholder, ctx))
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
    };
}());
