module.exports = function (alchemy) {
    'use strict';

    var systems = [
        'alchemy.ecs.StateSystem',
        'alchemy.ecs.EventSystem',
        'alchemy.ecs.VDomRenderSystem',
        'alchemy.ecs.CssRenderSystem',
    ];

    var entityTypes = [
    ];

    /**
     * @class
     * @name todo.app
     * @extends alchemy.web.Applicatus
     */
    alchemy.formula.define('todo.app', [
        'alchemy.web.Applicatus',
        'alchemy.ecs.Administrator',
        'alchemy.ecs.Apothecarius',
        'alchemy.web.Delegatus',

    ].concat(systems, entityTypes), function (
        Applicatus,
        Administrator,
        Apothecarius,
        Delegatus
    ) {

        return alchemy.extend(Applicatus, {
            /** @lends core.app.prototype */

            /** @override */
            constructor: function (cfg) {
                this.entityAdmin = Administrator.brew({
                    repo: Apothecarius.brew(),
                });

                this.delegator = Delegatus.brew();

                Applicatus.constructor.call(this, cfg);

                alchemy.each(systems, function (name) {
                    this.entityAdmin.addSystem(alchemy(name).brew({
                        delegator: this.delegator,
                        messages: this.messages,
                    }));
                }, this);

                alchemy.each(entityTypes, function (name) {
                    this.entityAdmin.setEntityDefaults(name, alchemy(name));
                }, this);
            },

            /** @override */
            update: function (p) {
                this.entityAdmin.update(p.state);
            },
        });
    });
};
