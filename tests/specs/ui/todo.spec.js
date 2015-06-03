/* global $ */
describe('Todo', function () {
    'use strict';

    var alchemy = require('Alchemy.JS');

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
        this.entityAdmin.update(state);

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
        this.entityAdmin.update(state.set('route', '#/active'));

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
        this.entityAdmin.update(state.set('route', '#/completed'));

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
        this.entityAdmin.update(state);

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
        this.entityAdmin.update(state);

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
        this.entityAdmin.update(state);

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
        this.entityAdmin.update(state);

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
        this.entityAdmin.update(state);

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
        this.entityAdmin.update(state);

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
        this.entityAdmin.update(state);

        // execute
        $('#foo input.edit').val('');
        $('#foo input.edit').change();

        // verify
        expect(spy).not.toHaveBeenCalled();
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
