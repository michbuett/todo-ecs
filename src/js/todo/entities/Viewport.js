module.exports = (function () {
    'use strict';

    var utils = require('alchemy.js/lib/Utils');
    var header = require('./Header');
    var todoList = require('./TodoList');
    var footer = require('./Footer');

    return function Viewport(cfg) {

        /**
         * @class
         * @name todo.entities.Viewport
         */
        return utils.melt({
            vdom: {
                renderer: function (ctx) {
                    return ctx.h('section.todoapp', null, ctx.renderAllChildren());
                },
            },

            children: [ header(), todoList(), footer(), ],
        }, cfg);
    };
}());
