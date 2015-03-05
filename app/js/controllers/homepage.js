'use strict';

angular.module('ddsApp').controller('HomepageCtrl', function($scope, droitsDescription) {
    $scope.droits = _.filter(droitsDescription, function(droit) {
        return false !== droit.isSimulated;
    });

    // code twitter copié-collé
    window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,"script","twitter-wjs"));
});
