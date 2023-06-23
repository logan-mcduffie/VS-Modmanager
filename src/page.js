"use strict";
function goToPage(pageName, pageElements, buttons) {
    var pageElement = pageElements[pageName];
    var button = buttons[pageName];
    if (!pageElement || !button) {
        console.error("Page or button \"".concat(pageName, "\" not found"));
        return;
    }
    // Hide all pages and remove 'active' class from all buttons
    for (var _i = 0, _a = Object.keys(pageElements); _i < _a.length; _i++) {
        var page = _a[_i];
        pageElements[page].style.display = 'none';
        buttons[page].classList.remove('active');
    }
    // Show the current page and add 'active' class to the current button
    pageElement.style.display = 'grid';
    button.classList.add('active');
    document.getElementById('modpack-content').innerHTML = '';
}
// Export functions
module.exports = {
    goToPage: goToPage
};