/**
 * Checks for browser bugs and capabilities, provides common interfaces for browser-specific extensions
 */
Firestorm.Environment = {
	/**
	 * opera|ie|firefox|chrome|safari|unknown
	 * @readonly
	 * @type {string}
	 */
	browser_name: null,
	/**
	 * Browser version number
	 * @readonly
	 * @type {string}
	 */
	browser_version: null,
	/**
	 * ios|windows|other|?
	 * @readonly
	 * @type {number}
	 */
	platform: null,

	/**
	 * Environment capabilities. Names of each index are stored in {@link Firestorm#CAPABILITY_NAMES}
	 * @type {Array.<boolean>}
	 */
	capabilities: [],

	/**
	 * Test for each capability from {@link Firestorm#CAPABILITY_NAMES}, used by {@link Firestorm.Environment}.
	 * You do not need to call these methods directly
	 * @type {Array.<function>}
	 */
	tests: [
		function(document) {
			// last check is for IE9 which only partially supports ranges
			return ('createRange' in document) && (typeof Range !== 'undefined') && Range.prototype.createContextualFragment;
		},
		function(document, div) {
			div.innerHTML = "<div></div>";
			div.firstChild.innerHTML = "<script></script>";
			return div.firstChild.innerHTML === '';
		},
		function(document, div) {
			div.innerHTML = "Test: <script type='text/x-placeholder'></script>Value";
			return div.childNodes[0].nodeValue === 'Test:' && div.childNodes[2].nodeValue === ' Value';
		},
		function(document) {
			return ("documentMode" in document) && document.documentMode < 10;
		}
	],

	/**
	 * Calls requestAnimationFrame, if browser supports it. Actual method name may have a vendor prefix in different browsers.
	 * If browser does not support requestAnimationFrame - this method will be <kw>null</kw>
	 * @param {function} callback
	 */
	requestAnimationFrame: function(callback) { Firestorm.t(1); },

	/**
	 * Perform the object initialization
	 */
	init: function() {

		var document = window.document,
			div = document.createElement('div'),
			requestAnimationFrame,
			tests = this.tests,
			i = 0,
			count = tests.length;

		this.browser_name = Browser.name;
		this.browser_version = Browser.version;
		this.platform = Browser.platform;

		requestAnimationFrame =
			window.requestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.msRequestAnimationFrame;

		this.requestAnimationFrame = requestAnimationFrame ? function(fn) { requestAnimationFrame.call(window, fn); } : null;

		for (; i < count; i++) {

			this.capabilities[i] = tests[i](document, div);

		}

	}

};