$( function () {
	$("#navbarToggle").blur(function (event) {
		var screenWidth = window.innerWidth;
		if (screenWidth < 768) {
			$("#collapsable-nav").collapse('hide');
		}
	});
});

(function (global){
	var dc = {};

	var homeHtml = "snippets/home-snippet.html";
	var allCategoriesUrl = "http://davids-restaurant.herokuapp.com/categories.json";
	var categoriesTitleHtml = "snippets/categories-title-snippet.html";
	var categoryHtml = "snippets/category-snippet.html";

	// function for inserting innerHTML for 'selector'
	var insertHtml = function (selector, html) {
		var targetElem = document.querySelector(selector);
		targetElem.innerHTML = html;
	};
	// show loading icon inside element identified by 'selector'
	var showLoading = function (selector) {
		var html = "<div class='text-center'>";
		html += "<img src='images/ajax-loader.gif'></div>";
		insertHtml(selector, html);
	};

	var insertProperty = function (string, propName, propValue){
		var propToReplace = "{{" + propName + "}}";
		string = string.replace( new RegExp(propToReplace, "g"), propValue);
		return string;
	};
	// on page load (before images or css)
	document.addEventListener("DOMContentLoaded", function (event) {
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(
			homeHtml,
			function (responseText) {
			document.querySelector("#main-content").innerHTML = responseText;
			},
			false);
	});

	// load the menu categories view
	dc.loadMenuCategories = function () {
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(
			allCategoriesUrl,
			buildAndShowCategoriesHTML);
	};

	function buildAndShowCategoriesHTML(categories) {
		// Load title snippet of categories page
		$ajaxUtils.sendGetRequest(
			categoriesTitleHtml,
			function (categoriesTitleHtml) {
				// retrieve single category snippet
				$ajaxUtils.sendGetRequest(
					categoryHtml,
					function (categoryHtml) {
						var categoriesViewsHtml = 
							buildCategoriesViewHtml(categories,
													categoriesTitleHtml,
													categoryHtml);
						insertHtml("#main-content", categoriesViewsHtml);
					},
					false);
			},
			false);
	}

	// using data from categories and snippets
	// build categories view html
	function buildCategoriesViewHtml(categories,
									categoriesTitleHtml,
									categoryHtml) {
		var finalHtml = categoriesTitleHtml;
		finalHtml += "<section class='row'>";

		for (var i = 0; i < categories.length; i++) {
			var html = categoryHtml;
			var name = "" + categories[i].name;
			var short_name = categories[i].short_name;
			html = insertProperty(html, "name", name);
			html = insertProperty(html, "short_name", short_name);
			finalHtml += html;
		}
		finalHtml += "</section>";
		return finalHtml;
	}
	global.$dc = dc;
})(window);