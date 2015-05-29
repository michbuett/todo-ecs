module.exports = function (alchemy) {
    'use strict';

    var controller = [
        'todo.controller.Todo',
        'todo.controller.Storage',
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
        'todo.ui',
        'todo.state',

    ].concat(controller), function (Applicatus, Administrator, Apothecarius, UI, State) {

        return alchemy.extend(Applicatus, {
            /** @lends todo.app.prototype */

            /** @override */
            constructor: function (cfg) {
                this.entityAdmin = Administrator.brew({
                    repo: Apothecarius.brew(),
                });

                this.ui = UI.brew();
                this.state = State.createAppState();

                Applicatus.constructor.call(this, cfg);

                this.ui.initUI(this.entityAdmin, this.messages, this.state);

                alchemy.each(controller, function (name) {
                    this.wireUp(alchemy(name));
                }, this);
            },

            /** @override */
            update: function (p) {
                this.messages.trigger('app:update', p);

                var route = window.location.hash || '#/';
                var state = p.state.set('route', route);

                this.entityAdmin.update(state);
            },
        });
    });
};
