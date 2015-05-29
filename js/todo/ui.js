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

                MateriaPrima.dispose.call(this, cfg);
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
                }], state);
            },
        });
    });

};
