// load the map //AIzaSyDtHTm2nXUC5BZoaomkwLo9wf115Hg9xcQ

//AIzaSyBKfu17xdMPtQrXpDbg3d0zkAuKdhYR8PI

// var myFavLocation = function(name, lat, lng){
//     var 
// }

function initMap() {
    var options = {
        zoom: 3,
        center: {
            lat: 24.7136,
            lng: 46.6753
        }
        // center:{lat: -25.363, lng: 131.044}
    }

    var map = new google.maps.Map(document.getElementById('map'), options);
    //24.712461, 46.673398
    var riyadh = new google.maps.Marker({
        position: {
            lat: 24.712461,
            lng: 46.673398
        },

        map: map
    });
    var hail = new google.maps.Marker({
        position: {
            lat: myFavLocation.Hail.lat,
            lng: myFavLocation.Hail.lng
        },
        map: map
    });

    var waukesha = new google.maps.Marker({
        position: {
            lat: myFavLocation.Waukesha.lat,
            lng: myFavLocation.Waukesha.lng
        },
        map: map
    });

    var arlington = new google.maps.Marker({
        position: {
            lat: myFavLocation.Arlington.lat,
            lng: myFavLocation.Arlington.lng
        },
        map: map
    });
}

var myFavLocation = {
    "Hail": {
        lat: 27.5114,
        lng: 41.7208
    },

    "Waukesha": {
        lat: 43.0117,
        lng: -88.2315
    },

    "Arlington": {
        lat: 32.700708,
        lng: -97.124691
    }


};

function AppViewModel(){
    // this.firstName = ko.observable("Bert");
    // this.lastName = ko.observable("Bertington");
    // this.fullName = ko.computed(function(){
    //     return this.firstName() + " " + this.lastName(); 
    // }, this); 
    var self = this; 
    self.places = ko.observableArray([
        {name: 'Hail'},
        {name: 'Riyadh'},
        {name: 'Waukesha'},
        {name: 'Arlington'}
    ]);
}

ko.applyBindings(new AppViewModel());