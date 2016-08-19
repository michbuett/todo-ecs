module.exports = (function () {
    'use strict';

    var utils = require('alchemy.js/lib/Utils');
    var immutable = require('immutabilis');

    function createFilter(h, currentRoute, filterRoute, text) {
        var selected = (currentRoute === filterRoute);

        return h('li', null, h('a' + (selected ? '.selected' : ''), {
            href: filterRoute
        }, text));
    }

    return function Footer(cfg) {

        /**
         * @class
         * @name todo.entities.TodoList
         */
        return utils.melt({

            vdom: {
                stateMap: function (appState) {
                    var completed = 0;
                    var todos = appState.val('todos');

                    for (var i = 0, l = todos.length; i < l; i++) {
                        if (todos[i].completed) {
                            completed++;
                        }
                    }

                    return immutable.fromJS({
                        completed: completed,
                        uncompleted: todos.length - completed,
                        route: appState.val('route'),
                    });
                },

                renderer: function (ctx) {
                    var h = ctx.h;
                    var state = ctx.state;
                    var numOfCompleted = state.sub('completed').val();
                    var numOfUnCompleted = state.sub('uncompleted').val();
                    var route = state.sub('route').val();

                    return h('footer.footer', null, [
                        h('span.todo-count', null, [
                            h('strong', null, String(numOfUnCompleted)),
                            ' item(s) left'
                        ]),

                        h('ul.filters', [
                            createFilter(h, route, '#/', 'All'),
                            createFilter(h, route, '#/active', 'Active'),
                            createFilter(h, route, '#/completed', 'Completed'),
                        ]),

                        h('button.clear-completed', {
                            className: numOfCompleted === 0 ? 'hidden' : '',
                        }, 'Clear completed (' + numOfCompleted + ')')
                    ]);
                },
            },

            events: {
                'click .clear-completed': function (e, state, sendMessage) {
                    sendMessage('todo:deletecompleted');
                },
            },
        }, cfg);
    };
}());
