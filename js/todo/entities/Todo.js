module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name todo.entities.Todo
     */
    alchemy.formula.define('todo.entities.Todo', [], function () {

        return {
            vdom: {
                renderer: function (ctx) {
                    var h = ctx.h;

                    return h('li', null, []);
                },
            },
        };
    });
};
