/* global $ */
describe('TodoList', function () {
    'use strict';

    var alchemy = require('Alchemy.JS');

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
        this.entityAdmin.update(state);

        // verify
        expect($('ul#todo-list #foo')).toExist();
        expect($('ul#todo-list #bar')).toExist();
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
        this.entityAdmin.update(state);

        // execute
        $('input#toggle-all').click();

        // verify
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.mostRecent().args[0]).toEqual({
            completed: true,
        });
    });

    it('checks the #toggle-all checkbox if all todos are completed', function () {
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
        this.entityAdmin.update(state);

        // verify
        expect($('input#toggle-all')).toBeChecked();
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
