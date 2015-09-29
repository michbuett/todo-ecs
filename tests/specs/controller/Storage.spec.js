describe('todo.controller.Storage', function () {
    'use strict';

    var StorageController = require('../../../src/js/todo/controller/Storage');
    var immutable = require('immutabilis');
    var STORAGE_KEY = 'alchemy-todo';

    afterEach(function () {
        localStorage.removeItem(STORAGE_KEY);
    });

    describe('app:start', function () {
        it('provides an handler for the "app:start" event', function () {
            // prepare
            var testSubject = StorageController.brew();

            // execute
            var funName = testSubject.messages['app:start'];
            var handler = testSubject[funName];

            // verify
            expect(typeof handler).toBe('function');
        });

        it('does not modify the state if there are todos stored', function () {
            // prepare
            var state = immutable.fromJS({ todos: [1, 2] });
            var testSubject = StorageController.brew();
            var funName = testSubject.messages['app:start'];
            var handler = testSubject[funName];

            // execute
            var newState = handler.call(testSubject, state);

            // verify
            expect(newState).toBe(state);
        });

        it('sets the todos from localStorage if there are todos stored', function () {
            // prepare
            var state = immutable.fromJS({ todos: [1, 2] });
            var testSubject = StorageController.brew();
            var funName = testSubject.messages['app:start'];
            var handler = testSubject[funName];

            localStorage.setItem(STORAGE_KEY, '[1,2,3]');

            // execute
            var newState = handler.call(testSubject, state);

            // verify
            expect(newState).not.toBe(state);
            expect(newState.val()).toEqual({
                todos: [1, 2, 3]
            });
        });
    });

    describe('app:update', function () {
        it('provides an handler for the "app:update" event', function () {
            // prepare
            var testSubject = StorageController.brew();

            // execute
            var funName = testSubject.messages['app:update'];
            var handler = testSubject[funName];

            // verify
            expect(typeof handler).toBe('function');
        });

        it('stores the todos in local storage', function () {
            // prepare
            var todos = [1, 2, 3];
            var state = immutable.fromJS({ todos: todos });
            var testSubject = StorageController.brew();
            var funName = testSubject.messages['app:update'];
            var handler = testSubject[funName];
            spyOn(localStorage, 'setItem');

            // execute
            handler.call(testSubject, state);

            // verify
            expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(todos));
        });

        it('does not call the localStorage if todos have not changed', function () {
            // prepare
            var todos = [1, 2, 3];
            var state = immutable.fromJS({ todos: todos });
            var testSubject = StorageController.brew();
            var funName = testSubject.messages['app:update'];
            var handler = testSubject[funName];

            handler.call(testSubject, state);
            state = state.set('foo', 'bar');
            spyOn(localStorage, 'setItem');

            // execute
            handler.call(testSubject, state);

            // verify
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });

        it('does not modify the state', function () {
            // prepare
            var state = immutable.fromJS({ todos: [1, 2] });
            var testSubject = StorageController.brew();
            var funName = testSubject.messages['app:update'];
            var handler = testSubject[funName];

            // execute
            var newState1 = handler.call(testSubject, state);
            var newState2 = handler.call(testSubject, newState1);

            // verify
            expect(newState1).toBe(state);
            expect(newState2).toBe(state);
        });
    });
});
