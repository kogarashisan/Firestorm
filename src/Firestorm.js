/*
Credits:
Some code is taken from Metamorph (https://github.com/tomhuda/metamorph.js/)
and MooTools (http://mootools.net/)
*/

/**
 * Low-level DOM manipulation and utility library
 */
var Firestorm = {

	/** @ignore */
	schema: null,
	/** @ignore */
	Environment: null,
	/** @ignore */
	DOM: null,
	/** @ignore */
	Element: null,
	/** @ignore */
	String: null,
	/** @ignore */
	Array: null,
	/** @ignore */
	Object: null,
	/** @ignore */
	Date: null,

	/**
	 * Browser capability names for {@link Firestorm.Environment#capabilities}
	 * @enum {number}
	 */
	CAPABILITY_NAMES: null,

	/**
	 * The map of numbered exception messages. May be excluded from production build
	 * @type {Object.<number, string>}
	 */
	KNOWN_EXCEPTIONS: null,

	/**
	 * Used by {@link Firestorm#getType}
	 * @type {Object.<string, string>}
	 */
	_descriptor_to_type: {
		"[object Boolean]": 'boolean',
		"[object Number]": 'number',
		"[object String]": 'string',
		"[object Function]": 'function',
		"[object Array]": 'array',
		"[object Date]": 'date',
		"[object RegExp]": 'regexp',
		"[object Object]": 'object',
		"[object Error]": 'error',
		"[object Null]": 'null',
		"[object Undefined]": 'undefined'
	},

	/**
	 * Browser key codes from keyboard events
	 * @enum {number}
	 */
	KEY_CODES: {
		ENTER: 13,
		ESCAPE: 27,
		LEFT_ARROW: 37,
		UP_ARROW: 38,
		RIGHT_ARROW: 39,
		DOWN_ARROW: 40
	},

	/**
	 * Framework must be initialized before it can be used
	 */
	init: function() {

		if (typeof(window) != 'undefined') {

			if (!('id' in window.document)) Firestorm.t("MooTools isn't loaded");

			this.Environment && this.Environment.init();
			this.DOM && this.DOM.init();
			this.Element && this.Element.init();

		}

		// You must know this yourself:
		// for (var name in {}) Firestorm.t("Firestorm framework can not coexist with frameworks that modify native object's prototype");

	},

	/**
	 * Get actual type of any JavaScript value
	 * @param {*} value Any value
	 * @returns {string} The type name, like "null", "object" or "regex"
	 */
	getType: function(value) {

		var result = 'null';

		// note: Regexp type may be both an object and a function in different browsers
		if (value !== null) {

			result = typeof(value);
			if (result == "object" || result == "function") {
				// this.toString refers to plain object's toString
				result = this._descriptor_to_type[this.toString.call(value)] || "object";
			}

		}

		return result;

	},

	/**
	 * Get HTML element by it's id attribute
	 * @param {string} id
	 * @returns {HTMLElement}
	 */
	getElementById: function(id) {

		return document.getElementById(id);

	},

	/**
	 * Copy all properties from `partial` to `base`
	 * @param {Object} base
	 * @param {Object} partial
	 */
	extend: function(base, partial) {

		for (var name in partial) {

			base[name] = partial[name];

		}

	},

	/**
	 * Copy all properties from `partial` to `base`, but do not overwrite existing properties
	 * @param {Object} base
	 * @param {Object} partial
	 */
	implement: function(base, partial) {

		for (var name in partial) {

			if (!(name in base)) {

				base[name] = partial[name];

			}

		}

	},

	/**
	 * Return all elements which match the given selector
	 * @param {string} selector CSS selector
	 * @returns {Array.<HTMLElement>}
	 */
	selectElements: function(selector) {

		return Slick.search(window.document, selector, []);

	},

	/**
	 * Get all elements with given tag name
	 * @param {string} tag_name
	 * @returns {NodeList}
	 */
	getElementsByTagName: function(tag_name) {

		return document.getElementsByTagName(tag_name);

	},

	/**
	 * Deep clone of given value
	 * @param {*} value
	 * @returns {*}
	 */
	clone: function(value) {

		switch (this.getType(value)) {
			case 'array':
				return this.Array.clone(value);
			case 'object':
				return this.Object.clone(value);
			default:
				return value;
		}

	},

	/**
	 * Throw an exception
	 * @param [message] Exception message
	 */
	t: function(message) {

		if (typeof(message) == 'number' && this.KNOWN_EXCEPTIONS && (message in this.KNOWN_EXCEPTIONS)) {
			throw new Error(this.KNOWN_EXCEPTIONS[message]);
		}

		throw new Error(message || 'Debug assertion failed');

	},

	/**
	 * Return <kw>true</kw>
	 * @returns {boolean} <kw>true</kw>
	 */
	'true': function() {return true},
	/**
	 * Return <kw>false</kw>
	 * @returns {boolean} <kw>false</kw>
	 */
	'false': function() {return false}

};