module.exports = (function () {
    'use strict';

    var KEY_ENTER = 13;
    var KEY_ESC = 27;

    /**
     * @class
     * @name todo.entities.Header
     */
    return {
        vdom: {
            renderer: function (ctx) {
                var h = ctx.h;

                return h('header.header', null, [
                    h('h1', null, 'todos'),
                    h('input.new-todo', {
                        placeholder: 'What needs to be done?',
                        autofocus: true,
                    }, '')
                ]);
            },
        },

        events: {
            'keydown .new-todo': function (ev, state, sendMessage) {
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
        },
    };
}());
