require('es6-promise').polyfill();  // needs to leak into global namespace for fetch polyfill
require('isomorphic-fetch');  // needs to leak into global namespace for mocking
