module.exports = (function () {
    'use strict';

    /**
     * @class
     * @name todo.entities.Viewport
     */
    return {
        vdom: {
            renderer: function (ctx) {
                return ctx.h('section.todoapp', null, ctx.renderAllChildren());
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
}());
