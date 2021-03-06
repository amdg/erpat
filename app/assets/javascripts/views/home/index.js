com.glados.views.home = com.glados.views.home || {};
com.glados.views.home.index = {
  map: null,
  layers: [],
  marker: null,
  infowindow: null,
  init: function(){
    var view = com.glados.views.home.index;


    view.layers[0] = new google.maps.KmlLayer({url: '/maps/hazard.kmz', preserveViewport: true, suppressInfoWindows: false});
    view.layers[1] = new google.maps.KmlLayer({url: '/maps/hazard.kmz', preserveViewport: true, suppressInfoWindows: false});
    view.layers[2] = new google.maps.KmlLayer({url: '/maps/hazard.kmz', preserveViewport: true, suppressInfoWindows: false});
    view.layers[3] = new google.maps.KmlLayer({url: '/maps/hazard.kmz', preserveViewport: true, suppressInfoWindows: false});
    for (var i = 0; i < view.layers.length; i++) {
      view.layers[i].setMap(null);
    }

    view.startBtn();

    view.map = new google.maps.Map(document.getElementById("map-canvas"),{
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var contentString = '<div class="mediumwindow"><div class="marker-info-win">'+
    '<div class="marker-inner-win"><span class="info-content">'+
    '<h1 class="marker-heading">Pin your location</h1><div class="marker-edit">'+
      '<form action="/locational_clearances" method="POST" name="SaveMarker" id="SaveMarker">'+
      '<label for="full_name"><input type="text" name="full_name" placeholder="Full Name" maxlength="40" /></label>'+
      '<label for="contact_number"><input type="text" name="contact_number" placeholder="Contact Number" maxlength="40" /></label>'+
      '<label for="address"><input type="text" name="address" placeholder="Building Address" maxlength="40" /></label>'+
      '<label for="land_use"><select name="land_use" class="save-type"><option value="Agricultural">Agricultural</option>' +
      '<option value="Agricultural Nursery">Agricultural Nursery</option>'+
      '<option value="Agri-industrial">Agri-industrial</option>' +
      '<option value="Commercial">Commercial</option>' +
      '<option value="Agro-ecotourism">Agro-ecotourism</option>' +
      '<option value="Industrial">Industrial</option>' +
      '<option value="Institutional">Institutional</option>' +
      '<option value="Residential">Residential</option>' +
      '</select></label>'+
      '<label for="purpose"><textarea name="purpose" class="save-desc" placeholder="Enter Purpose" maxlength="150"></textarea></label>'+
      '<input type="hidden" name="lat" id="loc_lat" value="0" />'+
      '<input type="hidden" name="long" id="loc_long" value="0" />'+
      '</form>'+
      '</div><a href="#" class="btn btn-primary save-marker">Submit</a></div>';

    view.infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 500,
      width: 500
    });

    if(navigator.geolocation) {
      // Locate User
      navigator.geolocation.getCurrentPosition(function(position) {
//        var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var myLatlng = new google.maps.LatLng(13.009,124.071);
        view.map.setCenter(myLatlng);
        view.map.setZoom(12);


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
      $('#instruction').removeClass('hide');
    });
  },

  toggleLayer: function(i){
    var view = com.glados.views.home.index;
    console.log(view.layers);
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
    $('a.save-marker').off('click').on('click', function(){
      $.ajax({
        type: "POST",
        url: $saveMarkerForm.prop('action'),
        data: $saveMarkerForm.serialize(),
        success: function(response){
          if(response.status === 'success') {
            toastr.success('Preparing your Application Form...', 'Done!');
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
