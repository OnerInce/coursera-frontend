$(function () {


	$("#navbarToggler").blur(function (event) {
		var width = window.innerWidth;
		if (width < 768) {
			$("#navbarNav").collapse("hide");
		}
	})
});

(function (global) {

var rt = {};

var homeHtml = "snippets/home-snippet.html";
var allCategoriesUrl =
  "https://davids-restaurant.herokuapp.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl =
  "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

var insert = function (string, name, value){
	var holder = "{{" + name + "}}";
	string = string.replace(new RegExp(holder, "g"), value);

	return string;
};

var switchMenuToActive = function () {
  classes = document.querySelector("#navMenuButton").className;
  console.log(classes);
  if (classes.indexOf("active") == -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

document.addEventListener("DOMContentLoaded", function (event) {

showLoading("#main-content");
$ajaxUtils.sendGetRequest(
  homeHtml,
  function (responseText) {
    document.querySelector("#main-content")
      .innerHTML = responseText;
  },
  false);
});


rt.loadMenuCategories = function(){
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(
		allCategoriesUrl,
		buildCategories);
};

rt.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort,
    buildMenuItemsHTML);
};

function buildCategories (categories){
	$ajaxUtils.sendGetRequest(
		categoriesTitleHtml,
		function (categoriesTitleHtml) {
			$ajaxUtils.sendGetRequest(
				categoryHtml, function(categoryHtml){
					switchMenuToActive();
					var categoriesViewHtml = buildCategoriesViewHtml(categories, 
						categoriesTitleHtml, categoryHtml);
					insertHtml("#main-content", categoriesViewHtml);
				}, false);
		}, false);
}

function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml,
                                 categoryHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  for (var i = 0; i < categories.length; i++) {
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html = insert(html, "name", name);
    html = insert(html, "short_name", short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}

function buildMenuItemsHTML (categoryMenuItems) {
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
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

  menuItemsTitleHtml =
    insert(menuItemsTitleHtml,
                   "name",
                   categoryMenuItems.category.name);
  menuItemsTitleHtml =
    insert(menuItemsTitleHtml,
                   "special_instructions",
                   categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over menu items
  var menuItems = categoryMenuItems.menu_items;
  var catShortName = categoryMenuItems.category.short_name;
  for (var i = 0; i < menuItems.length; i++) {
    // Insert menu item values
    var html = menuItemHtml;
    html =
      insert(html, "short_name", menuItems[i].short_name);
    html =
      insert(html,
                     "catShortName",
                     catShortName);
    html =
      insertItemPrice(html,
                      "price_small",
                      menuItems[i].price_small);
    html =
      insertItemPortionName(html,
                            "small_portion_name",
                            menuItems[i].small_portion_name);
    html =
      insertItemPrice(html,
                      "price_large",
                      menuItems[i].price_large);
    html =
      insertItemPortionName(html,
                            "large_portion_name",
                            menuItems[i].large_portion_name);
    html =
      insert(html,
                     "name",
                     menuItems[i].name);
    html =
      insert(html,
                     "description",
                     menuItems[i].description);

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}


// Appends price with '$' if price exists
function insertItemPrice(html,
                         pricePropName,
                         priceValue) {
  // If not specified, replace with empty string
  if (!priceValue) {
    return insert(html, pricePropName, "");;
  }

  priceValue = "$" + priceValue.toFixed(2);
  html = insert(html, pricePropName, priceValue);
  return html;
}

// Appends portion name in parens if it exists
function insertItemPortionName(html,
                               portionPropName,
                               portionValue) {
  // If not specified, return original string
  if (!portionValue) {
    return insert(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = insert(html, portionPropName, portionValue);
  return html;
}

global.$rt = rt;

})(window);