module.exports = (function () {
    'use strict';

    var coquoVenenum = require('coquo-venenum');

    var Delegatus = require('alchemy.js/lib/Delegatus');
    var Administrator = require('alchemy.js/lib/Administrator');
    var EventSystem = require('alchemy.js/lib/EventSystem');
    var VDomRenderSystem = require('alchemy.js/lib/VDomRenderSystem');

    var viewport = require('./entities/Viewport');

    return coquoVenenum({

        messages: undefined,

        admin: undefined,

        delegator: undefined,

        init: function (state) {
            this.admin = Administrator.brew({
                systems: [
                    VDomRenderSystem.brew(),
                    EventSystem.brew({
                        messages: this.messages,
                        delegator: this.delegator,
                    })
                ],

                entities: function (state) {
                    return [viewport(state)];
                },
            });
        },

        update: function (state) {
            this.admin.update(state);
        },

    }).whenBrewed(function () {
        this.delegator = Delegatus.brew();
    });
}());
