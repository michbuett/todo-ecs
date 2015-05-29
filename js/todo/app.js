module.exports = function (alchemy) {
    'use strict';

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

    ], function (Applicatus, Administrator, Apothecarius, UI) {

        return alchemy.extend(Applicatus, {
            /** @lends todo.app.prototype */

            /** @override */
            constructor: function (cfg) {
                this.entityAdmin = Administrator.brew({
                    repo: Apothecarius.brew(),
                });

                this.ui = UI.brew();

                Applicatus.constructor.call(this, cfg);

                this.ui.initUI(this.entityAdmin, this.messages);
            },

            /** @override */
            update: function (p) {
                this.entityAdmin.update(p.state);
            },
        });
    });
};
