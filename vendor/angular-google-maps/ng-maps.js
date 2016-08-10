angular.module("ngMaps",[]),angular.module("ngMaps").directive("circles",[function(){return{restrict:"E",scope:{geometries:"=",events:"=",visible:"=",options:"=",opacity:"=",properties:"="},require:"^map",link:function($scope,$element,$attrs,parent){$scope.$watch(function(){parent.getMap()},function(){var map=parent.getMap(),circles=[],properties=$scope.properties?$scope.properties:[];$scope.$watch("visible",function(){angular.forEach(circles,function(c){c.setVisible($scope.visible)})}),$scope.$watch("options",function(){angular.forEach(circles,function(c,i){c.setOptions($scope.options(c,properties,map,i))})}),$scope.$watch("geometries",function(){newData()}),$scope.$watch("opacity",function(){$scope.opacity&&angular.forEach(circles,function(c){c.setOptions({fillOpacity:$scope.opacity/100})})});var newData=function(){angular.forEach(circles,function(c){c.setMap(null)}),circles=[],angular.forEach($scope.geometries,function(c,i){var opts=$scope.options?$scope.options(c,properties,map,i):{};opts.center=new google.maps.LatLng(c.center[0],c.center[1]),opts.radius=c.radius,opts.map=map;var circle=new google.maps.Circle(opts);circles.push(circle),angular.forEach($scope.events,function(val,key){google.maps.event.addListener(circle,key,function(e){val(e,this,circles,i)})})})}})}}}]),angular.module("ngMaps").directive("control",["$compile",function($compile){return{restrict:"E",scope:{position:"@",visible:"="},require:"^map",link:function($scope,$element,$attrs,parent){$scope.$watch(function(){parent.getMap()},function(){var map=parent.getMap(),position=$scope.position.split(/(?=[A-Z])/).join("_").toUpperCase();$scope.$watch(function(){return $element[0].style.display="none",$element[0].innerHTML},function(){var content=$element.html(),compiled=$compile($element.html())($scope.$parent.$parent),controlDiv=document.createElement("div");map.controls[google.maps.ControlPosition[position]].pop(),$scope.visible!==!1&&(controlDiv.innerHTML=content),map.controls[google.maps.ControlPosition[position]].push(compiled[0])})})}}}]),angular.module("ngMaps").directive("geopoints",["$http",function($http){return{restrict:"E",scope:{url:"=",events:"=",visible:"=",options:"="},require:"^map",link:function($scope,$element,$attrs,parent){$scope.$watch(function(){parent.getMap()},function(){var map=parent.getMap(),markers=[];$scope.$watch(function(){return $scope.options},function(){angular.forEach(markers,function(m,i){marker.setOptions($scope.options(m.geometry,m.properties,map,i))})}),$scope.$watch(function(){return $scope.visible},function(){angular.forEach(markers,function(marker){marker.setVisible($scope.visible)})}),$scope.$watch(function(){return $scope.url},function(){newData($scope.url)});var newData=function(url){$http.get(url).success(function(data){angular.forEach(markers,function(m){m.setMap(null)}),markers=[],angular.forEach(data.features,function(m,i){var opts=$scope.options?$scope.options(m.geometry,m.properties,map,i):{};opts.position=new google.maps.LatLng(m.geometry.coordinates[1],m.geometry.coordinates[0]),opts.visible=$scope.visible,opts.map=map;var marker=new google.maps.Marker(opts);marker.properties=m.properties,marker.geometry=m.geometry,marker.getProperty=function(p){return this.properties[p]},markers.push(marker),angular.forEach($scope.events,function(val,key){google.maps.event.addListener(marker,key,function(e){val(e,marker,map,markers)})})})})}})}}}]),angular.module("ngMaps").directive("geopolygons",["$http",function($http){return{restrict:"E",scope:{url:"=",events:"=",options:"=",visible:"=",opacity:"="},require:"^map",link:function($scope,$element,$attrs,parent){$scope.$watch(function(){parent.getMap()},function(){function PolygonCollection(p,i){this.type=p.geometry.type,this.properties=p.properties,this.setOptions=function(o){angular.forEach(polygons,function(p){p.setOptions(o)})},this.setVisible=function(o){angular.forEach(polygons,function(p){p.setVisible(o)})},this.getMap=function(o){angular.forEach(polygons,function(p){p.getMap(o)})};var polygons=[],opts=$scope.options?$scope.options(p.geometry,p.properties,i,map):{};if(opts.fillOpacity=$scope.opacity?$scope.opacity/100:1,"MultiPolygon"===this.type)angular.forEach(p.geometry.coordinates,function(c){angular.forEach(c,function(c2){var coords=[];angular.forEach(c2,function(c3){coords.push(new google.maps.LatLng(c3[1],c3[0]))});var polygon=new google.maps.Polygon({paths:coords});polygon.setOptions(opts),polygon.setMap(map),polygons.push(polygon)})});else{var coords=[];angular.forEach(p.geometry.coordinates,function(c){angular.forEach(c,function(c2){coords.push(new google.maps.LatLng(c2[1],c2[0]))})});var polygon=new google.maps.Polygon({paths:coords});polygon.setOptions(opts),polygon.setMap(map),polygons.push(polygon)}this.polygons=polygons}var map=parent.getMap(),polygons=[];$scope.$watch("options",function(){angular.forEach(polygons,function(p,i){var opts=$scope.options?$scope.options(p.geometry,p.properties,map,i):{};opts.fillOpacity=$scope.opacity?$scope.opacity/100:1,p.setOptions(opts)})}),$scope.$watch("opacity",function(){$scope.opacity&&angular.forEach(polygons,function(p){p.setOptions({fillOpacity:$scope.opacity/100})})}),$scope.$watch("visible",function(){angular.forEach(polygons,function(p){p.setVisible($scope.visible)})}),$scope.$watch("url",function(){newData($scope.url)});var newData=function(url){$http.get(url).success(function(data){angular.forEach(polygons,function(p){p.setMap(null)}),polygons=[],angular.forEach(data.features,function(p,i){var PC=new PolygonCollection(p,i);polygons.push(PC),angular.forEach(PC.polygons,function(polygon){angular.forEach($scope.events,function(val,key){google.maps.event.addListener(polygon,key,function(e){val(e,PC,map,polygons)})})})})})}})}}}]),angular.module("ngMaps").directive("infowindow",["$compile",function($compile){return{restrict:"E",scope:{options:"=",position:"=",visible:"=",events:"="},require:"^map",compile:function(){return function($scope,$element,$attrs,parent){$scope.$watch(function(){parent.getMap()},function(){var map=parent.getMap(),opts=$scope.options?$scope.options():{},infowindow=new google.maps.InfoWindow(opts);$scope.$watch(function(){return $element[0].style.display="none",$element[0].innerHTML+$scope.position},function(){var pos;pos=$scope.position.constructor===Array?new google.maps.LatLng($scope.position[0],$scope.position[1]):$scope.position;var compiled=($element.html(),$compile($element.html())($scope.$parent.$parent));infowindow.setContent(compiled[0]),infowindow.setPosition(pos),infowindow.open(map)})})}}}}]),angular.module("ngMaps").directive("map",[function(){return{restrict:"AE",scope:{center:"=",zoom:"=",events:"=",options:"="},controller:function($scope){this.getMap=function(){return $scope.map}},transclude:!0,link:function($scope,elem,attrs){var center=$scope.center,options=$scope.options?$scope.options():{},latitude=center?center[0]:47.6,longitude=center?center[1]:-122.3;options.center=new google.maps.LatLng(latitude,longitude),$scope.zoom?options.zoom=$scope.zoom:options.zoom||(options.zoom=6);var t1=document.createElement("div");t1.className=attrs.class,elem.append(t1);var map=new google.maps.Map(t1,options);angular.forEach($scope.events,function(val,key){google.maps.event.addListener(map,key,function(e){val(e,map)})}),$scope.map=map}}}]),angular.module("ngMaps").directive("marker",[function(){return{restrict:"E",scope:{position:"=",options:"=",events:"=",lat:"=",lng:"=",decimals:"="},require:"^map",link:function($scope,$element,$attrs,parent){$scope.$watch(function(){parent.getMap()},function(){var map=parent.getMap(),decimals=$scope.decimals,opts=$scope.options?$scope.options():{},round=function(val){return decimals||0===decimals?Math.round(Math.pow(10,decimals)*val)/Math.pow(10,decimals):val},curPosition=function(){return $scope.position?new google.maps.LatLng($scope.position[0],$scope.position[1]):$scope.lat&&$scope.lng?new google.maps.LatLng($scope.lat,$scope.lng):void 0};opts.position=curPosition(),opts.map=map;var marker=new google.maps.Marker(opts);angular.forEach($scope.events,function(val,key){google.maps.event.addListener(marker,key,function(e){val(e,marker,map)})}),$scope.$watch("[position, lat, lng]",function(){marker.setPosition(curPosition())},!0),google.maps.event.addListener(marker,"drag",function(){$scope.$apply(function(){var lat=round(marker.getPosition().lat()),lng=round(marker.getPosition().lng());$scope.position?$scope.position=[lat,lng]:$scope.lat&&$scope.lng&&($scope.lat=lat,$scope.lng=lng)})})})}}}]),angular.module("ngMaps").directive("overlay",[function(){return{restrict:"E",scope:{url:"=",events:"=",opacity:"=",options:"=",bounds:"=",visible:"="},require:"^map",link:function($scope,$element,$attrs,parent){$scope.$watch(function(){parent.getMap()},function(){function isFloat(n){return n===+n&&n!==(n||0)}var map=parent.getMap(),parseOpacity=function(){return isFloat($scope.opacity)?$scope.opacity:parseFloat($scope.opacity)},deleteOverlay=function(){overlay&&(overlay.setMap(null),overlay=null)},newOverlay=function(){deleteOverlay();var bounds;if($scope.bounds.constructor===Object){var SW=new google.maps.LatLng($scope.bounds.SW[0],$scope.bounds.SW[1]),NE=new google.maps.LatLng($scope.bounds.NE[0],$scope.bounds.NE[1]);bounds=new google.maps.LatLngBounds(SW,NE)}else bounds=$scope.bounds;var opts=$scope.options?$scope.options():{},overlay=new google.maps.GroundOverlay($scope.url,bounds,opts);return overlay.setOpacity(parseOpacity()/100),overlay.setMap($scope.visible!==!1?map:null),overlay},overlay=newOverlay();$scope.$watch("url + bounds",function(){overlay=newOverlay()}),$scope.$watch("opacity",function(){overlay.setOpacity(parseOpacity()/100)}),$scope.$watch("visible",function(){overlay.setMap($scope.visible!==!1?map:null)})})}}}]),angular.module("ngMaps").directive("points",[function(){return{restrict:"E",scope:{coords:"=",options:"=",properties:"=",events:"=",visible:"=",decimals:"="},require:"^map",link:function($scope,$element,$attrs,parent){$scope.$watch(function(){parent.getMap()},function(){var map=parent.getMap(),points=[],properties=$scope.properties?$scope.properties:[],round=function(val){return $scope.decimals||0===$scope.decimals?Math.round(Math.pow(10,$scope.decimals)*val)/Math.pow(10,$scope.decimals):val};$scope.$watch("coords",function(){newCoords($scope.coords)}),$scope.$watch("visible",function(){angular.forEach(points,function(c){c.setVisible($scope.visible)})}),$scope.$watch("options",function(){angular.forEach(points,function(c,i){c.setOptions($scope.options(c,properties,map,i))})});var newCoords=function(coords){angular.forEach(points,function(p){p.setMap(null)}),points=[],angular.forEach(coords,function(c,i){var opts=$scope.options?$scope.options(c,properties,i,map):{};opts.position=new google.maps.LatLng(c[0],c[1]),opts.map=map;var point=new google.maps.Marker(opts);angular.forEach($scope.events,function(val,key){google.maps.event.addListener(point,key,function(e){val(e,this,map,points)})}),google.maps.event.addListener(point,"drag",function(){$scope.$apply(function(){var lat=round(point.getPosition().lat()),lng=round(point.getPosition().lng());$scope.coords[i]=[lat,lng]})}),points.push(point)})}})}}}]),angular.module("ngMaps").directive("polygons",[function(){return{restrict:"E",scope:{coords:"=",options:"=",properties:"=",opacity:"=",events:"=",visible:"="},require:"^map",link:function($scope,$element,$attrs,parent){$scope.$watch(function(){parent.getMap()},function(){var map=parent.getMap(),polygons=[],properties=$scope.properties?$scope.properties:[];$scope.$watch("options",function(){angular.forEach(polygons,function(p){var opts=$scope.options?$scope.options(p,properties,i,map):{};opts.fillOpacity=$scope.opacity?$scope.opacity/100:1,p.setOptions(opts)})}),$scope.$watch("opacity",function(){angular.forEach(polygons,function(p){p.setOptions({fillOpacity:$scope.opacity/100})})}),$scope.$watch("visible",function(){angular.forEach(polygons,function(p){p.setVisible($scope.visible)})}),$scope.$watch("coords",function(){newData($scope.coords)});var newData=function(coords){angular.forEach(polygons,function(p){p.setMap(null)}),polygons=[],angular.forEach(coords,function(c,i){var opts=$scope.options?$scope.options(c,properties,map,i):{};opts.fillOpacity=$scope.opacity?$scope.opacity/100:1,opts.path=[],opts.map=map;for(var j=0;j<c.length;j++)for(var k=0;k<c[j].length;k++)opts.path.push(new google.maps.LatLng(c[j][k][0],c[j][k][1]));var polygon=new google.maps.Polygon(opts);$scope.properties&&(polygon.properties=$scope.properties[i]),polygon.getProperty=function(p){return this.properties[p]},polygons.push(polygon),angular.forEach($scope.events,function(val,key){google.maps.event.addListener(polygon,key,function(e){val(e,this,map,polygons)})})})}})}}}]),angular.module("ngMaps").directive("polylines",[function(){return{restrict:"E",scope:{coords:"=",options:"=",visible:"="},require:"^map",link:function($scope,$element,$attrs,parent){$scope.$watch(function(){parent.getMap()},function(){var map=parent.getMap(),properties=$scope.properties?$scope.properties:[],lines=[];$scope.$watch("coords",function(){newData($scope.coords)}),$scope.$watch("visible",function(){angular.forEach(lines,function(l){l.setVisible($scope.visible)})}),$scope.$watch("options",function(){angular.forEach(lines,function(l,i){l.setOptions($scope.options(l,properties,map,i))})});var newData=function(coords){angular.forEach(lines,function(l){l.setMap(null)}),lines=[],angular.forEach(coords,function(l,i){var opts=$scope.options?$scope.options(l,properties,map,i):{};opts.path=[],angular.forEach(l,function(c){opts.path.push(new google.maps.LatLng(c[0],c[1]))}),opts.map=map;var polyline=new google.maps.Polyline(opts);lines.push(polyline),angular.forEach($scope.events,function(val,key){google.maps.event.addListener(polyline,key,function(e){val(e,this,map,lines)})})})}})}}}]),angular.module("ngMaps").directive("rectangles",["$rootScope",function($rootScope){return{restrict:"E",scope:{bounds:"=",events:"=",visible:"=",options:"=",opacity:"=",decimals:"="},require:"^map",link:function($scope,$element,$attrs,parent){$scope.$watch(function(){parent.getMap()},function(){var map=parent.getMap(),properties=$scope.properties?$scope.properties:[],rectangles=[],decimals=$scope.decimals,round=function(val){return decimals||0===decimals?Math.round(Math.pow(10,decimals)*val)/Math.pow(10,decimals):val};$scope.$watch("visible",function(){angular.forEach(rectangles,function(r){r.setVisible($scope.visible)})}),$scope.$watch("options",function(){angular.forEach(rectangles,function(r,i){r.setOptions($scope.options(r,properties,map,i))})}),$scope.$watch("bounds",function(){newData()}),$scope.$watch("opacity",function(){$scope.opacity&&angular.forEach(rectangles,function(r){r.setOptions({fillOpacity:$scope.opacity/100})})});var newData=function(){angular.forEach(rectangles,function(r){r.setMap(null)}),rectangles=[],angular.forEach($scope.bounds,function(r,i){console.log(r);var opts=$scope.options?$scope.options(r,properties,map,i):{};if(r.constructor===Object){var SW=new google.maps.LatLng(r.SW[0],r.SW[1]),NE=new google.maps.LatLng(r.NE[0],r.NE[1]);opts.bounds=new google.maps.LatLngBounds(SW,NE)}else opts.bounds=r;opts.map=map;var rect=new google.maps.Rectangle(opts);rectangles.push(rect),angular.forEach($scope.events,function(val,key){google.maps.event.addListener(rect,key,function(e){val(e,this,i,rectangles)})}),google.maps.event.addListener(rect,"bounds_changed",function(){var b=rect.getBounds(),SW=b.getSouthWest(),NE=b.getNorthEast();$scope.bounds[i]={SW:[round(SW.k),round(SW.B)],NE:[round(NE.k),round(NE.B)]},$rootScope.$apply()})})}})}}}]);