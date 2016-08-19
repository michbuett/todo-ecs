module.exports = (function () {
    'use strict';

    var coquoVenenum = require('coquo-venenum');
    var each = require('pro-singulis');

    var Delegatus = require('alchemy.js/lib/Delegatus');
    var Administrator = require('alchemy.js/lib/Administrator');
    var Apothecarius = require('alchemy.js/lib/Apothecarius');
    var EventSystem = require('alchemy.js/lib/EventSystem');
    var VDomRenderSystem = require('alchemy.js/lib/VDomRenderSystem');

    var viewport = require('./entities/Viewport');

    return coquoVenenum({

        messages: undefined,

        admin: undefined,

        delegator: undefined,

        init: function (state) {
            each([
                EventSystem,
                VDomRenderSystem,
            ], function (system) {
                this.admin.addSystem(system.brew({
                    delegator: this.delegator,
                    messages: this.messages,
                }));
            }, this);

            this.admin.initEntities([viewport({
                vdom: {
                    root: document.querySelector('.todoapp'),
                },
            })], state);
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
}());
