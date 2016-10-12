module.exports = (function () {
    'use strict';

    var memoize = require('@michbuett/f/memoize2');
    var h = require('virtual-dom/h');
    var events = {
        'change input.toggle': function (e, sendMessage) {
            var checked = e && e.target && e.target.checked;
            var todoId = getTodoId(e.target);

            sendMessage('todo:update', {
                id: todoId,
                completed: checked
            });
        },

        'dblclick .uncompleted label': function (e, sendMessage) {
            sendMessage('todo:update', {
                id: getTodoId(e.target),
                editing: true,
            });
        },

        'click button.destroy': function (e, sendMessage) {
            sendMessage('todo:delete', {
                id: getTodoId(e.target),
            });
        },

        'change .uncompleted input.edit': function (e, sendMessage) {
            var newText = e && e.target && e.target.value;
            if (newText) {
                sendMessage('todo:update', {
                    id: getTodoId(e.target),
                    text: newText,
                    editing: false,
                });
            }
        }
    };

    return memoize(function (todo, route) {

        /**
         * @class
         * @name todo.entities.Todo
         */
        return {
            id: todo.id,

            vdom: renderVdom(todo, route),

            events: events,
        };
    });

    /** @private */
    function renderVdom(data, route) {
        var completed = data.completed;
        var editing = data.editing;
        var text = data.text;
        var className = (editing ? 'editing' : '') + (completed ? ' completed' : ' uncompleted');

        if (route === '#/completed' && !completed || route === '#/active' && completed) {
            className += ' hidden';
        }

        return h('li', {
            className: className,
            dataset: {
                todoId: data.id
            },
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

    /** @private */
    function getTodoId(el) {
        if (!el) {
            return;
        }

        var todoId = el.dataset && el.dataset.todoId;
        return todoId || getTodoId(el.parentElement);
    }
}());
