"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goToPage = void 0;
function goToPage(pageName, pageElements, buttons) {
    const pageElement = pageElements[pageName];
    const button = buttons[pageName];
    if (!pageElement || !button) {
        console.error(`Page or button "${pageName}" not found`);
        return;
    }
    // Hide all pages and remove 'active' class from all buttons
    for (const page of Object.keys(pageElements)) {
        pageElements[page].style.display = 'none';
        buttons[page].classList.remove('active');
    }
    // Show the current page and add 'active' class to the current button
    pageElement.style.display = 'grid';
    button.classList.add('active');
    const modpackContent = document.getElementById('modpack-content');
    if (modpackContent) {
        modpackContent.innerHTML = '';
    }
}
exports.goToPage = goToPage;
