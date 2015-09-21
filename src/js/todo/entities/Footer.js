module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name todo.entities.Footer
     */
    alchemy.formula.define('todo.entities.Footer', [], function () {

        function createFilter(h, currentRoute, filterRoute, text) {
            var selected = (currentRoute === filterRoute);

            return h('li', null, h('a' + (selected ? '.selected' : ''), {
                href: filterRoute
            }, text));
        }

        return {

            globalToLocal: function (appState, currentState) {
                var completed = 0;
                var todos = appState.val('todos');

                for (var i = 0, l = todos.length; i < l; i++) {
                    if (todos[i].completed) {
                        completed++;
                    }
                }

                return {
                    completed: completed,
                    uncompleted: todos.length - completed,
                    route: appState.val('route'),
                };
            },

            state: {
                completed: 0,
                uncompleted: 0,
                route: ''
            },

            vdom: {
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

                        h('button.clear-completed', 'Clear completed (' + numOfCompleted + ')')
                    ]);
                },
            },

            events: {
                'click .clear-completed': function (e, state, sendMessage) {
                    sendMessage('todo:deletecompleted');
                },
            },
        };
    });
};
