// @todo вынести в глобальные константы как в КМ, особенно DEBUG

/**
 * Settings for the Firestorm library
 */
Firestorm.schema = {
	dom: {
		/**
		 * Allow using of Range API, if browser is capable of it
		 * @const
		 */
		PREFER_RANGE_API: false
	},
	/**
	 * Sort algorithm is called stable, if it preserves order of items that are already sorted. Suitable for ordering
	 * table data by several columns
	 * @const
	 */
	DEFAULT_STABLE_SORT_ALGORITHM: 'mergeSort',
	/**
	 * Unstable algorithms are faster, but subsequent sorts mess the previous sort results
	 * @const
	 */
	DEFAULT_UNSTABLE_SORT_ALGORITHM: 'mergeSort',
	/**
	 * Perform DEBUG checks. May be <kw>false</kw> in production,
	 * but it's strictly recommended to keep it <kw>true</kw> during development and testing
	 * @define
	 */
	DEBUG: true
};