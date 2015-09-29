describe('todo.controller.Todo', function () {
    'use strict';

    var TodoController = require('../../../src/js/todo/controller/Todo');
    var immutable = require('immutabilis');

    describe('todo:create', function () {
        it('provides an handler for the "todo:create" event', function () {
            // prepare
            var testSubject = TodoController.brew();

            // execute
            var handler = getHandler(testSubject, 'todo:create');

            // verify
            expect(typeof handler).toBe('function');
        });

        it('can add new todos', function () {
            // prepare
            var testSubject = TodoController.brew();
            var handler = getHandler(testSubject, 'todo:create');
            var state = immutable.fromJS({ todos: [] });
            var data = { text: 'Some task that has to be done' };

            // execute
            var newState = handler.call(testSubject, state, data);
            var newTodo = newState.sub('todos').val()[0];

            // verify
            expect(typeof newTodo).toBe('object');
            expect(newTodo.text).toBe(data.text);
            expect(newTodo.editing).toBe(false);
            expect(newTodo.completed).toBe(false);
        });
    });

    describe('todo:update', function () {
        it('provides an handler for the "todo:update" event', function () {
            // prepare
            var testSubject = TodoController.brew();

            // execute
            var handler = getHandler(testSubject, 'todo:update');

            // verify
            expect(typeof handler).toBe('function');
        });

        it('can update a single todo', function () {
            // prepare
            var testSubject = TodoController.brew();
            var handler = getHandler(testSubject, 'todo:update');
            var todos = [{
                id: 'foo',
                text: 'Foo',
                completed: false,
                editing: false,
            }, {
                id: 'bar',
                text: 'Bar',
                completed: false,
                editing: false,
            }];
            var state = immutable.fromJS({ todos: todos });

            // execute
            var newState = handler.call(testSubject, state, {
                id: 'foo',
                text: 'Foo (modified)',
                completed: true,
                editing: true,
            });

            // verify
            expect(newState.sub('todos').val()).toEqual([{
                id: 'foo',
                text: 'Foo (modified)',
                completed: true,
                editing: true,
            }, {
                id: 'bar',
                text: 'Bar',
                completed: false,
                editing: false,
            }]);
        });
    });

    describe('todo:delete', function () {
        it('provides an handler for the "todo:delete" event', function () {
            // prepare
            var testSubject = TodoController.brew();

            // execute
            var handler = getHandler(testSubject, 'todo:delete');

            // verify
            expect(typeof handler).toBe('function');
        });

        it('can delete a single todo by its id', function () {
            // prepare
            var testSubject = TodoController.brew();
            var handler = getHandler(testSubject, 'todo:delete');
            var todos = [{
                id: 'foo',
                text: 'Foo',
                completed: false,
                editing: false,
            }, {
                id: 'bar',
                text: 'Bar',
                completed: false,
                editing: false,
            }];
            var state = immutable.fromJS({ todos: todos });

            // execute
            var newState = handler.call(testSubject, state, {
                id: 'foo',
            });

            // verify
            expect(newState.sub('todos').val()).toEqual([{
                id: 'bar',
                text: 'Bar',
                completed: false,
                editing: false,
            }]);
        });
    });

    describe('todo:deletecompleted', function () {
        it('provides an handler for the "todo:deletecompleted" event', function () {
            // prepare
            var testSubject = TodoController.brew();

            // execute
            var handler = getHandler(testSubject, 'todo:deletecompleted');

            // verify
            expect(typeof handler).toBe('function');
        });

        it('can delete all completed todos at once', function () {
            // prepare
            var testSubject = TodoController.brew();
            var handler = getHandler(testSubject, 'todo:deletecompleted');
            var todos = [{
                id: 'foo',
                text: 'Foo',
                completed: true,
                editing: false,
            }, {
                id: 'bar',
                text: 'Bar',
                completed: false,
                editing: false,
            }, {
                id: 'baz',
                text: 'Baz',
                completed: true,
                editing: false,
            }];
            var state = immutable.fromJS({ todos: todos });

            // execute
            var newState = handler.call(testSubject, state);

            // verify
            expect(newState.sub('todos').val()).toEqual([{
                id: 'bar',
                text: 'Bar',
                completed: false,
                editing: false,
            }]);
        });
    });

    describe('todo:updateall', function () {
        it('provides an handler for the "todo:updateall" event', function () {
            // prepare
            var testSubject = TodoController.brew();

            // execute
            var handler = getHandler(testSubject, 'todo:updateall');

            // verify
            expect(typeof handler).toBe('function');
        });

        it('can update all todos at once', function () {
            // prepare
            var testSubject = TodoController.brew();
            var handler = getHandler(testSubject, 'todo:updateall');
            var todos = [{
                id: 'foo',
                text: 'Foo',
                completed: false,
                editing: false,
            }, {
                id: 'bar',
                text: 'Bar',
                completed: false,
                editing: false,
            }];
            var state = immutable.fromJS({ todos: todos });

            // execute
            var newState = handler.call(testSubject, state, {
                text: 'New text',
                completed: true,
                editing: true,
            });

            // verify
            expect(newState.sub('todos').val()).toEqual([{
                id: 'foo',
                text: 'New text',
                completed: true,
                editing: true,
            }, {
                id: 'bar',
                text: 'New text',
                completed: true,
                editing: true,
            }]);
        });
    });

    function getHandler(testSubject, eventName) {
        var funName = testSubject.messages[eventName];
        return testSubject[funName];
    }
});
