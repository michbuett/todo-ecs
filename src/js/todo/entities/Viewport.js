module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name todo.entities.Viewport
     */
    alchemy.formula.define('todo.entities.Viewport', [], function () {

        return {
            vdom: {
                root: document.getElementById('todoapp'),

                renderer: function (ctx) {
                    return ctx.h('section#todoapp', null, ctx.renderAllChildren());
                },
            },

            children: [{
                type: 'todo.entities.Header',
            }, {
                type: 'todo.entities.TodoList',
            }, {
                type: 'todo.entities.Footer',
            }],
        };
    });
};
