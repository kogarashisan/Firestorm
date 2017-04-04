
Firestorm.extend(
Firestorm.Element,
/**
 * @lends Firestorm.Element
 */
{

    _initStyles: function() {

        if (!!document.createElement('div').classList) {

            this.hasClass = this.hasClass_ClassList;
            this.addClass = this.addClass_ClassList;
            this.removeClass = this.removeClass_ClassList;

        } else {

            this.hasClass = this.hasClass_Old;
            this.addClass = this.addClass_Old;
            this.removeClass = this.removeClass_Old;

        }

    },

	/**
	 * Set one CSS property in element's "style" attribute
	 * @param {HTMLElement} element
	 * @param {string} name
	 * @param {string} value
	 */
	setStyle: function(element, name, value) {

        Firestorm.$(element).css(name, value);

	},

	/**
	 * Set CSS property, which accepts a list of pixel values (like <str>"border: 1px 2px 3px 4px"</str>)
	 * Rounds numbers and adds 'px' before setting them to element
	 *
	 * @param {HTMLElement} element
	 * @param {string} name
	 * @param {(Array.<(number)>)} value
	 */
	setPixels: function(element, name, value) {

		var style = '';

		for (var i = 0, count = value.length; i < count; i++) {

			if (Firestorm.schema.DEBUG && typeof value[i] != "number") Firestorm.t("Invalid argument passed to setPixels");
			style += Math.round(value[i]) + 'px ';

		}

		this.setStyle(element, name, style);

	},

	/**
	 * Get value of CSS style property
	 * @param {HTMLElement} element
	 * @param {string} name Name of the property, like <str>"height"</str>
	 * @returns {*}
	 */
	getStyle: function(element, name) {

		return Firestorm.$(element).css(name);

	},

	/**
	 * Set element's opacity
	 * @param {HTMLElement} element
	 * @param {(string|number)} value 0 <= value <= 1
	 */
	setOpacity: function(element, value) {

        Firestorm.$(element).css('opacity', value);

	},

	/**
	 * Get element's opacity
	 * @param {HTMLElement} element
	 * @returns {*}
	 */
	getOpacity: function(element) {

		return Firestorm.$(element).css('opacity');

	},

    /**
     * Set "class" property on `element`
     * @param {HTMLElement} element
     * @param {string} value
     */
    setClass: function(element, value) {

        ('className' in element) ? element.className = (value || '') : element.setAttribute('class', value);

    },

    /**
     * Get "class" property from `element`
     * @param {HTMLElement} element
     */
    getClass: function(element) {

        return ('className' in element) ? element.className || null : element.getAttribute('class');

    },

    /**
     * Check if element has `class_name`
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    hasClass: function(element, class_name) {

        Firestorm.t(1);

    },

    /**
     * `hasClass` variant for old browsers
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    hasClass_Old: function(element, class_name){

        return Firestorm.String.toClassList(element.className || '').contains(class_name);

    },

    /**
     * `hasClass` variant for modern browsers
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    hasClass_ClassList: function(element, class_name){

        return element.classList.contains(class_name);

    },

    /**
     * Add a <b>single</b> class to element
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    addClass: function(element, class_name) {

        Firestorm.t(1);

    },

    /**
     * `addClass` variant for old browsers
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    addClass_Old: function(element, class_name){

        element.className = Firestorm.String.toClassList(class_name + ' ' + element.className).join(' ');

    },

    /**
     * `addClass` variant for modern browsers
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    addClass_ClassList: function(element, class_name){

        element.classList.add(class_name);

    },

    /**
     * Remove a <b>single</b> class from element
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    removeClass: function(element, class_name) {

        Firestorm.t(1);

    },

    /**
     * `removeClass` variant for old browsers
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    removeClass_Old: function(element, class_name){

        var class_names = Firestorm.String.toClassList(element.className || '');
        Firestorm.Array.exclude(class_names, class_name);
        element.className = class_names.join(' ');

    },

    /**
     * `removeClass` variant for modern browsers
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    removeClass_ClassList: function(element, class_name){

        element.classList.remove(class_name);

    },

	/**
	 * Add a list of classes to element
	 * @param {HTMLElement} element
	 * @param {Array.<string>} class_list
	 */
	addClasses: function(element, class_list) {

		if (Firestorm.schema.DEBUG && typeof(class_list) == 'string') Firestorm.t();

		for (var i = 0, count = class_list.length; i < count; i++) {

			this.addClass(element, class_list[i]);

		}

	},

	/**
	 * Remove a list of classes from an element
	 * @param {HTMLElement} element
	 * @param {Array.<string>} class_list
	 */
	removeClasses: function(element, class_list) {

		if (Firestorm.schema.DEBUG && typeof(class_list) == 'string') Firestorm.t();

		for (var i = 0, count = class_list.length; i < count; i++) {

			this.removeClass(element, class_list[i]);

		}

	}

});