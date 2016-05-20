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
	var menuItemsUrl = "http://davids-restaurant.herokuapp.com/menu_items.json?category=";
	var menuItemsTitleHtml = "snippets/menu-items-title.html";
	var menuItemHtml = "snippets/menu-item.html";

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
	// remove the class 'active' from home and switch to menu button
	var switchMenuToActive = function () {
		var classes = document.querySelector("#navHomeButton").className;
		classes = classes.replace(new RegExp("active", "g"), "");
		document.querySelector("#navHomeButton").className = classes;

		classes = document.querySelector("#navMenuButton").className;
		if (classes.indexOf("active") == -1) {
			classes += " active";
			document.querySelector("#navMenuButton").className = classes;
		}
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
	// load menu item view
	dc.loadMenuItems = function (categoryShort) {
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(
			menuItemsUrl + categoryShort,
			buildAndShowMenuItemsHTML);
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
						switchMenuToActive();
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

	function buildAndShowMenuItemsHTML(categoryMenuItems) {
		$ajaxUtils.sendGetRequest(
			menuItemsTitleHtml,
			function (menuItemsTitleHtml) {
				// retrieve single category snippet
				$ajaxUtils.sendGetRequest(
					menuItemHtml,
					function (menuItemHtml) {
						switchMenuToActive();
						var menuItemsViewHtml = 
							buildMenuItemsViewHtml(categoryMenuItems,
													menuItemsTitleHtml,
													menuItemHtml);
						insertHtml("#main-content", menuItemsViewHtml);
					},
					false);
			},
			false);
	}

	function buildMenuItemsViewHtml(categoryMenuItems,
									menuItemsTitleHtml,
									menuItemHtml) {
		menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
											"name",
											categoryMenuItems.category.name);
		menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
			 								"special_instructions",
			 								categoryMenuItems.category.special_instructions);
		var finalHtml = menuItemsTitleHtml;
		finalHtml += "<section class='row'>";

		// loop over categories
		var menuItems = categoryMenuItems.menu_items;
		var catShortName = categoryMenuItems.category.short_name;
		for (var i = 0; i < menuItems.length; i++) {
			var html = menuItemHtml;
			html = insertProperty(html, "short_name", menuItems[i].short_name);
			html = insertProperty(html, "catShortName", catShortName);
			html = insertItemPrice(html, "price_small", menuItems[i].price_small);
			html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
			html = insertItemPrice(html, "price_large", menuItems[i].price_large);
			html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
			html = insertProperty(html, "name", menuItems[i].name);
			html = insertProperty(html, "description", menuItems[i].description);
			finalHtml += html;
			// add clear fix after every second menu item
			if (i % 2 !== 0) {
				html += "<div class='clearfix visible-lg-block visible-md-block'></div>";
			}
			finalHtml += html;
		}

		finalHtml += "</section>";
		return finalHtml;
	}

	function insertItemPrice(html, pricePropName, priceValue){
		// if not specified, replace with empty string
		if (!priceValue) {
			return insertProperty(html, pricePropName, "");
		}
		priceValue = "$" + priceValue.toFixed(2);
		html = insertProperty(html, pricePropName, priceValue);
		return html;
	}

	function insertItemPortionName(html, PortionPropName, portionValue){
		// if not specified, replace with empty string
		if (!portionValue) {
			return insertProperty(html, PortionPropName, "");
		}
		portionValue = '(' + portionValue + ')';
		html = insertProperty(html, PortionPropName, portionValue);
		return html;
	}
	global.$dc = dc;
})(window);