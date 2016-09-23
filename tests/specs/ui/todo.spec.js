/* global $ */
describe('todo.ui (Todo)', function () {
    'use strict';

    var immutable = require('immutabilis');
    var Observari = require('alchemy.js/lib/Observari');

    var UI = require('../../../src/js/todo/ui');

    beforeEach(setUp);

    afterEach(tearDown);

    it('renders a single todos', function () {
        // prepare
        var state = this.state.set('todos', [{
            id: 'foo',
            text: 'Foo Text',
            completed: false,
            editing: true,
        }, {
            id: 'bar',
            text: 'Bar Text',
            completed: true,
            editing: false,
        }]);

        // execute
        this.ui.update(state);

        // verify
        expect($('#foo label')).toHaveText('Foo Text');
        expect($('#foo .toggle')).not.toBeChecked();
        expect($('#foo')).not.toHaveClass('completed');
        expect($('#foo')).toHaveClass('editing');

        expect($('#bar label')).toHaveText('Bar Text');
        expect($('#bar .toggle')).toBeChecked();
        expect($('#bar')).toHaveClass('completed');
        expect($('#bar')).not.toHaveClass('editing');
    });

    it('hides completed todos when showing active only', function () {
        // prepare
        var state = this.state.set('todos', [{
            id: 'foo',
            text: 'Foo Text',
            completed: false,
            editing: true,
        }, {
            id: 'bar',
            text: 'Bar Text',
            completed: true,
            editing: false,
        }]);

        // execute
        this.ui.update(state.set('route', '#/active'));

        // verify
        expect($('#foo')).not.toHaveClass('hidden');

        expect($('#bar')).toHaveClass('hidden');
    });

    it('hides active todos when showing completed only', function () {
        // prepare
        var state = this.state.set('todos', [{
            id: 'foo',
            text: 'Foo Text',
            completed: false,
            editing: true,
        }, {
            id: 'bar',
            text: 'Bar Text',
            completed: true,
            editing: false,
        }]);

        // execute
        this.ui.update(state.set('route', '#/completed'));

        // verify
        expect($('#foo')).toHaveClass('hidden');

        expect($('#bar')).not.toHaveClass('hidden');
    });

    it('allows to complete a single todos', function () {
        // prepare
        var spy = jasmine.createSpy();
        var state = this.state.set('todos', [{
            id: 'foo',
            text: 'Foo',
            completed: false,
            editing: false,
        }]);

        this.messages.on('todo:update', spy);
        this.ui.update(state);

        // execute
        $('#foo input.toggle').click();

        // verify
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.mostRecent().args[0]).toEqual({
            id: 'foo',
            completed: true,
        });
    });

    it('allows to edit a single todos on double click', function () {
        // prepare
        var spy = jasmine.createSpy();
        var state = this.state.set('todos', [{
            id: 'foo',
            text: 'Foo',
            completed: false,
            editing: false,
        }]);

        this.messages.on('todo:update', spy);
        this.ui.update(state);

        // execute
        $('#foo label').dblclick();

        // verify
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.mostRecent().args[0]).toEqual({
            id: 'foo',
            editing: true,
        });
    });

    it('ignores double clicking completed todos', function () {
        // prepare
        var spy = jasmine.createSpy();
        var state = this.state.set('todos', [{
            id: 'foo',
            text: 'Foo',
            completed: true,
            editing: false,
        }]);

        this.messages.on('todo:update', spy);
        this.ui.update(state);

        // execute
        $('#foo label').dblclick();

        // verify
        expect(spy).not.toHaveBeenCalled();
    });

    it('allows to delete a single todos when clicking "X"', function () {
        // prepare
        var spy = jasmine.createSpy();
        var state = this.state.set('todos', [{
            id: 'foo',
            text: 'Foo',
            completed: false,
            editing: false,
        }]);

        this.messages.on('todo:delete', spy);
        this.ui.update(state);

        // execute
        $('#foo button.destroy').click();

        // verify
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.mostRecent().args[0]).toEqual({
            id: 'foo',
        });
    });

    it('allows to change the todo text', function () {
        // prepare
        var spy = jasmine.createSpy();
        var state = this.state.set('todos', [{
            id: 'foo',
            text: 'Foo',
            completed: false,
            editing: true,
        }]);

        this.messages.on('todo:update', spy);
        this.ui.update(state);

        // execute
        $('#foo input.edit').val('New Foo Text');
        $('#foo input.edit').change();

        // verify
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.mostRecent().args[0]).toEqual({
            id: 'foo',
            text: 'New Foo Text',
            editing: false,
        });
    });

    it('ignores changing a completed todo', function () {
        // prepare
        var spy = jasmine.createSpy();
        var state = this.state.set('todos', [{
            id: 'foo',
            text: 'Foo',
            completed: true,
            editing: true,
        }]);

        this.messages.on('todo:update', spy);
        this.ui.update(state);

        // execute
        $('#foo input.edit').val('New Foo Text');
        $('#foo input.edit').change();

        // verify
        expect(spy).not.toHaveBeenCalled();
    });

    it('ignores changing the todo text to empty string', function () {
        // prepare
        var spy = jasmine.createSpy();
        var state = this.state.set('todos', [{
            id: 'foo',
            text: 'Foo',
            completed: false,
            editing: true,
        }]);

        this.messages.on('todo:update', spy);
        this.ui.update(state);

        // execute
        $('#foo input.edit').val('');
        $('#foo input.edit').change();

        // verify
        expect(spy).not.toHaveBeenCalled();
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
