(function () {
    'use strict';

    var alchemy = require('./../alchemy');
    var STORAGE_KEY = 'alchemy-todo';

    /**
     * @class
     * @name todo.controller.Storage
     */
    alchemy.formula.add({
        name: 'todo.controller.Storage',

        overrides: {
            /** @lends todo.controller.Storage.prototype */

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
        }
    });
}());


