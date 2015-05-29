(function () {
    'use strict';

    var alchemy = require('alchemy');

    alchemy.heatUp({
        path: {
            alchemy: 'bower_components/michbuett-alchemy/lib',
            todo: 'js/todo',
        },

        require: [
            'todo.app',
        ],

        onReady: function () {
            window.app = alchemy('todo.app').brew();
            window.app.launch();

            window.onunload = function () {
                window.app.dispose();
                window.app = null;
            };
        },
    });
}());

