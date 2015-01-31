/*! OrbiaRowActions 0.1.0
* Copyright © 2015 Michał Biarda
*/

/**
* @summary OrbiaRowActions
* @description jQuery DataTables 1.10 plugin for row actions
* @version 0.1.0
* @file jquery.dataTables.orbiaRowActions.js
* @author Michał Biarda
* @contact m.biarda@gmail.com
* @copyright Copyright 2015 Michał Biarda
*
* This source file is free software, available under the following license:
* MIT license - http://opensource.org/licenses/MIT
*
* This source file is distributed in the hope that it will be useful, but
* WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
* or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
*/

(function($) {
	
	/**
	 * Returns DataTable renderer function for actions column.
	 * 
	 * @param {Array} actions - List of actions. Each action is an object
	 *		with possible keys and values presented below:
	 *		
	 *	"title": {String} - required
	 *	"urlPattern": {String} - required; this pattern will be used for generating
	 *		row action URL in the way that all occurencies of "%key%" will be
	 *		replaced by the data from row["key"]
	 *	"conditions": {Object} - optional; for each row, action will be shown if
	 *		all conditions are met, object property names should be "data" indexes
	 * 
	 * @returns {Function}
	 * 
	 * @example
	 * 
	 *	$(document).ready(function {
	 *		$("#example").DataTable({
	 *			"columns": [
	 *				...,
	 *				[
	 *					'name' => 'actions',
	 *					'data' => 'id', // may be whatever; it's not used at all
	 *					'title' => 'Actions',
	 *					'orderable' => false,
	 *					'sortable' => false,
	 *					'render' => $.fn.DataTable.OrbiaRowActions([
	 *						// Edit action will be show only if "is_editable" column
	 *						// has a value of "1".
	 *						['title' => 'Edit', 'urlPattern' => '/examples/edit/%id%', 'conditions' => {
	 *							'is_editable' => '1'
	 *						}],
	 *						['title' => 'View', 'urlPattern' => '/examples/view/%slug%']
	 *					])
	 *				]
	 *			]
	 *		});
	 *	});
	 */
	$.fn.dataTable.OrbiaRowActions = function(actions) {
		return function(data, type, row, meta) {
			if (type === 'display') {
				var ul = $("<ul>");
				$.each(actions, function() {
					if (!this.title || !this.urlPattern) {
						console && console.warn('Title or urlPattern not set.');
					} else {
						var show = true;
						if (this.conditions) {
							for (var column in this.conditions) {
								var value = this.conditions[column];
								if (row[column] !== value) {
									show = false;
								}
							}
						}
						if (show) {
							var li = $("<li>");
							var a = $("<a>")
									.attr('href', _useRowDataOnString(this.urlPattern, row))
									.html(this.title);
							li.append(a).appendTo(ul);
						}
					}
				});
				return ul.get(0).outerHTML;
			}
			return data;
		};
	};
	$.fn.DataTable.OrbiaRowActions = $.fn.dataTable.OrbiaRowActions;
	
	/**
	 * Replaces all occurences of "%key%" in string with data from row["key"].
	 * 
	 * @param {String} str
	 * @param {Object} row
	 * @returns {String}
	 */
	var _useRowDataOnString = function(str, row) {
		$.each(row, function(column) {
			str = str.replace('%' + column + '%', this);
		});
		return str;
	};

})(jQuery);