module.exports = (function () {
    'use strict';

    var h = require('virtual-dom/h');

    var vdom = h('header.header', null, [
        h('h1', null, 'todos'),
        h('input.new-todo', {
            placeholder: 'What needs to be done?',
            autofocus: true,
        }, '')
    ]);

    var events = [
        ['keydown', '.new-todo', function (ev, sendMessage) {
            var text = ev.target && ev.target.value;

            if (text && ev.key === 'Enter') {
                sendMessage('todo:create', {
                    text: text
                });
                ev.target.value = '';
            }

            if (text && ev.key === 'Escape') {
                ev.target.value = '';
            }
        }],
    ];

    return function header(id) {
        return {
            id: id,
            vdom: vdom,
            events: events,
        };
    };
}());
