var Udar=angular.module('Udar', ['ngRoute', 'ngAnimate']);


Udar.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/list', {
			templateUrl : 'views/list.html',
			controller: 'udarController'
		}).otherwise({
			redirectTo: '/list'
		});
}]);

Udar.controller('udarController', ['$scope','$http','$window', function($scope, $http, $compile){
	 firebase.auth().onAuthStateChanged(function(user) {
	    if (user) {
	      document.getElementById('logInForm').style.display="none";
	      document.getElementById("List").style.display="block";
	      console.log(user);

	      $scope.udarDisp();
	    } 
	    else {
	      document.getElementById("logInForm").style.display="block";
	      document.getElementById("List").style.display="none";
	      console.log("please Log In");
	    }
	  });
	$scope.udarLogin= function(){
		firebase.auth().signInWithEmailAndPassword($scope.user.udarEmail , $scope.user.udarPassword)
			.catch(function(error) {
				$scope.$apply(function(){
					$scope.errorCode = error.code;
					$scope.errorMessage = error.message;
					$scope.udarErrorLogin = true;
				});

			});
		

	};
	$scope.udarSignup=function(){
		firebase.auth().createUserWithEmailAndPassword($scope.user.udarEmail , $scope.user.udarPassword)
			.catch(function(error) {
				$scope.$apply(function(){
					$scope.errorCode = error.code;
					$scope.errorMessage = error.message;
					$scope.udarErrorLogin = true;
				});
		});
	};

	$scope.udarTaken = function(){
		var currentUser = firebase.auth().currentUser;
		console.log(currentUser.uid);
		var database = firebase.database().ref().child(currentUser.uid).child("List");
		database.push().set({
			name: $scope.newUdar.name,
			price: $scope.newUdar.price,
			taken: true
		});
		/*$scope.udarList.push({
			udarName : $scope.newUdar.name,
			udarPrice : $scope.newUdar.price,
			udarTaken: true
		});*/
		$scope.newUdar.name="";
		$scope.newUdar.price= "";
		console.log("Added");
	}
	$scope.udarGiven = function(){
		var currentUser = firebase.auth().currentUser;
		console.log(currentUser.uid);
		var database = firebase.database().ref().child(currentUser.uid).child("List");
		database.push().set({
			name: $scope.newUdar.name,
			price: $scope.newUdar.price,
			taken: false
		});
		/*$scope.udarList.push({
			udarName : $scope.newUdar.name,
			udarPrice : $scope.newUdar.price,
			udarTaken: false
		});*/
		$scope.newUdar.name="";
		$scope.newUdar.price= "";
		console.log("Added");

	};
	$scope.udarList = [];
	$scope.udarRemove = function(item, snapKey){
		console.log("remove");
		var currentUser = firebase.auth().currentUser;
		var ref=firebase.database().ref().child(currentUser.uid).child("List");
		ref.child(snapKey).remove();
		var removedItem = $scope.udarList.indexOf(item);
		$scope.udarList.splice(removedItem, 1);
	};
	$scope.udarLogout= function(){
		firebase.auth().signOut().then(function() {
			console.log("signOut");
		}).catch(function(error) {
			console.log("Error Signing out: " + error);
		});
	};
	$scope.udarDisp = function(){
		
		$scope.disp='block';
		var currentUser = firebase.auth().currentUser;
		console.log(currentUser.uid);
		var rootRef=firebase.database().ref().child(currentUser.uid).child("List");
		rootRef.on("child_added", function(datasnapshot){
			var name = datasnapshot.child("name").val();
			var price = datasnapshot.child("price").val();
			var taken=datasnapshot.child("taken").val();
			var snapKey=datasnapshot.getKey();
			$scope.listDisp=true;
			$scope.udarList.push({
				udarName : name,
				udarPrice : price,
				udarTaken: taken,
				udarSnap: snapKey
			});
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
				$scope.$apply();
			}
			/*var li = document.createElement('li');
			li.innerHTML = name+ ' - ' + price +
			 '<span class="pull-right  glyphicon glyphicon-remove-sign" ng-click="udarRemove('+snapKey+')"></span>';
			li.className="fade list-group-item";
			document.getElementById('myUdarList').appendChild(li);
			document.getElementById("loader").style.display = "none";*/
			
		});
	};

}]);

