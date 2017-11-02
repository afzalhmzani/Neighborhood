// load the map //AIzaSyDtHTm2nXUC5BZoaomkwLo9wf115Hg9xcQ

//AIzaSyBKfu17xdMPtQrXpDbg3d0zkAuKdhYR8PI

// var myFavLocation = function(name, lat, lng){
//     var 
// }
var map;
var markers =[];
// var marker;

var mallsInRiyadh = [
        
            {title:'Al Nakheel Mall', location:{lat: 24.7680,lng:46.7146}},
            {title:'Panorama Mall', location:{lat: 24.6928311,lng:46.6677251}},
            {title:'Centria Mall', location:{lat: 24.697506,lng:46.6817792}},
            {title:'Granada Center', location:{lat: 24.7816366,lng:46.7283682}},
            {title:'Hayat Mall', location:{lat: 24.7432627,lng:46.6783695}},
        
        ];

var appViewModel;


function initMap() {
    var options = {
        zoom: 14,
        center: {
            lat: 24.7680,lng:46.7146
        }
        // center:{lat: -25.363, lng: 131.044}
    };
    var map = new google.maps.Map(document.getElementById('map'), options);
    var infoWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    appViewModel = new AppViewModel();
    ko.applyBindings(appViewModel);
     
    
    // mallsInRiyadh.forEach(function(coor){
    //     var positionOnMap = coor.location; 
    //     var title = coor.title; 
    //     var marker = new google.maps.Marker({
    //         map: map, 
    //         position : positionOnMap,
    //         title: title,
    //         animation: google.maps.Animation.DROP,
    //         id: coor // No need 
    //     });
    //     console.log('index of '+ coor); 
    //     // appViewModel.places()[coor].marker = marker;
    //     setAllMarkersVis();

    //     markers.push(marker); 
    //     marker.addListener('click', function(){
    //         getDataFromWiki(this, infoWindow); 
    //     });
    //     console.log('markres ===========' + markers.length); 
    //     bounds.extend(markers[0].position); 
    // });


    // PLEASE UNCOMMENT marker.addListener() 
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

        appViewModel.places()[i].marker = marker;
        markers.push(marker); 

        // marker.addListener('click', function(){
        //     if (this.getAnimation() !== null){
        //         this.setAnimation(null); 
        //     }else {
        //         this.setAnimation(google.maps.Animation.BOUNCE); 
        //         getDataFromWiki(this, infoWindow);
        //     }
           
        // });

       
        bounds.extend(markers[i].position); 
    }
    map.fitBounds(bounds);
}
// var setAllMarkersVis = function(){
//     markers.forEach(function(aMarker){
//         aMarker.setVisible(true);
//     });
// };
function showInfoWindow(marker, infoWindow){
    if(infoWindow.marker != marker){
        infoWindow.marker = marker; 
        //infoWindow.setContent('<div>' + marker.title + '</div>'); 
        infoWindow.setContent('<div>' + infoWindow.wiki + '</div>'); 
        infoWindow.open(map,marker); 

        infoWindow.addListener('closeclick', function(){
            infoWindow.setMarker = null; 
        });
    }
}


// Place should be a function that has the info: 

function AppViewModel(){
    
   
    var self = this;
    self.query = ko.observable("");

    self.places = ko.observableArray([
        {title: mallsInRiyadh[0].title},
        {title: mallsInRiyadh[1].title},
        {title: mallsInRiyadh[2].title},
        {title: mallsInRiyadh[3].title},
        {title: mallsInRiyadh[4].title}
    ]); 

    self.places = ko.computed(function(){
        var search = self.query().toLowerCase(); 
        return ko.utils.arrayFilter(mallsInRiyadh, function(mall){
            // https://en.wikipedia.org/wiki/Don%27t_repeat_yourself
            var mallFound = mall.title.toLowerCase().indexOf(search) >= 0; // true or false (everything greater than -1 one is true)

            
           // console.log(mall.title, search, mallFound);
            if (mall.hasOwnProperty('marker')) mall.marker.setVisible(mallFound);
            //if (mall.marker) mall.marker.setVisible(mallFound)
            return mallFound; 
        }); 
    });

    // http://knockoutjs.com/documentation/click-binding.html#note-1-passing-a-current-item-as-a-parameter-to-your-handler-function
    // this.activateTheClickedListViewItemsMapMarker = function(mall) {
    this.TheClickedMarker = function(mall) {
        //console.log("click")
       
        //setAllMarkersVis(); 
        for(var i = 0; i < appViewModel.places().length; ++i){
            appViewModel.places()[i].marker.setVisible(true);
          }


        google.maps.event.trigger(mall.marker, 'click');
        
        // for( i = 0; i < markers.length; ++i){
        //     console.log('mall --------------------------' + mall.marker); 
        //   if(markers[i].position !== mall.marker.position)
        //     markers[i].setVisible(false);
        // }

        for( i = 0; i < appViewModel.places().length; ++i){
            if(appViewModel.places()[i].marker.position !== mall.marker.position)
            appViewModel.places()[i].marker.setVisible(false);
          }
        //console.log(mall.marker.position);

        // use mall.marker to activate the selected list item's marker object (bounce + open info window)
        // you could, for example, use the google.maps.event.trigger() method to trigger a 'click' event on mall.marker

    };
   

   // console.log("----------------"); 
   // console.log(self.query()); 
}
var loadingMapError = function (){
    alert('Sorry!!!, Cannot load the map'); 
};

function getDataFromWiki(marker, infoWindow) {

    //console.log('getDataFromFoursquare function invoked!');
 
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
        success: function(response) {

            // console.log('00000000000   ' + (String(response)).split(' ,'));
            // console.log('00000000000 type of   ' + typeof( (String(response))));
            // //var wikiArr = response.toString();

            var wikiInfo = (String(response)).split(','); 
            var name = wikiInfo[0]; 
            // console.log('resopnse --------- '+ name); 
          infoWindow.wiki = name;

          showInfoWindow(marker, infoWindow);
        //   clearTimeout(wikiRequestTimeout);
        },
        error: function(err){
            console.log('Error happining '+ err);
            // showInfoWindow() 
            // infoWindow.setContent('<div>' + infoWindow.wiki + '</div>');
            alert('Sorry No info ' + err);  
        }
      });

      //my old ajax call
    //   $.ajax({
    //     url: wikiUrl,
    //     dataType: dt,
    //     success: function(response) {
    //      // console.log("Response: " + response);
            
    //       // set the info window content
    //       // infoWindow.setContent('<p>' + response[2][0] + '</p>')
    //       // open the info window
    //       infoWindow.wiki = response;
    //       showInfoWindow(marker, infoWindow);
    //       clearTimeout(wikiRequestTimeout);
    //     }
    //   });
  
}

// var temp;
// ko.applyBindings(new AppViewModel());