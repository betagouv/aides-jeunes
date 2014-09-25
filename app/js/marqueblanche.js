(function() {
    'use strict';
    var baseUrl = '/';
    if (window.location.pathname.indexOf('/secours-populaire') === 0) {
        baseUrl += 'secours-populaire/';
    }

    var docHead = document.getElementsByTagName('head')[0];
    docHead.insertAdjacentHTML('beforeend', '<base href="' + baseUrl + '">');
})();
