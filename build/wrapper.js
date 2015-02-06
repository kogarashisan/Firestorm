(function (_global) {

/*<%firestorm_content%>*/

if (typeof module != 'undefined' && module.exports) {

	module.exports = Firestorm;

} else {

	var _previous_instance;

	if (_global != null) {
		_previous_instance = _global.Firestorm;
	}

	Firestorm.noConflict = function () {
		_global.Firestorm = _previous_instance;
		return Firestorm;
	};

	_global.Firestorm = Firestorm;

}

}(this));