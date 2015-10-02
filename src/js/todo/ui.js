module.exports = (function () {
    'use strict';

    var coquoVenenum = require('coquo-venenum');
    var each = require('pro-singulis');

    var Delegatus = require('alchemy.js/lib/Delegatus');
    var Administrator = require('alchemy.js/lib/Administrator');
    var Apothecarius = require('alchemy.js/lib/Apothecarius');
    var StateSystem = require('alchemy.js/lib/StateSystem');
    var EventSystem = require('alchemy.js/lib/EventSystem');
    var VDomRenderSystem = require('alchemy.js/lib/VDomRenderSystem');

    var Viewport = require('./entities/Viewport');
    var Header = require('./entities/Header');
    var TodoList = require('./entities/TodoList');
    var Todo = require('./entities/Todo');
    var Footer = require('./entities/Footer');

    return coquoVenenum({

        messages: undefined,

        admin: undefined,

        delegator: undefined,

        init: function (state) {
            // register UI relevant systems
            each([
                StateSystem,
                EventSystem,
                VDomRenderSystem,
            ], function (system) {
                this.admin.addSystem(system.brew({
                    delegator: this.delegator,
                    messages: this.messages,
                }));
            }, this);

            // register entity types
            each({
                'todo.entities.Viewport': Viewport,
                'todo.entities.Header': Header,
                'todo.entities.TodoList': TodoList,
                'todo.entities.Todo': Todo,
                'todo.entities.Footer': Footer,
            }, function (defaultValues, entity) {
                this.admin.setEntityDefaults(entity, defaultValues);
            }, this);

            this.admin.initEntities([{
                type: 'todo.entities.Viewport',
                vdom: {
                    root: document.querySelector('.todoapp'),
                },

            }, determineTodoEntities], state);
        },

        update: function (state) {
            return this.admin.update(state);
        },

    }).whenBrewed(function () {
        this.delegator = Delegatus.brew();
        this.admin = Administrator.brew({
            repo: Apothecarius.brew()
        });
    });

    /** @private */
    function determineTodoEntities(state) {
        return each(state.val('todos'), defineTodoEntity);
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
}());
