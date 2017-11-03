var map;
var markers = [];
// var marker;

var mallsInRiyadh = [

    {
        title: 'Al Nakheel Mall',
        location: {
            lat: 24.7680,
            lng: 46.7146
        }
    },
    {
        title: 'Panorama Mall',
        location: {
            lat: 24.6928311,
            lng: 46.6677251
        }
    },
    {
        title: 'Centria Mall',
        location: {
            lat: 24.697506,
            lng: 46.6817792
        }
    },
    {
        title: 'Granada Center',
        location: {
            lat: 24.7816366,
            lng: 46.7283682
        }
    },
    {
        title: 'Hayat Mall',
        location: {
            lat: 24.7432627,
            lng: 46.6783695
        }
    },

];

var appViewModel;
appViewModel = new AppViewModel();
ko.applyBindings(appViewModel);

function initMap() {
    var options = {
        zoom: 14,
        center: {
            lat: 24.7680,
            lng: 46.7146
        }

    };
    var map = new google.maps.Map(document.getElementById('map'), options);
    var infoWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // PLEASE UNCOMMENT marker.addListener() 
    for (var i = 0; i < mallsInRiyadh.length; i++) {
        var positionOnMap = mallsInRiyadh[i].location;
        var title = mallsInRiyadh[i].title;

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
        if (this.getAnimation() !== null) {
            this.setAnimation(null);
        } else {
            this.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                marker.setAnimation(null);
            }, 200);
            getDataFromWiki(this, infoWindow);
        }
    }
    map.fitBounds(bounds);
}

function showInfoWindow(marker, infoWindow) {
    if (infoWindow.marker != marker) {
        infoWindow.marker = marker;
        infoWindow.setContent('<div>' + infoWindow.wiki + '</div>');
        infoWindow.open(map, marker);
        infoWindow.addListener('closeclick', function () {
            infoWindow.setMarker = null;
        });
    }
}


// Place should be a function that has the info: 
function AppViewModel() {


    var self = this;
    self.query = ko.observable("");

    self.places = ko.observableArray([{
            title: mallsInRiyadh[0].title
        },
        {
            title: mallsInRiyadh[1].title
        },
        {
            title: mallsInRiyadh[2].title
        },
        {
            title: mallsInRiyadh[3].title
        },
        {
            title: mallsInRiyadh[4].title
        }
    ]);

    self.places = ko.computed(function () {
        var search = self.query().toLowerCase();
        return ko.utils.arrayFilter(mallsInRiyadh, function (mall) {
            // https://en.wikipedia.org/wiki/Don%27t_repeat_yourself
            var mallFound = mall.title.toLowerCase().indexOf(search) >= 0; // true or false (everything greater than -1 one is true)


            // console.log(mall.title, search, mallFound);
            if (mall.hasOwnProperty('marker')) mall.marker.setVisible(mallFound);
            //if (mall.marker) mall.marker.setVisible(mallFound)
            return mallFound;
        });
    });

    // http://knockoutjs.com/documentation/click-binding.html#note-1-passing-a-current-item-as-a-parameter-to-your-handler-function
    this.TheClickedMarker = function (mall) {
        //setAllMarkersVis(); 
        for (var i = 0; i < appViewModel.places().length; ++i) {
            appViewModel.places()[i].marker.setVisible(true);
        }

        google.maps.event.trigger(mall.marker, 'click');

        for (i = 0; i < appViewModel.places().length; ++i) {
            if (appViewModel.places()[i].marker.position !== mall.marker.position)
                appViewModel.places()[i].marker.setVisible(false);
        }
    };
}

var loadingMapError = function () {
    alert('Sorry!!!, Cannot load the map');
};

function getDataFromWiki(marker, infoWindow) {

    var query = marker.title,
        dt = 'jsonp',
        wikiBase = 'https://en.wikipedia.org/w/api.php',
        wikiUrl = wikiBase + '?action=opensearch&search=' + query + '&format=json&callback=wikiCallback';


    // var wikiRequestTimeout = setTimeout(function() {
    //     $wikiElem.text('failed to get Wikipedia resources');
    //   }, 8000);

    // do ajax request here
    // for example, use marker.title for the request
    // set the info window content and
    // open the info window in the success callback (or done method)

    //'https://en.wikipedia.org/w/api.php' + '?action=opensearch&search=' + query + '&format=json&callback=wikiCallback'
    //'jsonp'

    $.ajax({
        url: wikiUrl,
        dataType: dt,
        success: function (response) {
            var wikiInfo = (String(response)).split(',');
            var name = wikiInfo[0];
            // console.log('resopnse --------- '+ name); 
            infoWindow.wiki = name;

            showInfoWindow(marker, infoWindow);
            //   clearTimeout(wikiRequestTimeout);
        },
        error: function (err) {
            console.log('Error happining ' + err);
            // showInfoWindow() 
            // infoWindow.setContent('<div>' + infoWindow.wiki + '</div>');
            alert('Sorry No info ' + err);
        }
    });

}