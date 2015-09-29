module.exports = (function () {
    'use strict';

    var coquoVenenum = require('coquo-venenum');
    var each = require('pro-singulis');
    var utils = require('alchemy.js/lib/Utils');

    /**
     * @class
     * @name todo.controller.Todo
     */
    return coquoVenenum({
        /** @lends todo.controller.Todo.prototype */

        messages: {
            'todo:create': 'createTodo',
            'todo:update': 'updateTodo',
            'todo:delete': 'deleteTodo',
            'todo:deletecompleted': 'deleteCompleted',
            'todo:updateall': 'updateAllTodos',
        },

        /** @private */
        updateTodo: function (state, data) {
            return state.set('todos', state.sub('todos').each(function (todo) {
                if (todo.val('id') === data.id) {
                    return todo.set(data);
                }

                return todo;
            }));
        },

        /** @private */
        updateAllTodos: function (state, data) {
            return state.set('todos', state.sub('todos').each(function (todo) {
                return todo.set(data);
            }));
        },

        /** @private */
        deleteTodo: function (state, data) {
            var oldTodos = state.sub('todos').val();
            var newTodos = [];

            for (var i = 0, l = oldTodos.length; i < l; i++) {
                if (oldTodos[i].id !== data.id) {
                    newTodos.push(oldTodos[i]);
                }
            }

            return state.set('todos', newTodos);
        },

        /** @private */
        deleteCompleted: function (state, data) {
            var allTodos = state.sub('todos').val();
            var activeTodos = each(allTodos, function (todo) {
                if (!todo.completed) {
                    return todo;
                }
            });

            return state.set('todos', activeTodos);
        },

        /** @private */
        createTodo: function (state, data) {
            var todos = state.sub('todos').val();
            todos.push({
                id: utils.uuid(),
                completed: false,
                editing: false,
                text: data.text
            });

            return state.set('todos', todos);
        },
    });
}());

