module.exports = (function () {
    'use strict';

    var h = require('virtual-dom/h');
    var todo = require('./Todo');

    return function todoList(id, todos, route) {
        todos = todos.val();

        var allCompleted = todos.reduce(andCompleted, true);
        var hasTodos = todos.length > 0;

        /**
         * @class
         * @name todo.entities.TodoList
         */
        return {
            id: id,

            vdom: renderListVdom(hasTodos, allCompleted, todos),

            events: {
                'change .toggle-all': function (e, sendMessage) {
                    sendMessage('todo:updateall', {
                        completed: !allCompleted,
                    });
                },
            },

            children: todos.map(function (t) {
                return todo(t, route.val());
            }),
        };
    };

    /** @private */
    function andCompleted(allCompleted, todo) {
        return allCompleted && todo.completed;
    }

    /** @private */
    function renderListVdom(hasTodos, allCompleted, todos) {
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

            h('ul.todo-list', null, todos.map(renderTodoVdom))
        ]);
    }

    /** @private */
    function renderTodoVdom(todo) {
        return h('li#' + todo.id);
    }
}());
