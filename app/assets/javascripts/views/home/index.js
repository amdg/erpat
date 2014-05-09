com.glados.views.home = com.glados.views.home || {};
com.glados.views.home.index = {
  map: null,
  layers: [],
  marker: null,
  infowindow: null,
  init: function(){
    var view = com.glados.views.home.index;


    view.layers[0] = new google.maps.KmlLayer({url: 'http://downloads.noah.dost.gov.ph/downloads/special/landslides/landslide_inventory/nationwide-li.KML', preserveViewport: true, suppressInfoWindows: false});
    view.layers[1] = new google.maps.KmlLayer({url: 'http://downloads.noah.dost.gov.ph/downloads/Iba_na_ang_Panahon_Nationwide_IEC/Region%20III/storm%20surge/HM_0_2.kmz', preserveViewport: true, suppressInfoWindows: false});
    view.layers[2] = new google.maps.KmlLayer({url: 'http://downloads.noah.dost.gov.ph/downloads/Iba_na_ang_Panahon_Nationwide_IEC/Region%20III/storm%20surge/HM_2_4.kmz', preserveViewport: true, suppressInfoWindows: false});
    view.layers[3] = new google.maps.KmlLayer({url: 'http://downloads.noah.dost.gov.ph/downloads/Iba_na_ang_Panahon_Nationwide_IEC/Region%20III/storm%20surge/HM_4_6.kmz', preserveViewport: true, suppressInfoWindows: false});
    for (var i = 0; i < view.layers.length; i++) {
      view.layers[i].setMap(null);
    }

    view.startBtn();

    view.map = new google.maps.Map(document.getElementById("map-canvas"),{
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var contentString = '<div class="marker-info-win">'+
    '<div class="marker-inner-win"><span class="info-content">'+
    '<h1 class="marker-heading">Apply for this location</h1><p><div class="marker-edit">'+
      '<form action="/locational_clearances" method="POST" name="SaveMarker" id="SaveMarker">'+
      '<label for="full_name"><span>Full Name :</span><input type="text" name="full_name" placeholder="Full Name" maxlength="40" /></label>'+
      '<label for="contact_number"><span>Contact Number :</span><input type="text" name="contact_number" placeholder="Contact Number" maxlength="40" /></label>'+
      '<label for="street_address"><span>Street Address :</span><input type="text" name="street_address" placeholder="Street Address" maxlength="40" /></label>'+
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
      '<label for="purpose"><span>Purpose :</span><textarea name="purpose" class="save-desc" placeholder="Enter Purpose" maxlength="150"></textarea></label>'+
      '<input type="hidden" name="lat" id="loc_lat" value="0" />'+
      '<input type="hidden" name="long" id="loc_long" value="0" />'+
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
//        var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var myLatlng = new google.maps.LatLng(14.838,120.740);
        view.map.setCenter(myLatlng);
        view.map.setZoom(14);


        google.maps.event.addListener(view.map, 'click', function(event) {
          if(view.marker){
            view.repositionMarker(event.latLng);
          } else {
            view.placeMarker(event.latLng);
          }

          window.setTimeout(function() {
//            view.map.panTo(view.marker.getPosition());
            view.map.setZoom(16);
            view.infowindow.open(view.map,view.marker);
            view.saveMarkerBtn();
            $('input#loc_lat').val(event.latLng.lat().toFixed(3));
            $('input#loc_long').val(event.latLng.lng().toFixed(3));
          }, 1000);


//          view.map.setCenter(view.marker.getPosition());


        });

      }, function() {

      });
    } else {
      // Browser doesn't support Geolocation

    }
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
  },

  toggleLayer: function(i){
    var view = com.glados.views.home.index;
    if (view.layers[i].getMap() === null) {
      google.maps.event.addListener(view.layers[i], "status_changed", function() {
        if (view.layers[i].getStatus() != google.maps.KmlLayerStatus.OK) {
          alert("Vector file is invalid or web server works incorrectly");
        }
        else {
          view.layers[i].setMap(view.map);
        }
      });
      view.layers[i].setMap(view.map);
    } else {
      view.layers[i].setMap(null);
    }
  },

  saveMarkerBtn: function(){
    var $saveMarkerForm = $('form#SaveMarker');
    $('a.save-marker').on('click', function(){
      $.ajax({
        type: "POST",
        url: $saveMarkerForm.prop('action'),
        data: $saveMarkerForm.serialize(),
        success: function(response){
          if(data.status === 'success') {
            toastr.success('Preparing your Application Form', 'Done!');
            setTimeout(function(){ window.location.href='/locational_clearances/' + response.lc_id; }, 2000);
          } else {
            toastr.error('Something went wrong.', 'Failed.')
          }
        },
        dataType: 'json'
      });
    });
  }


}
