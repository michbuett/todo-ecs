module.exports = (function () {
    'use strict';

    var utils = require('alchemy.js/lib/Utils');
    var immutable = require('immutabilis');

    /** @private */
    function findTodo(id, appState) {
        var todos = appState.val('todos');

        for (var i = 0, l = todos.length; i < l; i++) {
            var todo = todos[i];

            if (todo.id === id) {
                return {
                    route: appState.val('route'),
                    text: todo.text,
                    editing: todo.editing,
                    completed: todo.completed,
                };
            }
        }
    }

    return function Todo(cfg) {

        /**
         * @class
         * @name todo.entities.Todo
         */
        return utils.melt({

            vdom: {
                stateMap: function (appState) {
                    var todo = findTodo(cfg.id, appState);

                    return immutable.fromJS({
                        route: appState.val('route'),
                        text: todo.text,
                        editing: todo.editing,
                        completed: todo.completed,
                    });
                },

                renderer: function (ctx) {
                    var h = ctx.h;
                    var route = ctx.state.val('route');
                    var completed = ctx.state.val('completed');
                    var editing = ctx.state.val('editing');
                    var text = ctx.state.val('text');
                    var className = (editing ? 'editing' : '') + (completed ? ' completed' : ' uncompleted');

                    if (route === '#/completed' && !completed || route === '#/active' && completed) {
                        className += ' hidden';
                    }

                    return h('li', {
                        className: className
                    }, [
                        h('div.view', null, [
                            h('input.toggle', {
                                type: 'checkbox',
                                checked: completed,
                            }),

                            h('label', null, text),

                            h('button.destroy')
                        ]),

                        h('input.edit', {
                            value: text,
                        })
                    ]);
                },
            },

            events: {
                'change input.toggle': function (e, state, sendMessage) {
                    var todo = findTodo(cfg.id, state);

                    sendMessage('todo:update', {
                        id: cfg.id,
                        completed: !todo.completed
                    });
                },

                'dblclick .uncompleted label': function (e, state, sendMessage) {
                    sendMessage('todo:update', {
                        id: cfg.id,
                        editing: true,
                    });
                },

                'click button.destroy': function (e, state, sendMessage) {
                    sendMessage('todo:delete', {
                        id: cfg.id,
                    });
                },

                'change .uncompleted input.edit': function (e, state, sendMessage) {
                    var newText = e && e.target && e.target.value;
                    if (newText) {
                        sendMessage('todo:update', {
                            id: cfg.id,
                            text: newText,
                            editing: false,
                        });
                    }
                }
            }
        }, cfg);
    };
}());
