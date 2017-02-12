
Firestorm.extend(
Firestorm.Element,
/**
 * @lends Firestorm.Element
 */
{

    _initProperties: function () {

        var root = document.documentElement;
        this.hasAttribute = (root && this._isNativeCode(root.hasAttribute))
            ? this.hasAttribute_A
            : this.hasAttribute_B;

    },

    _isNativeCode: function(f){

        return (/\{\s*\[native code\]\s*\}/).test('' + f);

    },

	/**
	 * Set a property on an element
	 * @param {HTMLElement} element Target element
	 * @param {string} name Property name
	 * @param {*} value Property value
	 */
	setProperty: function(element, name, value) {

        Firestorm.$(element).prop(name, value);

	},

    /**
     * Set inner HTML content of the element
     * @param {HTMLElement} element Target element
     * @param {*} value Property value
     */
    setHtml: function(element, value) {

        Firestorm.$(element).html(value);

    },

	/**
	 * Get element's property
	 * @param {HTMLElement} element
	 * @param {string} name
	 * @returns {*}
	 */
	getProperty: function(element, name) {

		return Firestorm.$(element).prop(name);

	},

	/**
	 * Does an element have an attribute
	 * @param {HTMLElement} element
	 * @param {string} name Attribute name
	 * @returns {boolean} True, if attribute exists
	 */
	hasAttribute: function(element, name) {

		Firestorm.t("Framework requires initialization");

	},

    /**
     * A version of hasAttribute()
     * @param {HTMLElement} element
     * @param {string} name
     * @returns {boolean}
     */
    hasAttribute_A: function(element, name) {

        return element.hasAttribute(name);

    },

    /**
     * A version of hasAttribute()
     * @param {HTMLElement} element
     * @param {string} name
     * @returns {boolean}
     */
    hasAttribute_B: function(element, name) {

        element = element.getAttributeNode(name);
        return !!(element && (element.specified || element.nodeValue));

    },

	/**
	 * Get attribute value from the element
	 * @param {HTMLElement} element
	 * @param {string} name Attribute name
	 * @returns {string} The attribute value
	 */
	getAttribute: function(element, name) {

		return Firestorm.$(element).attr(name);

	},

    /**
     * Sets attribute on element
     * @param {HTMLElement} element
     * @param {string} name Attribute name
     * @param {string} value attribute value
     */
    setAttribute: function(element, name, value) {

        return Firestorm.$(element).attr(name, value);

    },

    /**
     * Remove an attribute from the element
     * @param {HTMLElement} element
     * @param {string} name Attribute name
     */
    removeAttribute: function(element, name) {

        Firestorm.$(element).removeAttr(name);

    },

	/**
	 * Get element's tag name
	 * @param {HTMLElement} element
	 * @returns {string}
	 */
	getTagName: function(element) {

		return element.nodeName.toLowerCase();

	},

	/**
	 * Get element's `outerHTML`
	 * @param {HTMLElement} element
	 * @returns {string}
	 */
	getOuterHTML: function(element) {

		return element.outerHTML;

	}

});