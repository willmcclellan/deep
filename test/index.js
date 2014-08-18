/**
 * Deep tests
 */

var should = require('should');
var _ = require('lodash');

var Deep = require('../index.js');

describe('Deep', function() {

	describe('set', function() {

		it('should set the descendant property of an object at one level', function(done) {
			var obj = {
				hello: undefined
			};
			Deep.set(obj, 'hello', 'world');
			obj.should.have.property('hello', 'world');
			done();
		});

		it('should set the descendant property of an object at second level', function(done) {
			var obj = {
				hello: {
					world: undefined
				}
			};
			Deep.set(obj, 'hello.world', 'again');
			obj.hello.should.have.property('world', 'again');
			done();
		});

		it('should do nothing when no obj is passed', function(done) {
			Deep.set(undefined, 'hello', 'world');
			done();
		});

		it('should do nothing when no path is passed', function(done) {
			var obj = {
				hello: undefined
			};
			Deep.set(obj, undefined, 'world');
			done();
		});

		it('should do nothing when no value is passed', function(done) {
			var obj = {
				hello: undefined
			};
			Deep.set(obj, 'hello', undefined);
			done();
		});

	});

	describe('get', function() {

		it('should get the descendant property of an object at one level', function(done) {
			var obj = {
				hello: 'world'
			};
			var value = Deep.get(obj, 'hello');
			value.should.eql('world');
			done();
		});

		it('should get the descendant property of an object at second level', function(done) {
			var obj = {
				hello: {
					world: 'again'
				}
			};
			var value = Deep.get(obj, 'hello.world');
			value.should.eql('again');
			done();
		});

	});

	describe('update', function() {

		it('should update the destinations path with the value of source path at first level', function(done) {
			var destination = {
				hello: undefined
			};
			var source = {
				hello: 'world'
			};
			var path = 'hello';
			Deep.update(destination, source, path);
			destination.should.have.property('hello', 'world');
			done();
		});

		it('should update the destinations path with the value of source path at second level', function(done) {
			var destination = {
				hello: {
					world: undefined
				}
			};
			var source = {
				hello: {
					world: 'again'
				} 
			};
			var path = 'hello.world';
			Deep.update(destination, source, path);
			destination.hello.should.have.property('world', 'again');
			done();
		});
	
		it('should update the destinations path with the value of source path at third level', function(done) {
			var destination = {
				hello: {
					world: {
						again: 'inital value'
					}
				}
			};
			var source = {
				hello: {
					world: {
						again: 'new value'
					}
				} 
			};
			var path = 'hello.world.again';
			Deep.update(destination, source, path);
			destination.hello.world.should.have.property('again', 'new value');
			done();
		});

	});

});
