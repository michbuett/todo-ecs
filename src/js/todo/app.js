module.exports = (function () {
    'use strict';

    var each = require('pro-singulis');
    var immutable = require('immutabilis');
    var Applicatus = require('alchemy.js/lib/Applicatus');

    var TodoController = require('./controller/Todo');
    var StorageController = require('./controller/Storage');
    var UI = require('./ui');

    /**
     * @class
     * @name todo.app
     * @extends alchemy.web.Applicatus
     */
    return Applicatus.extend({
        /** @lends todo.app.prototype */

        /** @override */
        onLaunch: function () {
            this.ui.init(this.state);
        },

        /** @override */
        update: function (p) {
            this.messages.trigger('app:update', p);

            var route = window.location.hash || '#/';
            var state = p.state.set('route', route);

            this.ui.update(state);

            return state;
        },
    }).whenBrewed(function () {
        this.state = immutable.fromJS({
            route: '#/',
            todos: [],
            numOfCompleted: 0,
            numOfUnCompleted: 0,
        });

        this.ui = UI.brew({
            messages: this.messages,
        });

        each([
            StorageController.brew(),
            TodoController.brew(),
        ], this.wireUp, this);
    });
}());
