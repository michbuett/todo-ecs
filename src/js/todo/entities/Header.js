module.exports = (function () {
    'use strict';

    var KEY_ENTER = 13;
    var KEY_ESC = 27;

    var h = require('virtual-dom/h');

    var vdom = h('header.header', null, [
        h('h1', null, 'todos'),
        h('input.new-todo', {
            placeholder: 'What needs to be done?',
            autofocus: true,
        }, '')
    ]);

    var events = {
        'keydown .new-todo': function (ev, sendMessage) {
            var text = ev.target && ev.target.value;

            if (text && ev.keyCode === KEY_ENTER) {
                sendMessage('todo:create', {
                    text: text
                });
                ev.target.value = '';
            }

            if (text && ev.keyCode === KEY_ESC) {
                ev.target.value = '';
            }
        },
    };

    return function header(id) {
        return {
            id: id,
            vdom_ng: vdom,
            events: events,
        };
    };
}());
