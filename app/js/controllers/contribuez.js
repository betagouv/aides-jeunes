'use strict';

/* global twttr */

angular.module('ddsApp').controller('ContribuezCtrl', function() {
  // copié-collé code tweeter
  (function(d,s,id) {
    var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
    if (! d.getElementById(id)) {
      js=d.createElement(s);
      js.id=id;
      js.src=p+'://platform.twitter.com/widgets.js';
      fjs.parentNode.insertBefore(js,fjs);
    } else {
      twttr.widgets.load();
    }
  })(document,'script','twitter-wjs');
});
