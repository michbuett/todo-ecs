module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name todo.entities.TodoList
     */
    alchemy.formula.define('todo.entities.TodoList', [], function () {

        return {
            vdom: {
                renderer: function (ctx) {
                    var h = ctx.h;

                    return h('#main', null, []);
                },
            },
        };
    });
};
