
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
			count = tests.length,
            Browser = this._getBrowserObject();

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

	},

    // sorry for this copy-paste from MooTools. I needed it urgently.
    _getBrowserObject: function () {

        var document = window.document;

        var parse = function(ua, platform){
            ua = ua.toLowerCase();
            platform = (platform ? platform.toLowerCase() : '');

            // chrome is included in the edge UA, so need to check for edge first,
            // before checking if it's chrome.
            var UA = ua.match(/(edge)[\s\/:]([\w\d\.]+)/);
            if (!UA){
                UA = ua.match(/(opera|ie|firefox|chrome|trident|crios|version)[\s\/:]([\w\d\.]+)?.*?(safari|(?:rv[\s\/:]|version[\s\/:])([\w\d\.]+)|$)/) || [null, 'unknown', 0];
            }

            if (UA[1] == 'trident'){
                UA[1] = 'ie';
                if (UA[4]) UA[2] = UA[4];
            } else if (UA[1] == 'crios'){
                UA[1] = 'chrome';
            }

            platform = ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || ua.match(/mac|win|linux/) || ['other'])[0];
            if (platform == 'win') platform = 'windows';

            return {
                extend: Function.prototype.extend,
                name: (UA[1] == 'version') ? UA[3] : UA[1],
                version: parseFloat((UA[1] == 'opera' && UA[4]) ? UA[4] : UA[2]),
                platform: platform
            };
        };

        var Browser = parse(navigator.userAgent, navigator.platform);

        if (Browser.name == 'ie' && document.documentMode){
            Browser.version = document.documentMode;
        }

        return Browser;

    }

};