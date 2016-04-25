'use strict';

if (! Object.isEmpty) {
	Object.defineProperty(Object, 'isEmpty', {
		value: function(object) {
			return ! Object.keys(object).length;
		}
	});
} else {
	throw 'Object.isEmpty is already defined.';
}
