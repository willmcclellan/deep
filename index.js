/**
 * Deep is a utility library for working with objects with deeply nested properties
 */

var _ = require('lodash');

var Deep = (function() {

	function isTopLevel(path) {
		return path.indexOf('.') === -1;
	};

	/**
	 * Get the deep property of an object in a safe javascript way
	 * http://stackoverflow.com/questions/8051975/access-object-child-properties-using-a-dot-notation-string
	 * @param Object obj the object to get the property from
	 * @param String path dot.seperated.path to the property you want to retrieve
	 */
	function getDescendantProperty(obj, path) {
		var arr = path.split('.');
		while(arr.length && (obj = obj[arr.shift()])) {}
		return obj;
	};

	/**
	 * Sets the value of a descendent property
	 * @param Object obj   the object to modify
	 * @param String path  dot.seperated.path to the child value you want to set
	 * @param Mixed value  the value you want to set
	 */
	function setDescendantProperty(obj, path, value) {
		var requiredArguments = obj && path && value;

		if (!requiredArguments) {
			return;
		}

		if (isTopLevel(path)) {
			return obj[path] = value;
		}

		var pathArr = path.split('.');
		// pop out last item in properties
		var lastChild = pathArr.pop();
		// user get descendent property with rest of tree
		var lastChildParent = getDescendantProperty(obj, pathArr.join('.'));

		// return undefined if last child parent has no value
		if (!lastChildParent) {
			return undefined;
		}
		return lastChildParent[lastChild] = value;
	};

	/**
	 * helper for setting properties when updating models. Mainly for descendent properties where it's hard to avoid deep nested js errors otherwise.
	 * @param Object dest     	The object to update
	 * @param Object source   	The object to get update from
	 * @param String property 	Dot seperated value of field, e.g. 'parent.child.child'
	 */
	function updateDescendantProperty(dest, source, path) {
		var requiredArguments = dest && source && path;
		// If we arent provided all required args just return undefined
		if (!requiredArguments) {
			return;
		}

		var isDescendentProp = path.indexOf('.') !== -1;
		var originalValue = getDescendantProperty(dest, path);
		var sourceValue = getDescendantProperty(source, path);
		var pathParts = path.split('.'); // split the path path into an array
		var parentPath = _.initial(pathParts).join('.'); // get the parent path using initial, converting it back into a string
		var lastPart = _.last(pathParts);
		var sourceParentObject = getDescendantProperty(source, parentPath);
	
		// If we have no source path, just return, nothing to set here
		if (!sourceValue) {
			return;
		}

		// If the path references a non descendant property (i.e. its just one level) and that property exists on the source, just set the detination to that
		if (!isDescendentProp && source[path]) {
			return dest[path] = source[path];
		}
		// If we have no parent object of the descendant property we want to set OR the last part of the path is not a key in the parent object then we don't have enought information to do anything
		if (!sourceParentObject || !(lastPart in sourceParentObject)) {
			return;
		}
		
		// Otherwise set the dest path
		return setDescendantProperty(dest, path, sourceValue);
	};

	return {
		get: getDescendantProperty,
		set: setDescendantProperty,
		update: updateDescendantProperty
	};

})();

module.exports = Deep;
