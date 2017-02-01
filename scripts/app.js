(function(){
	'use strict';

	angular.module('NarrowItDownApp',[])
	.controller('NarrowItDownController',NarrowItDownController)
	.service('MenuSearchService',MenuSearchService)
	.directive('foundItems',FoundItemsDirective);

	function FoundItemsDirective(){
		var ddo={
			templateUrl:'foundItems.html',
			scope: {
				items:'<',
				error:'<',
				onRemove: '&'
			}
		}
		return ddo;
	}

	NarrowItDownController.$inject=['MenuSearchService'];
	function NarrowItDownController(MenuSearchService){
		var menu = this;

		menu.searchTerm="";
		menu.logItems=function(){
			var promise=MenuSearchService.getMatchedMenuItems(menu.searchTerm);

			promise.then(function(response){
				
				if (response.length == 0 || menu.searchTerm==""){
					menu.error="NOTHING FOUND! TRY AGAIN...";
					menu.items=[];

				}else{
					menu.items=response;
					menu.error="";
				}
			})
			.catch(function(error){
				console.log("WRONG GET REQUEST");
			});

			menu.removeItem = function(index){
				menu.items.splice(index,1);
			};


		};

		
	}

	MenuSearchService.$inject=['$http'];
	function MenuSearchService($http){
		var service = this;

		service.getMatchedMenuItems=function(searchTerm){
			return $http({
				method:"GET",
				url:"https://davids-restaurant.herokuapp.com/menu_items.json"
			}).then(function(result){
				var foundItems=[];
				var menuItems=result.data.menu_items;
				for (var i=0;i<menuItems.length;i++){
					var inc=menuItems[i].description;
					if(inc.includes(searchTerm)){
						foundItems.push(inc);
					}
				}
				return foundItems;
			})
			.catch(function(error){
				console.log(error);
			});
		};
	}
})();