/**
 * DOM manipulation methods
 */
Firestorm.DOM = {

	/**
	 * When turning HTML into nodes - it must be inserted into appropriate tags to stay valid
	 */
	_wrap_map: {
		select: [1, "<select multiple='multiple'>", "</select>"],
		fieldset: [1, "<fieldset>", "</fieldset>"],
		table: [1, "<table>", "</table>"],
		tbody: [2, "<table><tbody>", "</tbody></table>"],
		thead: [2, "<table><tbody>", "</tbody></table>"],
		tfoot: [2, "<table><tbody>", "</tbody></table>"],
		tr: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
		colgroup: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
		map: [1, "<map>", "</map>"]
	},

	/**
	 * Workaround for browser bugs in IE. Equals to value of `STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS` capability
	 */
	_needs_shy: false,
	/**
	 * Workaround for browser bugs in IE. Equals to value of `MOVES_WHITESPACE_BEFORE_SCRIPT` capability
	 */
	_moves_whitespace: false,

	/**
	 * Init the object: choose appropriate methods for DOM manipulation, depending on browser capabilities
	 */
	init: function() {

		var e = Firestorm.Environment;

		this._needs_shy = e.capabilities[Firestorm.CAPABILITY_NAMES.STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS];
		this._moves_whitespace = e.capabilities[Firestorm.CAPABILITY_NAMES.MOVES_WHITESPACE_BEFORE_SCRIPT];

		if (Firestorm.schema.dom.PREFER_RANGE_API && e.capabilities[Firestorm.CAPABILITY_NAMES.SUPPORTS_RANGE]) {

			this.insertHTMLBefore = this.insertHTMLBefore_Range;
			this.insertHTMLAfter = this.insertHTMLAfter_Range;
			this.insertHTMLTop = this.insertHTMLTop_Range;
			this.insertHTMLBottom = this.insertHTMLBottom_Range;
			this.clearOuterRange = this.clearOuterRange_Range;
			this.clearInnerRange = this.clearInnerRange_Range;
			this.replaceInnerRange = this.replaceInnerRange_Range;
			this.moveRegionAfter = this.moveRegionAfter_Range;
			this.moveRegionBefore = this.moveRegionBefore_Range;

		} else {

			this.insertHTMLBefore = this.insertHTMLBefore_Nodes;
			this.insertHTMLAfter = this.insertHTMLAfter_Nodes;
			this.insertHTMLTop = this.insertHTMLTop_Nodes;
			this.insertHTMLBottom = this.insertHTMLBottom_Nodes;
			this.clearOuterRange = this.clearOuterRange_Nodes;
			this.clearInnerRange = this.clearInnerRange_Nodes;
			this.replaceInnerRange = this.replaceInnerRange_Nodes;
			this.moveRegionAfter = this.moveRegionAfter_Nodes;
			this.moveRegionBefore = this.moveRegionBefore_Nodes;

		}

	},

    /**
     * Clears all selected ranges on page.
     */
    clearSelections: function() {

        if (window.getSelection) {
            if (window.getSelection().empty) {
                window.getSelection().empty(); // Chrome
            } else if (window.getSelection().removeAllRanges) {
                window.getSelection().removeAllRanges(); // FF
            }
        } else if (document.selection) {
            document.selection.empty(); // IE
        }

    },

	/**
	 * Turn given HTML into DOM nodes and insert them before the given element
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBefore: function(element, html) { Firestorm.t(1); },
	/**
	 * Turn given HTML into DOM nodes and insert them after the given element
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLAfter: function(element, html) { Firestorm.t(1); },
	/**
	 * Turn given HTML into DOM nodes and insert them inside the given element, at the top of it
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLTop: function(element, html) { Firestorm.t(1); },
	/**
	 * Turn given HTML into DOM nodes and insert them inside the given element, at the bottom
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBottom: function(element, html) { Firestorm.t(1); },

	/**
	 * Remove all HTML nodes between the given elements and elements themselves
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearOuterRange: function(start_element, end_element) { Firestorm.t(1); },
	/**
	 * Remove all HTML nodes between the given elements
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearInnerRange: function(start_element, end_element) { Firestorm.t(1); },
	/**
	 * Remove all HTML nodes between the elements and insert the given html there
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 * @param {string} html
	 */
	replaceInnerRange: function(start_element, end_element, html) { Firestorm.t(1); },
	/**
	 * Move `region_start_element`, `region_end_element` and all elements between them before `target`
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionBefore: function(target, region_start_element, region_end_element) { Firestorm.t(1); },
	/**
	 * Move `region_start_element`, `region_end_element` and all elements between them after `target`
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionAfter: function(target, region_start_element, region_end_element) { Firestorm.t(1); },

	/**
	 * Turn HTML into nodes and insert them relatively to the given element
	 * @param {HTMLElement} element
	 * @param {string} html
	 * @param {_eInsertPosition} [position='Bottom']
	 */
	insertHTML: function(element, html, position) {

		this['insertHTML' + (position || 'Bottom')](element, html);

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// nodes api

	/**
	 * Set the element's innerHTML, taking into account various browser bugs
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	_setInnerHTML: function(element, html) {

		var matches,
			count,
			i,
			script;

		if (this._moves_whitespace) {
			matches = [];
			// Right now we only check for script tags with ids with the goal of targeting morphs.
			// Remove space before script to insert it later.
			html = html.replace(/(\s+)(<script id='([^']+)')/g, function(match, spaces, tag, id) {
				matches.push([id, spaces]);
				return tag;
			});

		}

		element.innerHTML = html;

		// If we have to do any whitespace adjustments, do them now
		if (matches && matches.length > 0) {

			count = matches.length;
			for (i = 0; i < count; i++) {
				script = Firestorm.Element.findChildById(element, matches[i][0]);
				script.parentNode.insertBefore(document.createTextNode(matches[i][1]), script);
			}

		}

	},

	/**
	 * Given a parent node and some HTML, generate a set of nodes. Return the first
	 * node, which will allow us to traverse the rest using nextSibling.
	 *
	 * In cases of certain elements like tables and lists we cannot just assign innerHTML and get the nodes,
	 * cause innerHTML is either readonly on them in IE, or it would destroy some of the content
	 *
	 * @param {HTMLElement} parentNode
	 * @param {string} html
	 **/
	_firstNodeFor: function(parentNode, html) {

		var map = this._wrap_map[parentNode.nodeName.toLowerCase()] || [ 0, "", "" ],
			depth = map[0],
			start = map[1],
			end = map[2],
			element,
			i,
			shy_element;

		if (this._needs_shy) {
			// make the first tag an invisible text node to retain scripts and styles at the beginning
			html = '&shy;' + html;
		}

		element = document.createElement('div');

		this._setInnerHTML(element, start + html + end);

		for (i = 0; i <= depth; i++) {

			element = element.firstChild;

		}

		if (this._needs_shy) {

			// Look for &shy; to remove it.
			shy_element = element;

			// Sometimes we get nameless elements with the shy inside
			while (shy_element.nodeType === 1 && !shy_element.nodeName) {
				shy_element = shy_element.firstChild;
			}

			// At this point it's the actual unicode character.
			if (shy_element.nodeType === 3 && shy_element.nodeValue.charAt(0) === "\u00AD") {
				shy_element.nodeValue = shy_element.nodeValue.slice(1);
			}

		}

		return element;

	},

	/**
	 * Remove everything between two tags
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearInnerRange_Nodes: function(start_element, end_element) {

		var parent_node = start_element.parentNode,
			node = start_element.nextSibling;

		while (node && node !== end_element) {

			parent_node.removeChild(node);
			node = start_element.nextSibling;

		}

	},

	/**
	 * Version of clearOuterRange, which manipulates HTML nodes
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearOuterRange_Nodes: function(start_element, end_element) {

		this.clearInnerRange_Nodes(start_element, end_element);
		start_element.parentNode.removeChild(start_element);
		end_element.parentNode.removeChild(end_element);

	},

	/**
	 * Version of replaceInnerRange, which manipulates HTML nodes
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 * @param {string} html
	 */
	replaceInnerRange_Nodes: function(start_element, end_element, html) {

		this.clearInnerRange_Nodes(start_element, end_element);
		this.insertHTMLBefore_Nodes(end_element, html);

	},

	/**
	 * Turn HTML into nodes with respect to the parent node and sequentially insert them before `insert_before` element
	 * @param {HTMLElement} parent_node
	 * @param {string} html
	 * @param {HTMLElement} insert_before
	 */
	_insertHTMLBefore: function(parent_node, html, insert_before) {

		var node,
			next_sibling;

		node = this._firstNodeFor(parent_node, html);

		while (node) {
			next_sibling = node.nextSibling;
			parent_node.insertBefore(node, insert_before);
			node = next_sibling;
		}

	},

	/**
	 * Version of insertHTMLAfter which works with nodes
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLAfter_Nodes: function(element, html) {

		this._insertHTMLBefore(element.parentNode, html, element.nextSibling);

	},

	/**
	 * Version of insertHTMLBefore which works with nodes
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBefore_Nodes: function(element, html) {

		this._insertHTMLBefore(element.parentNode, html, element);

	},

	/**
	 * Version of insertHTMLTop which works with nodes
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLTop_Nodes: function(element, html) {

		this._insertHTMLBefore(element, html, element.firstChild);

	},

	/**
	 * Version of insertHTMLBottom which works with nodes
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBottom_Nodes: function(element, html) {

		this._insertHTMLBefore(element, html, null);

	},

	/**
	 * Perform movement of a range of nodes
	 * @param {HTMLElement} parent
	 * @param {HTMLElement} target
	 * @param {HTMLElement} node
	 * @param {HTMLElement} region_end_element
	 */
	_moveRegionBefore: function(parent, target, node, region_end_element) {

		var next_sibling;

		while (node && node !== region_end_element) {
			next_sibling = node.nextSibling;
			parent.insertBefore(node, target);
			node = next_sibling;
		}
		parent.insertBefore(region_end_element, target);

	},

	/**
	 * Version of `moveRegionBefore`, which works with DOM nodes.
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionBefore_Nodes: function(target, region_start_element, region_end_element) {

		this._moveRegionBefore(target.parentNode, target, region_start_element, region_end_element);

	},

	/**
	 * Version of `moveRegionAfter`, which works with DOM nodes.
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionAfter_Nodes: function(target, region_start_element, region_end_element) {

		this._moveRegionBefore(target.parentNode, target.nextSibling, region_start_element, region_end_element);

	},

	// endL nodes api
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// range api

	/**
	 * Create a Range object, with limits between the given elements
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 * @returns {Range|TextRange}
	 */
	_createInnerRange: function(start_element, end_element) {

		var range = document.createRange();
		range.setStartAfter(start_element);
		range.setEndBefore(end_element);
		return range;

	},

	/**
	 * Create a Range object, which includes the given elements
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 * @returns {Range|TextRange}
	 */
	_createOuterRange: function(start_element, end_element) {

		var range = document.createRange();
		range.setStartBefore(start_element);
		range.setEndAfter(end_element);
		return range;

	},

	/**
	 * Version of replaceInnerRange, which works with Range API
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 * @param {string} html
	 */
	replaceInnerRange_Range: function(start_element, end_element, html) {

		var range = this._createInnerRange(start_element, end_element);

		range.deleteContents();
		range.insertNode(range.createContextualFragment(html));
	},

	/**
	 * Version of clearOuterRange, which works with Range API
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearOuterRange_Range: function(start_element, end_element) {

		var range = this._createOuterRange(start_element, end_element);
		range.deleteContents();

	},

	/**
	 * Version of clearInnerRange, which works with Range API
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearInnerRange_Range: function(start_element, end_element) {

		var range = this._createInnerRange(start_element, end_element);
		range.deleteContents();

	},

	/**
	 * Version of insertHTMLAfter, which works with Range API
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLAfter_Range: function(element, html) {

		var range = document.createRange();
		range.setStartAfter(element);
		range.setEndAfter(element);

		range.insertNode(range.createContextualFragment(html));

	},

	/**
	 * Version of insertHTMLBefore, which works with Range API
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBefore_Range: function(element, html) {

		var range = document.createRange();
		range.setStartBefore(element);
		range.setEndBefore(element);

		range.insertNode(range.createContextualFragment(html));

	},

	/**
	 * Version of insertHTMLTop, which works with Range API
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLTop_Range: function(element, html) {

		var range = document.createRange();
		range.setStart(element, 0);
		range.collapse(true);
		range.insertNode(range.createContextualFragment(html));

	},

	/**
	 * Version of insertHTMLBottom, which works with Range API
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBottom_Range: function(element, html) {

		var last_child = element.lastChild,
			range;

		if (last_child) {

			range = document.createRange();
			range.setStartAfter(last_child);
			range.collapse(true);
			range.insertNode(range.createContextualFragment(html));

		} else {

			this.insertHTMLTop_Range(element, html);

		}

	},

	/**
	 * Version of `moveRegionBefore`, which works with ranges
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionBefore_Range: function(target, region_start_element, region_end_element) {

		target.parentNode.insertBefore(
			this._createOuterRange(region_start_element, region_end_element).extractContents(),
			target
		);

	},

	/**
	 * Version of `moveRegionAfter`, which works with ranges
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionAfter_Range: function(target, region_start_element, region_end_element) {

		target.parentNode.insertBefore(
			this._createOuterRange(region_start_element, region_end_element).extractContents(),
			target.nextSibling
		);

	}

	// end: range api
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

};