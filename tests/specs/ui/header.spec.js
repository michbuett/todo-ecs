/* global $ */
describe('todo.ui (Header)', function () {
    'use strict';

    var immutable = require('immutabilis');
    var Observari = require('alchemy.js/lib/Observari');

    var UI = require('../../../src/js/todo/ui');

    beforeEach(setUp);

    afterEach(tearDown);

    it('contains all required elements', function () {
        // prepare
        // execute
        this.ui.update(this.state);

        // verify
        expect($('header.header')).toExist();
        expect($('input.new-todo')).toExist();
    });

    it('allows to create new ToDos when pressing [RETURN]', function () {
        // prepare
        var e = $.Event('keydown');
        e.keyCode = 13; // [RETURN]
        var spy = jasmine.createSpy();
        this.messages.on('todo:create', spy);
        this.ui.update(this.state);

        // execute
        $('.new-todo').val('test');
        $('.new-todo').trigger(e);

        // verify
        expect(spy).toHaveBeenCalled();
    });

    it('clears the input element when pressing [ESC]', function () {
        // prepare
        var e = $.Event('keydown');
        e.keyCode = 27; // # Some key code value
        var spy = jasmine.createSpy();
        this.messages.on('todo:create', spy);
        this.ui.update(this.state);

        // execute
        $('.new-todo').val('test');
        $('.new-todo').trigger(e);

        // verify
        expect(spy).not.toHaveBeenCalled();
        expect($('.new-todo').val()).toBe('');
    });

    function setUp() {
        setFixtures([
            '<section class="todoapp"></section>',
            '<footer class="info"></footer>',
        ].join(''));

        /* jshint validthis: true */
        this.messages = Observari.brew();

        this.state = immutable.fromJS({
            route: '#/',
            todos: [],
        });

        this.ui = UI.brew({
            messages: this.messages,
        });

        this.ui.init(this.state);
        /* jshint validthis: false */
    }


    function tearDown() {
        /* jshint validthis: true */
        this.ui.dispose();
        this.messages.dispose();
        this.ui = null;
        this.state = null;
        this.messages = null;
        /* jshint validthis: false */
    }
});
