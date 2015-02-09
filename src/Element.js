/**
 * Methods for working with DOM elements
 */
Firestorm.Element = {

	/**
	 * Init Firestorm.Element methods
	 */
	init: function() {

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
	 * Attach DOM listener to an element
	 * @param {HTMLElement} element The DOM element for attaching the event
	 * @param {string} event_name Name of DOM event
	 * @param {function} callback Callback for the listener
	 * @param {boolean} capture Use capturing phase
	 */
	addListener: function(element, event_name, callback, capture) {

		document.id(element).addEvent(event_name, callback, capture);

	},

	/**
	 * Detach DOM listener
	 * @param {HTMLElement} element
	 * @param {string} event_name
	 * @param {function} callback
	 */
	removeListener: function(element, event_name, callback) {

		document.id(element).removeEvent(event_name, callback);

	},

	/**
	 * Route events from elements inside `element` that match the `selector`
	 * @param {HTMLElement} element
	 * @param {string} event_name
	 * @param {string} selector CSS selector
	 * @param {function} callback
	 */
	addDelegation: function(element, event_name, selector, callback) {

		document.id(element).addEvent(event_name + ':relay(' + selector + ')', callback);

	},

	/**
	 * Stop delegating events
	 * @param {HTMLElement} element
	 * @param {string} event_name
	 * @param {string} selector CSS selector
	 * @param {function} callback
	 */
	removeDelegation: function(element, event_name, selector, callback) {

		document.id(element).removeEvent(event_name + ':relay(' + selector + ')', callback);

	},

	/**
	 * Remove an element from DOM and clean all framework dependencies on that element.
	 * Destroyed elements cannot be reused
	 * @param {HTMLElement} element
	 */
	destroy: function(element) {

		document.id(element).destroy();

	},

	/**
	 * Remove the element from DOM tree. After removal it may be inserted back
	 * @param {HTMLElement} element
	 */
	remove: function(element) {

		if (element.parentNode) {

			element.parentNode.removeChild(element);

		}

	},

	/**
	 * Perform search by id for {@link Firestorm.Element#findChildById}
	 * @param {HTMLElement} element
	 * @param {string} id
	 * @returns {HTMLElement}
	 */
	_findChildById: function(element, id) {

		var count,
			i,
			node,
			result = null;

		for (i = 0, count = element.childNodes.length; i < count; i++) {

			node = element.childNodes[i];
			if (node.nodeType == 1) {

				if (node.getAttribute('id') === id) {

					result = node;
					break;

				} else {

					result = this.findChildById(node, id);
					if (result) {
						break;
					}

				}

			}

		}

		return result;

	},

	/**
	 * Traverse element's children and find a child with given `id`
	 * @param {HTMLElement} element
	 * @param {string} id
	 * @returns {HTMLElement}
	 */
	findChildById: function(element, id) {

		return (element.getAttribute('id') === id) ? element : this._findChildById(element, id);

	},

	/**
	 * Insert an element relatively to `parent` element
	 * @param {HTMLElement} parent
	 * @param {HTMLElement} element
	 * @param {_eInsertPosition} where
	 */
	insertElement: function(parent, element, where) {

		this['insertElement' + where](parent, element);

	},

	/**
	 * Insert an element inside `parent`, at the top of it
	 * @param {HTMLElement} parent
	 * @param {HTMLElement} element
	 */
	insertElementTop: function(parent, element) {

		parent.insertBefore(element, parent.firstChild);

	},

	/**
	 * Insert an element inside `parent`, at the bottom of it
	 * @param {HTMLElement} parent
	 * @param {HTMLElement} element
	 */
	insertElementBottom: function(parent, element) {

		parent.appendChild(element);

	},

	/**
	 * Insert `target_element` just before `context`
	 * @param {HTMLElement} context
	 * @param {HTMLElement} target_element Element that is being inserted
	 */
	insertElementBefore: function(context, target_element) {

		context.parentNode.insertBefore(target_element, context);

	},

	/**
	 * Insert `target_element` after `context`
	 * @param {HTMLElement} context
	 * @param {HTMLElement} target_element Element that is being inserted
	 */
	insertElementAfter: function(context, target_element) {

		context.parentNode.insertBefore(target_element, context.nextSibling);

	},

	/**
	 * Get elements, that are contained in `element` and match the given `selector`
	 * @param {HTMLElement} element Root element
	 * @param {string} selector CSS selector
	 * @returns {Array.<HTMLElement>}
	 */
	selectElements: function(element, selector) {

		return Slick.search(element, selector, []);

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
	 * Add listed classes to the `element`
	 * @param {HTMLElement} element
	 * @param {Array.<string>} class_list
	 */
	addClasses: function(element, class_list) {

		for (var i = 0, count = class_list.length; i < count; i++) {

			this.addClass(element, class_list[i]);

		}

	},

	/**
	 * Remove all listed classes from `element`
	 * @param {HTMLElement} element
	 * @param {Array.<string>} class_list
	 */
	removeClasses: function(element, class_list) {

		for (var i = 0, count = class_list.length; i < count; i++) {

			this.removeClass(element, class_list[i]);

		}

	}

};