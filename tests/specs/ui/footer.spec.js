/* global $ */
describe('Footer', function () {
    'use strict';

    var alchemy = require('Alchemy.JS');

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
        this.entityAdmin.update(state);

        // verify
        expect($('span#todo-count')).toExist();
        expect($('span#todo-count')).toContainText('2 item(s) left');
    });

    it('Shows the current selected route', function () {
        // prepare
        var state = this.state.set('route', '#/active');

        // execute
        this.entityAdmin.update(state);

        // verify
        expect($('ul#filters > li > a[href="#/"]')).not.toHaveClass('selected');
        expect($('ul#filters > li > a[href="#/active"]')).toHaveClass('selected');
        expect($('ul#filters > li > a[href="#/completed"]')).not.toHaveClass('selected');
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
        this.entityAdmin.update(state);

        // verify
        expect($('button#clear-completed')).toExist();
        expect($('button#clear-completed')).toContainText('Clear completed (2)');
    });

    it('allows to delete all completed todos', function () {
        // prepare
        var spy = jasmine.createSpy();
        this.messages.on('todo:deletecompleted', spy);
        this.entityAdmin.update(this.state);

        // execute
        $('#clear-completed').click();

        // verify
        expect(spy).toHaveBeenCalled();
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
