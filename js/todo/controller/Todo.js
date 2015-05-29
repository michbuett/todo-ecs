(function () {
    'use strict';

    var alchemy = require('./../alchemy');

    /**
     * @class
     * @name todo.controller.Todo
     */
    alchemy.formula.add({
        name: 'todo.controller.Todo',

        overrides: {
            /** @lends todo.controller.Todo.prototype */

            messages: {
                'todo:create': 'createTodo',
                'todo:update': 'updateTodo',
                'todo:delete': 'deleteTodo',
                'todo:deleteall': 'deletesAllTodos',
                'todo:updateall': 'updateAllTodos',
            },

            updateTodo: function (state, data) {
                return state.set('todos', state.sub('todos').set(data.index, data));
            },

            updateAllTodos: function (state, data) {
                return state.set('todos', state.sub('todos').each(function (todo) {
                    return todo.set(data);
                }));
            },

            deleteTodo: function (state, data) {
                var todos = state.sub('todos').val();
                todos.splice(data.index, 1);
                return state.set('todos', todos);
            },

            deletesAllTodos: function (state, data) {
                var allTodos = state.sub('todos').val();
                var activeTodos = alchemy.each(allTodos, function (todo) {
                    if (!todo.completed) {
                        return todo;
                    }
                });
                return state.set('todos', activeTodos);
            },

            createTodo: function (state, data) {
                var todos = state.sub('todos').val();
                todos.push({
                    id: alchemy.id(),
                    completed: false,
                    editing: false,
                    text: data.text
                });

                return state.set('todos', todos);
            },
        }
    });
}());

