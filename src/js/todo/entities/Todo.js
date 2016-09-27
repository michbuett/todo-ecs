module.exports = (function () {
    'use strict';

    var h = require('virtual-dom/h');

    return function Todo(todo, route) {

        /**
         * @class
         * @name todo.entities.Todo
         */
        return {
            id: todo.id,

            vdom: renderVdom(todo, route),

            events: {
                'change input.toggle': function (e, sendMessage) {
                    var checked = e && e.target && e.target.checked;
                    sendMessage('todo:update', {
                        id: todo.id,
                        completed: checked
                    });
                },

                'dblclick .uncompleted label': function (e, sendMessage) {
                    sendMessage('todo:update', {
                        id: todo.id,
                        editing: true,
                    });
                },

                'click button.destroy': function (e, sendMessage) {
                    sendMessage('todo:delete', {
                        id: todo.id,
                    });
                },

                'change .uncompleted input.edit': function (e, sendMessage) {
                    var newText = e && e.target && e.target.value;
                    if (newText) {
                        sendMessage('todo:update', {
                            id: todo.id,
                            text: newText,
                            editing: false,
                        });
                    }
                }
            }
        };
    };

    function renderVdom(data, route) {
        var completed = data.completed;
        var editing = data.editing;
        var text = data.text;
        var className = (editing ? 'editing' : '') + (completed ? ' completed' : ' uncompleted');

        if (route === '#/completed' && !completed || route === '#/active' && completed) {
            className += ' hidden';
        }

        return h('li', {
            className: className
        }, [
            h('div.view', null, [
                h('input.toggle', {
                    type: 'checkbox',
                    checked: completed,
                }),

                h('label', null, text),

                h('button.destroy')
            ]),

            h('input.edit', {
                value: text,
            })
        ]);
    }
}());
