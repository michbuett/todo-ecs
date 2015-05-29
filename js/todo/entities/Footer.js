module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name todo.entities.Footer
     */
    alchemy.formula.define('todo.entities.Footer', [], function () {

        return {
            vdom: {
                renderer: function (ctx) {
                    var h = ctx.h;

                    return h('#footer', null, []);
                },
            },
        };
    });
};
