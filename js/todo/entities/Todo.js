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
            }
        };
    });
};
