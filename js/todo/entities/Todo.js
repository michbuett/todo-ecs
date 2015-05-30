module.exports = function (alchemy) {
    'use strict';

    /**
     * @class
     * @name todo.entities.Todo
     */
    alchemy.formula.define('todo.entities.Todo', [], function () {

        return {
            state: {
                route: '',
                completed: false,
                editing: false,
                text: '',
                todoId: '',
            },

            vdom: {
                renderer: function (ctx) {
                    var h = ctx.h;
                    var route = ctx.state.val('route');
                    var completed = ctx.state.val('completed');
                    var editing = ctx.state.val('editing');
                    var text = ctx.state.val('text');
                    var className = (editing ? 'editing' : '') + (completed ? ' completed' : '');

                    if (route === '#/completed' && !completed || route === '#/active' && completed) {
                        className += ' hidden';
                    }

                    return h('li', {
                        id: ctx.entityId,
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
            },

            events: {
                'change input.toggle': function (e, state, sendMessage) {
                    sendMessage('todo:update', {
                        id: state.val('todoId'),
                        completed: !state.val('completed'),
                    });
                },

                'dblclick label': function (e, state, sendMessage) {
                    if (state.val('completed')) {
                        return;
                    }

                    sendMessage('todo:update', {
                        id: state.val('todoId'),
                        editing: true,
                    });
                },

                'click button.destroy': function (e, state, sendMessage) {
                    sendMessage('todo:delete', {
                        id: state.val('todoId'),
                    });
                },

                'change input.edit': function (e, state, sendMessage) {
                    if (state.val('completed')) {
                        return;
                    }

                    var newText = e && e.target && e.target.value;
                    if (newText) {
                        sendMessage('todo:update', {
                            id: state.val('todoId'),
                            text: newText,
                            editing: false,
                        });
                    }
                }
            }
        };
    });
};
