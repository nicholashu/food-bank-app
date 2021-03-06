'use strict';

// Setting up routes
angular.module('questionnaire').config(['$stateProvider',
	function($stateProvider) {
		// Questionnaire state routing
		$stateProvider.
		state('root.questionnaires', {
			url: 'admin/questionnaires',
			views: {
				'content@': {
					templateUrl: 'modules/questionnaire/views/questionnaires.client.view.html',
					controller: 'QuestionnaireController as questionnaireCtrl'
				}
			}
		}).
		state('root.qtest', {
			url: 'admin/qtest',
			views: {
				'content@': {
					templateUrl: 'modules/questionnaire/views/qtest.client.view.html',
					controller: 'qTestController as qtCtrl'
				}
			}
		});
	}
]);
