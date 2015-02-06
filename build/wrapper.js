(function (_root) {

/*<%firestorm_content%>*/

if (typeof module != 'undefined' && module.exports) {

	module.exports = Firestorm;

} else {

	var _previous_instance;

	if (_root != null) {
		_previous_instance = _root.Firestorm;
	}

	Firestorm.noConflict = function () {
		_root.Firestorm = _previous_instance;
		return Firestorm;
	};

	_root.Firestorm = Firestorm;

}

}(this));