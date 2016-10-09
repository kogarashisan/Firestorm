Firestorm.extend(
Firestorm.Element,
/**
 * @lends Firestorm.Element
 */
{

    _storeHandler: function (wrapped_element, key, handler, callback) {

        var event_data = wrapped_element.data(key);
        if (!event_data) {
            event_data = {
                handlers: [],
                callbacks: []
            };
            wrapped_element.data(key, event_data);
        }
        event_data.handlers.push(handler);
        event_data.callbacks.push(callback);

    },

    _removeCallback: function (wrapped_element, key, callback) {

        var event_data = wrapped_element.data(key),
            real_handler;

        if (event_data) {
            var callback_index = event_data.callbacks.indexOf(callback);
            if (callback_index != -1) {
                real_handler = event_data.handlers[callback_index];
                event_data.callbacks.splice(callback_index, 1);
                event_data.handlers.splice(callback_index, 1);
            }
        }

        return real_handler;

    },

    /**
     * Attach DOM listener to an element
     * @param {HTMLElement} element The DOM element for attaching the event
     * @param {string} event_name Name of DOM event
     * @param {function} callback Callback for the listener
     */
    addListener: function(element, event_name, callback) {

        var real_handler = function (event_object) {
            callback(new Firestorm.Event(event_object.originalEvent, event_object));
        };
        $(element).on(event_name, real_handler);

        this._storeHandler($(element), 'FE_' + event_name, real_handler, callback);

    },

    /**
     * Detach DOM listener
     * @param {HTMLElement} element
     * @param {string} event_name
     * @param {function} callback
     */
    removeListener: function(element, event_name, callback) {

        var real_handler = this._removeCallback($(element), 'FE_' + event_name, callback);
        real_handler && $(element).off(event_name, real_handler);

    },

    /**
     * Route events from elements inside `element` that match the `selector`
     * @param {HTMLElement} element
     * @param {string} event_name
     * @param {string} selector CSS selector
     * @param {function} callback
     */
    addDelegation: function(element, event_name, selector, callback) {

        var real_handler = function (event_object) {
            callback(new Firestorm.Event(event_object.originalEvent, event_object));
        };
        $(element).on(event_name, selector, callback);
        this._storeHandler($(element), 'FE_D_' + event_name + '|' + selector, real_handler, callback);

    },

    /**
     * Stop delegating events
     * @param {HTMLElement} element
     * @param {string} event_name
     * @param {string} selector CSS selector
     * @param {function} callback
     */
    removeDelegation: function(element, event_name, selector, callback) {

        var real_handler = this._removeCallback($(element), 'FE_D_' + event_name + '|' + selector, callback);
        real_handler && $(element).off(event_name, selector, real_handler);

    }

});