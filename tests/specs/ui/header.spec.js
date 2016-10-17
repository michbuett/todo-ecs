/* global $, EventHelper */
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
        var spy = jasmine.createSpy();
        this.messages.on('todo:create', spy);
        this.ui.update(this.state);

        // execute
        $('.new-todo').val('test');
        EventHelper.pressEnter('keydown', '.new-todo');

        // verify
        expect(spy).toHaveBeenCalled();
    });

    it('clears the input element when pressing [ESC]', function () {
        // prepare
        var spy = jasmine.createSpy();
        this.messages.on('todo:create', spy);
        this.ui.update(this.state);

        // execute
        $('.new-todo').val('test');
        EventHelper.pressEsc('keydown', '.new-todo');

        // verify
        expect(spy).not.toHaveBeenCalled();
        expect($('.new-todo').val()).toBe('');
    });

    function setUp() {
        setFixtures([
            '<section id="viewport" class="todoapp"></section>',
            '<footer class="info"></footer>',
        ].join(''));

        /* jshint validthis: true */
        this.messages = Observari.brew();

        this.state = immutable.fromJS({
            route: '#/',
            todos: [],
            numOfCompleted: 0,
            numOfUnCompleted: 0,
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
