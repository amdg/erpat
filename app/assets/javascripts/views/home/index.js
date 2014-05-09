com.glados.views.home = com.glados.views.home || {};
com.glados.views.home.index = {
  map: null,
  marker: null,
  infowindow: null,
  init: function(){
    var view = com.glados.views.home.index;

    view.startBtn();

    view.map = new google.maps.Map(document.getElementById("map-canvas"));
    var contentString = '<div class="marker-info-win">'+
    '<div class="marker-inner-win"><span class="info-content">'+
    '<h1 class="marker-heading">Apply for this location</h1><p><div class="marker-edit">'+
      '<form action="#" method="POST" name="SaveMarker" id="SaveMarker">'+
      '<label for="street_address"><span>Street Address :</span><input type="text" name="street_address" class="save-name" placeholder="Enter Street Address" maxlength="40" /></label>'+
      '<label for="purpose"><span>Purpose :</span><textarea name="purpose" class="save-desc" placeholder="Enter Purpose" maxlength="150"></textarea></label>'+
      '<label for="land_use"><span>Land Use :</span> <select name="land_use" class="save-type"><option value="Agricultural">Agricultural</option>' +
      '<option value="Agricultural Nursery">Agricultural Nursery</option>'+
      '<option value="Agri-industrial">Agri-industrial</option>' +
      '<option value="Cemeteries">Cemeteries</option>' +
      '<option value="Commercial">Commercial</option>' +
      '<option value="Cemeteries">Cemeteries</option>' +
      '<option value="Dumpsite">Dumpsite</option>' +
      '<option value="Ecopark">Ecopark</option>' +
      '<option value="Agro-ecotourism">Agro-ecotourism</option>' +
      '<option value="Forest Reserves">Forest Reserves</option>' +
      '<option value="Industrial">Industrial</option>' +
      '<option value="Institutional">Institutional</option>' +
      '<option value="Irrigable Land">Irrigable Land</option>' +
      '<option value="Parks">Parks</option>' +
      '<option value="Proposed Dumpsite">Proposed Dumpsite</option>' +
      '<option value="Residential">Residential</option>' +
      '<option value="River">River</option>' +
      '<option value="Transport/Utilities">Transport/Utilities</option>' +
      '</select></label>'+
      '</form>'+
      '</div></p><a href="#" class="btn btn-primary save-marker">Submit Application</a>';
    view.infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 500,
      width: 500
    });

    if(navigator.geolocation) {
      // Locate User
      navigator.geolocation.getCurrentPosition(function(position) {
        var myLatlng = new google.maps.LatLng(position.coords.latitude,
          position.coords.longitude);

        view.map.setCenter(myLatlng);
        view.map.setZoom(14);


        google.maps.event.addListener(view.map, 'click', function(event) {
          if(view.marker){
            view.repositionMarker(event.latLng);
          } else {
            view.placeMarker(event.latLng);
          }

          window.setTimeout(function() {
            view.map.panTo(view.marker.getPosition());
            view.map.setZoom(16);
          }, 1000);

          view.infowindow.open(view.map,view.marker);
//          view.map.setCenter(view.marker.getPosition());

          console.log(event.latLng.lat().toFixed(3));
          console.log(event.latLng.lng().toFixed(3));

        });

      }, function() {

      });
    } else {
      // Browser doesn't support Geolocation

    }

//    var ctaLayer = new google.maps.KmlLayer({
//      url: 'http://downloads.noah.dost.gov.ph/downloads/special/ondoy/Leyte/abuyog-leyte.KML'
//    });
//    ctaLayer.setMap(map);
  },

  placeMarker: function(location) {
    var view = com.glados.views.home.index;
    view.marker = new google.maps.Marker({
      position: location,
      map: view.map
    });
  },

  repositionMarker: function(location) {
    com.glados.views.home.index.marker.setPosition(location);
  },

  startBtn: function(){

    $('#start-now').on('click', function(){
      $('#splash').remove();
    });

  }

}
