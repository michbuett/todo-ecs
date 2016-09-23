/* global $ */
describe('todo.ui (TodoList)', function () {
    'use strict';

    var immutable = require('immutabilis');
    var Observari = require('alchemy.js/lib/Observari');

    var UI = require('../../../src/js/todo/ui');

    beforeEach(setUp);

    afterEach(tearDown);

    it('renders all todos', function () {
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
        expect($('ul.todo-list #foo')).toExist();
        expect($('ul.todo-list #bar')).toExist();
    });

    it('allows to complete all todos', function () {
        // prepare
        var spy = jasmine.createSpy();
        var state = this.state.set('todos', [{
            id: 'foo',
            text: 'Foo',
            completed: false,
            editing: false,
        }]);

        this.messages.on('todo:updateall', spy);
        this.ui.update(state);

        // execute
        $('input.toggle-all').click();

        // verify
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.mostRecent().args[0]).toEqual({
            completed: true,
        });
    });

    it('checks the .toggle-all checkbox if all todos are completed', function () {
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
        expect($('input.toggle-all')).toBeChecked();
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
