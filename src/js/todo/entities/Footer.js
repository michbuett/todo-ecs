module.exports = (function () {
    'use strict';

    var utils = require('alchemy.js/lib/Utils');
    // var immutable = require('immutabilis');
    var h = require('virtual-dom/h');

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

            vdom_ng: function (state, entity) {
                var numOfCompleted = 0;
                var todos = state.val('todos');

                for (var i = 0, l = todos.length; i < l; i++) {
                    if (todos[i].completed) {
                        numOfCompleted++;
                    }
                }

                var numOfUnCompleted = todos.length - numOfCompleted;
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

            events: {
                'click .clear-completed': function (e, state, sendMessage) {
                    sendMessage('todo:deletecompleted');
                },
            },
        }, cfg);
    };
}());
