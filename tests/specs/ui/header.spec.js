/* global $ */
describe('Header', function () {
    'use strict';

    var alchemy = require('Alchemy.JS');

    beforeEach(setUp);

    afterEach(tearDown);

    it('contains all required elements', function () {
        // prepare
        // execute
        this.entityAdmin.update(this.state);

        // verify
        expect($('header#header')).toExist();
        expect($('input#new-todo')).toExist();
    });

    it('allows to create new ToDos when pressing [RETURN]', function () {
        // prepare
        var e = $.Event("keydown");
        e.keyCode = 13; // [RETURN]
        var spy = jasmine.createSpy();
        this.messages.on('todo:create', spy);
        this.entityAdmin.update(this.state);

        // execute
        $('#new-todo').val('test');
        $('#new-todo').trigger(e);

        // verify
        expect(spy).toHaveBeenCalled();
    });

    it('clears the input element when pressing [ESC]', function () {
        // prepare
        var e = $.Event("keydown");
        e.keyCode = 27; // # Some key code value
        var spy = jasmine.createSpy();
        this.messages.on('todo:create', spy);
        this.entityAdmin.update(this.state);

        // execute
        $('#new-todo').val('test');
        $('#new-todo').trigger(e);

        // verify
        expect(spy).not.toHaveBeenCalled();
        expect($('#new-todo').val()).toBe('');
    });

    function setUp() {
        setFixtures([
            '<section id="todoapp"></section>',
            '<footer id="info"></footer>',
        ].join(''));

        /* jshint validthis: true */
        this.messages = alchemy('alchemy.core.Observari').brew();

        this.entityRepo = alchemy('alchemy.ecs.Apothecarius').brew();

        this.entityAdmin = alchemy('alchemy.ecs.Administrator').brew({
            repo: this.entityRepo,
        });

        this.state = alchemy('Immutatio').makeImmutable({
            route: '#/',
            todos: [],
        });

        this.ui = alchemy('todo.ui').brew();
        this.ui.initUI(this.entityAdmin, this.messages, this.state);
        /* jshint validthis: false */
    }


    function tearDown() {
        /* jshint validthis: true */
        alchemy.each(['messages', 'entityRepo', 'entityAdmin', 'state', 'ui'], function (prop) {
            if (typeof this[prop].dispose === 'function') {
                this[prop].dispose();
            }

            this[prop] = null;
        }, this);
        /* jshint validthis: false */
    }
});
