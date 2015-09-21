module.exports = function (alchemy) {
    'use strict';

    var systems = [
        'alchemy.ecs.StateSystem',
        'alchemy.ecs.EventSystem',
        'alchemy.ecs.VDomRenderSystem',
        'alchemy.ecs.CssRenderSystem',
    ];

    var entityTypes = [
        'todo.entities.Viewport',
        'todo.entities.Header',
        'todo.entities.TodoList',
        'todo.entities.Todo',
        'todo.entities.Footer',
    ];

    /**
     * @class
     * @name todo.ui
     * @extends alchemy.core.MateriaPrima
     */
    alchemy.formula.define('todo.ui', [
        'alchemy.core.MateriaPrima',
        'alchemy.web.Delegatus',

    ].concat(systems, entityTypes), function (MateriaPrima, Delegatus) {

        return alchemy.extend(MateriaPrima, {
            /** @lends todo.ui.prototype */

            /** @override */
            constructor: function (cfg) {
                this.delegator = Delegatus.brew();

                MateriaPrima.constructor.call(this, cfg);
            },

            /** @override */
            dispose: function () {
                this.delegator.dispose();
                this.delegator = null;

                MateriaPrima.dispose.call(this);
            },

            /**
             * @param alchemy.ecs.Administrator entityAdmin
             * @param alchemy.core.Observari
             * @param Immuatble state
             */
            initUI: function (entityAdmin, appMsgBus, state) {

                // register UI relevant systems
                alchemy.each(systems, function (name) {
                   entityAdmin.addSystem(alchemy(name).brew({
                        delegator: this.delegator,
                        messages: appMsgBus,
                    }));
                }, this);

                // register entity types
                alchemy.each(entityTypes, function (name) {
                    entityAdmin.setEntityDefaults(name, alchemy(name));
                }, this);

                entityAdmin.initEntities([{
                    type: 'todo.entities.Viewport',
                    vdom: {
                        root: document.querySelector('.todoapp'),
                    },

                }, determineTodoEntities], state);
            },
        });
    });

    /** @private */
    function determineTodoEntities(state) {
        return alchemy.each(state.val('todos'), defineTodoEntity);
    }

    /** @private */
    function defineTodoEntity(todo, index) {
        return {
            id: todo.id,

            type: 'todo.entities.Todo',

            globalToLocal: globalToLocal,

            state: {
                completed: todo.completed,
                editing: todo.editing,
                text: todo.text,
                todoId: todo.id,
            },
        };
    }

    /** @private */
    function globalToLocal(appState, entityState) {
        var todos = appState.val('todos');

        for (var i = 0, l = todos.length; i < l; i++) {
            var todo = todos[i];

            if (todo.id === entityState.todoId) {
                return {
                    route: appState.val('route'),
                    text: todo.text,
                    editing: todo.editing,
                    completed: todo.completed,
                };
            }
        }
    }
};
