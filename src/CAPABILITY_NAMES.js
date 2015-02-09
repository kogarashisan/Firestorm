/**
 * @enum {number}
 */
Firestorm.CAPABILITY_NAMES = {

	// all, even old browsers, must be able to convert a function back to sources
	//SUPPORTS_FUNCTION_SERIALIZATION = /xyz/.test(function(){xyz;});

	/**
	 * Supports HTML Range API
	 */
	SUPPORTS_RANGE: 0,
	/**
	 * Internet Explorer < 9 strips SCRIPT and STYLE tags from beginning of innerHTML
	 */
	STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS: 1,
	/**
	 * IE 8 (and likely earlier) likes to move whitespace preceding a script tag to appear after it.
	 * This means that we can accidentally remove whitespace when updating a morph
	 */
	MOVES_WHITESPACE_BEFORE_SCRIPT: 2,
	/**
	 * IE8 and IE9 have bugs in "input" event, see
	 * http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html
	 */
	NEEDS_INPUT_EVENT_SHIM: 3
};