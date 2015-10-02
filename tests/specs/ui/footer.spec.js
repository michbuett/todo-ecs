/* global $ */
describe('todo.ui (Footer)', function () {
    'use strict';

    var immutable = require('immutabilis');
    var Observari = require('alchemy.js/lib/Observari');

    var UI = require('../../../src/js/todo/ui');

    beforeEach(setUp);

    afterEach(tearDown);

    it('shows the number of uncomplete todos', function () {
        // prepare
        var state = this.state.set('todos', [{
            id: 'foo',
            text: 'Foo',
            completed: false,
            editing: false,
        }, {
            id: 'bar',
            text: 'Bar',
            completed: false,
            editing: false,
        }]);

        // execute
        this.ui.update(state);

        // verify
        expect($('span.todo-count')).toExist();
        expect($('span.todo-count')).toContainText('2 item(s) left');
    });

    it('Shows the current selected route', function () {
        // prepare
        var state = this.state.set('route', '#/active');

        // execute
        this.ui.update(state);

        // verify
        expect($('ul.filters > li > a[href="#/"]')).not.toHaveClass('selected');
        expect($('ul.filters > li > a[href="#/active"]')).toHaveClass('selected');
        expect($('ul.filters > li > a[href="#/completed"]')).not.toHaveClass('selected');
    });

    it('hides the "Clear completed" button if there are no completed todos', function () {
        // prepare
        var state = this.state.set('todos', [{
            id: 'foo',
            text: 'Foo',
            completed: false,
            editing: false,
        }, {
            id: 'bar',
            text: 'Bar',
            completed: false,
            editing: false,
        }]);

        // execute
        this.ui.update(state);

        // verify
        expect($('button.clear-completed')).toExist();
        expect($('button.clear-completed')).toHaveClass('hidden');
    });

    it('shows the number of complete todos', function () {
        // prepare
        var state = this.state.set('todos', [{
            id: 'foo',
            text: 'Foo',
            completed: true,
            editing: false,
        }, {
            id: 'bar',
            text: 'Bar',
            completed: true,
            editing: false,
        }]);

        // execute
        this.ui.update(state);

        // verify
        expect($('button.clear-completed')).toExist();
        expect($('button.clear-completed')).toContainText('Clear completed (2)');
    });

    it('allows to delete all completed todos', function () {
        // prepare
        var spy = jasmine.createSpy();
        this.messages.on('todo:deletecompleted', spy);
        this.ui.update(this.state);

        // execute
        $('.clear-completed').click();

        // verify
        expect(spy).toHaveBeenCalled();
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
