window.EventHelper = (function () {
    'use strict';

    return {
        pressEnter: function (eventName, selector) {
            var ev = createKeyboardEvent(eventName, 'Enter');
            document.querySelector(selector).dispatchEvent(ev);
        },

        pressEsc: function (eventName, selector) {
            var ev = createKeyboardEvent(eventName, 'Escape');
            document.querySelector(selector).dispatchEvent(ev);
        },

        click: function (selector) {
            var ev = createMouseEvent('click');
            document.querySelector(selector).dispatchEvent(ev);
        },

        dblclick: function (selector) {
            var ev = createMouseEvent('dblclick');
            document.querySelector(selector).dispatchEvent(ev);
        },

        change: function (selector) {
            var ev = document.createEvent('Event');
            ev.initEvent('change', true, true);
            document.querySelector(selector).dispatchEvent(ev);
        },
    };

    ///////////////////////////////////////////////////////////////////////////
    // PRIVATE HELPER

    function createMouseEvent(eventName) {
        if (typeof window.MouseEvent === 'function') {
            return new window.MouseEvent(eventName, {
                bubbles: true,
            });
        }

        var ev = document.createEvent('MouseEvent');
        ev.initEvent(eventName, true, true);

        return ev;
    }

    function createKeyboardEvent(eventName, key) {
        if (typeof window.KeyboardEvent === 'function') {
            return new window.KeyboardEvent(eventName, {
                key: key,
                code: key,
                bubbles: true,
            });
        }

        var ev = document.createEvent('KeyboardEvent');
        ev.initEvent(eventName, true, true);
        ev.key = key;
        ev.code = key;

        return ev;
    }
}());
