module.exports = (function () {
    'use strict';

    var h = require('virtual-dom/h');

    var events = [
        ['click', '.clear-completed', function (e, sendMessage) {
            sendMessage('todo:deletecompleted');
        },]
    ];

    return function footer(id, numOfCompleted, numOfUnCompleted, route) {
        return {
            id: id,

            vdom: renderVdom(
                numOfCompleted.val(),
                numOfUnCompleted.val(),
                route.val()
            ),

            events: events,
        };
    };

    /** @private */
    function renderVdom(numOfCompleted, numOfUnCompleted, route) {
        return h('footer.footer', null, [
            h('span.todo-count', null, [
                h('strong', null, String(numOfUnCompleted)),
                ' item(s) left'
            ]),

            h('ul.filters', [
                renderFilter(h, route, '#/', 'All'),
                renderFilter(h, route, '#/active', 'Active'),
                renderFilter(h, route, '#/completed', 'Completed'),
            ]),

            h('button.clear-completed', {
                className: numOfCompleted === 0 ? 'hidden' : '',
            }, 'Clear completed (' + numOfCompleted + ')')
        ]);
    }

    /** @private */
    function renderFilter(h, currentRoute, filterRoute, text) {
        var selected = (currentRoute === filterRoute);

        return h('li', null, h('a' + (selected ? '.selected' : ''), {
            href: filterRoute
        }, text));
    }
}());
