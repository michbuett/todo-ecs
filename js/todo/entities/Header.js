module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name todo.entities.Header
     */
    alchemy.formula.define('todo.entities.Header', [], function () {

        return {
            vdom: {
                renderer: function (ctx) {
                    var h = ctx.h;

                    return h('header#header', null, [
                        h('h1', null, 'todos'),
                        h('input#new-todo', {
                            placeholder: 'What needs to be done?',
                            autofocus: true,
                        }, '')
                    ]);
                },
            },
        };
    });
};
