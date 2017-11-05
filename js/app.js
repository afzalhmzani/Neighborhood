var map;
var markers = [];
// var marker;

var restaurantsInRiyadh = [

    {
        title: 'Steak House',
        location: {
            lat: 24.6937419,
            lng: 46.6954994
        }
    },
    {
        title: 'McDonalds',
        location: {
            lat: 24.710044,
            lng: 46.6742543
        }
    },
    {
        title: 'Five Guys',
        location: {
            lat: 24.7135517,
            lng: 46.673107
        }
    },
    {
        title: 'Applebees',
        location: {
            lat: 24.6886888,
            lng: 46.6717253
        }
    },
    {
        title: 'KFC',
        location: {
            lat: 24.6928254,
            lng: 46.6829246
        }
    },

];

var appViewModel;
appViewModel = new AppViewModel();
ko.applyBindings(appViewModel);
var infoWindow;

function initMap() {
    var options = {
        zoom: 14,
        center: {
            lat: 24.7680,
            lng: 46.7146
        }

    };
    var map = new google.maps.Map(document.getElementById('map'), options);
    //    var infoWindow = new google.maps.InfoWindow();
    infoWindow = new google.maps.InfoWindow({

    });
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < restaurantsInRiyadh.length; i++) {
        var positionOnMap = restaurantsInRiyadh[i].location;
        var title = restaurantsInRiyadh[i].title;

        var marker = new google.maps.Marker({
            map: map,
            position: positionOnMap,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i // No need 
        });

        appViewModel.places()[i].marker = marker;
        markers.push(marker);

        marker.addListener('click', myCallback);

        bounds.extend(markers[i].position);
    }

    function myCallback() {
        
        this.setAnimation(google.maps.Animation.BOUNCE);
        
        setTimeout(function () {
           this.setAnimation(null);
           getDataFromWiki(this, infoWindow); 
        }.bind(this), 1000);
       
        
        // if (this.getAnimation() !== null) {
        //     this.setAnimation(null);
        // } else {
        //     this.setAnimation(google.maps.Animation.BOUNCE);
        //     setTimeout(function () {
        //         marker.setAnimation(null);
        //     }.bind(this), 200);
        //     getDataFromWiki(this, infoWindow);
        // }
        
    }
    map.fitBounds(bounds);
}

function showInfoWindow(marker, infoWindo) {
    if (infoWindo.marker != marker) {
        infoWindo.marker = marker;
        //infoWindow.setContent('<div>' + infoWindow.wiki + '</div>');
        infoWindow.setContent(infoWindo.restInfo());
        infoWindow.open(map, marker);
        infoWindow.addListener('closeclick', function () {
            infoWindo.setMarker = null;
        });
    }
}


// Place should be a function that has the info: 
function AppViewModel() {


    var self = this;
    self.query = ko.observable("");

    self.places = ko.observableArray([{
            title: restaurantsInRiyadh[0].title
        },
        {
            title: restaurantsInRiyadh[1].title
        },
        {
            title: restaurantsInRiyadh[2].title
        },
        {
            title: restaurantsInRiyadh[3].title
        },
        {
            title: restaurantsInRiyadh[4].title
        }
    ]);

    self.places = ko.computed(function () {
        var search = self.query().toLowerCase();
        return ko.utils.arrayFilter(restaurantsInRiyadh, function (restaurant) {
            // https://en.wikipedia.org/wiki/Don%27t_repeat_yourself
            var restaurantFound = restaurant.title.toLowerCase().indexOf(search) >= 0; // true or false (everything greater than -1 one is true)

            if (restaurant.hasOwnProperty('marker')) restaurant.marker.setVisible(restaurantFound);
            //if (restaurant.marker) restaurant.marker.setVisible(restaurantFound)
            return restaurantFound;
        });
    });

    // http://knockoutjs.com/documentation/click-binding.html#note-1-passing-a-current-item-as-a-parameter-to-your-handler-function
    this.TheClickedMarker = function (restaurant) {

               for (var i = 0; i < appViewModel.places().length; ++i) {
            appViewModel.places()[i].marker.setVisible(true);
        }

        google.maps.event.trigger(restaurant.marker, 'click');

        for (i = 0; i < appViewModel.places().length; ++i) {
            if (appViewModel.places()[i].marker.position !== restaurant.marker.position)
                appViewModel.places()[i].marker.setVisible(false);
        }
    };
}

var loadingMapError = function () {
    alert('Sorry!!!, Cannot load the map');
};

function getDataFromWiki(marker, myFavPlace) {
    var dt = 'jsonp',
        wikiBase = 'https://en.wikipedia.org/w/api.php',
        wikiUrl = wikiBase + '?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
    var linkInfoHTML = "<ul>info</ul>";
    var listInfTest;
    $.ajax({
        url: wikiUrl,
        dataType: dt,
        success: function (response) {
            var info = response[1];
            if (info.length === 0) {
                appViewModel.wikiinfolist('SORRY!!! No Information');
            } else {
                var myList = '';
                for (var i = 0; i < info.length; i++) {
                    var url = "http://en.Wikipedia.org/wiki/" + info[i];
                    var urlInHTML = '<li>' +
                        '<a href="' + url + '">' +
                        info[i] +
                        '</a>' +
                        '</li>';
                    myList = myList.concat(urlInHTML);
                    if (i === 3) break;
                }

                linkInfoHTML = linkInfoHTML.replace('info', myList);
                marker.wikiinfolist = linkInfoHTML;


                var myHTML =
                    '<div>' +
                    '<h4 class = "header-name">' + marker.title + '</h4>' +
                    '<span>' +
                    '<p> Aabilable restInfo on Wiki: </p>' +
                    marker.wikiinfolist +
                    '</span>' +
                    '</div>';
                infoWindow.setContent(myHTML);
                infoWindow.open(map, marker);
            }
        },
        error: function (err) {
            console.log('Error happining ' + err);
             alert('Sorry No info ' + err);
            // restaurantInfoWindo.wikiinfolist('Errorr no Idea ');
        }
    });

}