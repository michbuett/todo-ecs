module.exports = (function () {
    'use strict';

    var header = require('./Header');
    var todoList = require('./TodoList');
    var footer = require('./Footer');
    var h = require('virtual-dom/h');
    var vdom = h('section.todoapp', null, [
        h('#header'), h('#todos'), h('#footer'),
    ]);

    return function viewport(state) {

        return {
            id: 'viewport',

            vdom: vdom,

            children: [
                header('header'),

                todoList('todos', state.sub('todos'), state.sub('route')),

                footer(
                    'footer',
                    state.sub('numOfCompleted'),
                    state.sub('numOfUnCompleted'),
                    state.sub('route')
                )
            ],
        };
    };
}());
