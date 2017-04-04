
/**
 * Thanks MooTools authors for this (rewritten) piece of code.
 */
Firestorm.Event = function(event, jquery_event) {

    //if (!win) win = window;
    //event = event || win.event;

    this.event = event;
    this.jquery_event = jquery_event;

    this.shift = event.shiftKey;
    this.control = event.ctrlKey;
    this.alt = event.altKey;
    this.meta = event.metaKey;
    var type = event.type;
    this.type = type;

    var target = event.target || event.srcElement;
    while (target && target.nodeType == 3) target = target.parentNode;
    this.target = target;

    var normalizer = this._normalizers[type];
    if (!normalizer) {
        if (type.indexOf('key') == 0) {
            normalizer = 'Keyboard';
        } else if (type.indexOf('mouse') == 0) {
            normalizer = 'Mouse';
        } else if (type.indexOf('touch') == 0 || type.indexOf('gesture') == 0) {
            normalizer = 'Touch';
        }
    }

    normalizer && this['_normalize' + normalizer](event, type);

};

Firestorm.extend(Firestorm.Event.prototype, {

    _normalizers: {
        'click': "Mouse",
        'dblclick': "Mouse",
        'contextmenu': "Mouse",
        'wheel': "Mouse",
        'DOMMouseScroll': "Mouse"
    },

    _keys: {
        '38': 'up',
        '40': 'down',
        '37': 'left',
        '39': 'right',
        '27': 'esc',
        '32': 'space',
        '8': 'backspace',
        '9': 'tab',
        '46': 'delete',
        '13': 'enter'
    },

    stopPropagation: function(){

        if (this.event.stopPropagation) {
            this.event.stopPropagation();
        } else {
            this.event.cancelBubble = true;
        }

    },

    preventDefault: function(){

        if (this.event.preventDefault) {
            this.event.preventDefault();
        } else {
            this.event.returnValue = false;
        }

    },

    _normalizeKeyboard: function(event, type) {

        var code = this.code = (event.which || event.keyCode);
        if (!this.shift || type != 'keypress') {
            this.key = this._keys[code];
        }
        if (type == 'keydown' || type == 'keyup') {
            if (code > 111 && code < 124) {
                this.key = 'f' + (code - 111);
            } else if (code > 95 && code < 106) {
                this.key = code - 96;
            }
        }
        if (this.key == null) {
            this.key = String.fromCharCode(code).toLowerCase();
        }

    },

    _normalizeMouse: function(event, type) {

        var doc = window.document;
        doc = (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
        this.page = {
            x: (event.pageX != null) ? event.pageX : event.clientX + doc.scrollLeft,
            y: (event.pageY != null) ? event.pageY : event.clientY + doc.scrollTop
        };
        this.client = {
            x: (event.pageX != null) ? event.pageX - window.pageXOffset : event.clientX,
            y: (event.pageY != null) ? event.pageY - window.pageYOffset : event.clientY
        };
        if (type == 'DOMMouseScroll' || type == 'wheel' || type == 'mousewheel') {
            this.wheel = this._normalizeWheelSpeed(event);
        }
        this.rightClick = (event.which == 3 || event.button == 2);
        if (type == 'mouseover' || type == 'mouseout' || type == 'mouseenter' || type == 'mouseleave') {
            var overTarget = type == 'mouseover' || type == 'mouseenter';
            var related = event.relatedTarget || event[(overTarget ? 'from' : 'to') + 'Element'];
            while (related && related.nodeType == 3) {
                related = related.parentNode;
            }
            this.relatedTarget = related;
        }

    },

    _normalizeTouch: function(event, type) {

        this.rotation = event.rotation;
        this.scale = event.scale;
        this.targetTouches = event.targetTouches;
        this.changedTouches = event.changedTouches;
        var touches = this.touches = event.touches;
        if (touches && touches[0]){
            var touch = touches[0];
            this.page = {
                x: touch.pageX,
                y: touch.pageY
            };
            this.client = {
                x: touch.clientX,
                y: touch.clientY
            };
        }

    },

    _normalizeWheelSpeed: function(event) {

        var normalized;
        if (event.wheelDelta){
            normalized = event.wheelDelta % 120 == 0 ? event.wheelDelta / 120 : event.wheelDelta / 12;
        } else {
            var rawAmount = event.deltaY || event.detail || 0;
            normalized = -(rawAmount % 3 == 0 ? rawAmount / 3 : rawAmount * 10);
        }
        return normalized;

    }

});