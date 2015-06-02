module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name todo.modell.State
     */
    alchemy.formula.define('todo.state', [
        'alchemy.core.Immutatio',

    ], function (Immutatio) {

        return {
            /** @lends todo.modell.State.prototype */

            createAppState: function () {
                return alchemy('Immutatio').makeImmutable({
                    route: '#/',
                    todos: []
                }, {
                    all: function () {
                        return this.val('todos').length;
                    },

                    completed: function (val) {
                        var completed = 0;
                        for (var i = 0, l = val.todos.length; i < l; i++) {
                            if (val.todos[i].completed) {
                                completed++;
                            }
                        }
                        return completed;
                    },

                    uncompleted: function () {
                        return this.val('all') - this.val('completed');
                    }
                });
            },
        };
    });
};
