// load the map //AIzaSyDtHTm2nXUC5BZoaomkwLo9wf115Hg9xcQ

//AIzaSyBKfu17xdMPtQrXpDbg3d0zkAuKdhYR8PI

// var myFavLocation = function(name, lat, lng){
//     var 
// }
var map;
var markers =[];


var mallsInRiyadh = [
        
            {title:'Al Nakheel Mall', location:{lat: 24.7680,lng:46.7146}},
            {title:'Panorama Mall', location:{lat: 24.6928311,lng:46.6677251}},
            {title:'Centria Mall', location:{lat: 24.697506,lng:46.6817792}},
            {title:'Granada Center', location:{lat: 24.7816366,lng:46.7283682}},
            {title:'Hayat Mall', location:{lat: 24.7432627,lng:46.6783695}},
        
        ];



function initMap() {
    var options = {
        zoom: 12,
        center: {
            lat: 24.7680,lng:46.7146
        }
        // center:{lat: -25.363, lng: 131.044}
    };
    var map = new google.maps.Map(document.getElementById('map'), options);
    var infoWindo = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    ko.applyBindings(new AppViewModel()); 

    for(var i = 0; i< mallsInRiyadh.length ; i++){
        var positionOnMap = mallsInRiyadh[i].location; 
        var title = mallsInRiyadh[i].title; 

        var marker = new google.maps.Marker({
            map: map, 
            position : positionOnMap,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i // No need 
        });

        markers.push(marker); 
        marker.addListener('click', function(){
            showInfoWindow(this, infoWindo); 
        });

        bounds.extend(markers[i].position); // might deleteted 
    }
    map.fitBounds(bounds); //might deleted
}

function showInfoWindow(marker, infoWindow){
    if(infoWindow.marker != marker){
        infoWindow.marker = marker; 
        infoWindow.setContent('<div>' + marker.title + '</div>'); 
        infoWindow.open(map,marker); 

        infoWindow.addListener('closeclick', function(){
            infoWindow.setMarker = null; 
        });
    }
}


// Place should be a function that has the info: 

function AppViewModel(){
    
   
    var self = this; 
    self.places = ko.observableArray([
        {title: mallsInRiyadh[0].title},
        {title: mallsInRiyadh[1].title},
        {title: mallsInRiyadh[2].title},
        {title: mallsInRiyadh[3].title},
        {title: mallsInRiyadh[4].title}
    ]); 

    self.placeInfo = function(title){
        google.map.evet.trigger(self.marker, 'click')
    };

    console.log("----------------"); 
    console.log(self.placeInfo); 
}

// ko.applyBindings(new AppViewModel());