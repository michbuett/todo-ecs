module.exports = (function () {
    'use strict';

    var STORAGE_KEY = 'alchemy-todo';
    var coquoVenenum = require('coquo-venenum');

    /**
     * @class
     * @name todo.controller.Storage
     */
    return coquoVenenum({

        messages: {
            'app:start': 'onAppStart',
            'app:update': 'onAppUpdate',
        },

        /** @private */
        onAppStart: function (state) {
            var initialState = localStorage.getItem(STORAGE_KEY);
            if (initialState) {
                state = state.set('todos', JSON.parse(initialState));
            }

            this.todos = state.sub('todos');

            return state;
        },

        /** @private */
        onAppUpdate: function (state) {
            var todos = state.sub('todos');
            if (todos !== this.todos) {
                this.todos = todos;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.val()));
            }

            return state;
        },
    });
}());
