'use strict';

var app = angular.module('ddsCommon');

app.directive('keywordInput', function($timeout) {
    return {
        restrict: 'E',
        templateUrl: '/acceptance-tests/partials/keywordInput.html',
        scope: {
            keywords: '=',
            selectedKeywords: '='
        },
        controller: function($scope) {
            $scope.showTags = true;

            $scope.addKeyword = function(keyword) {
                var newKeyword;
                if (keyword) {
                    newKeyword = keyword;
                } else {
                    newKeyword = $scope.currentKeyword;
                }
                if ($scope.keywords.indexOf(newKeyword) >= 0) {
                    if ($scope.selectedKeywords.indexOf(newKeyword) < 0 ) {
                        $scope.selectedKeywords.push(newKeyword);
                    }
                    $scope.currentKeyword = '';
                }
            };

            $scope.removeKeyword = function(idx) {
                $scope.selectedKeywords.splice(idx, 1);
            };

            $scope.setFocusOnInput = function(id) {
                $timeout(function() {
                    var element = document.getElementById(id);
                    if (element) {
                        element.focus();
                    }
                });
            };

            $scope.toggleShowTags = function() {
                $scope.showTags = !$scope.showTags;
            };

            $scope.isSelected = function(keyword) {
                return false === $scope.selectedKeywords.indexOf(keyword) >= 0;
            };
        }
    };
});

app.directive('ngInputEnter', function () {
    return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
            if(event.which === 13 || event.which === 9) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngInputEnter);
                });

                event.preventDefault();
            }
        });
    };
});
