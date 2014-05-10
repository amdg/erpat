com.glados.views.locational_clearances = com.glados.views.locational_clearances || {};
com.glados.views.locational_clearances.index = {
  map: null,
  layers: [],
  marker: null,
  infowindow: null,

  init: function(){
    var view = com.glados.views.locational_clearances.index;


    view.layers[0] = new google.maps.KmlLayer({url: 'http://downloads.noah.dost.gov.ph/downloads/special/landslides/landslide_inventory/nationwide-li.KML', preserveViewport: true, suppressInfoWindows: false});
    view.layers[1] = new google.maps.KmlLayer({url: 'http://downloads.noah.dost.gov.ph/downloads/Iba_na_ang_Panahon_Nationwide_IEC/Region%20III/storm%20surge/HM_0_2.kmz', preserveViewport: true, suppressInfoWindows: false});
    view.layers[2] = new google.maps.KmlLayer({url: 'http://downloads.noah.dost.gov.ph/downloads/Iba_na_ang_Panahon_Nationwide_IEC/Region%20III/storm%20surge/HM_2_4.kmz', preserveViewport: true, suppressInfoWindows: false});
    view.layers[3] = new google.maps.KmlLayer({url: 'http://downloads.noah.dost.gov.ph/downloads/Iba_na_ang_Panahon_Nationwide_IEC/Region%20III/storm%20surge/HM_4_6.kmz', preserveViewport: true, suppressInfoWindows: false});
    for (var i = 0; i < view.layers.length; i++) {
      view.layers[i].setMap(null);
    }

    view.map = new google.maps.Map(document.getElementById("map-canvas"),{
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });


    view.infowindow = new google.maps.InfoWindow({
      maxWidth: 500,
      width: 500
    });

    if(navigator.geolocation) {
      // Locate User
      navigator.geolocation.getCurrentPosition(function(position) {
//        var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var myLatlng = new google.maps.LatLng(14.713,120.934);
        view.map.setCenter(myLatlng);
        view.map.setZoom(14);

      }, function() {

      });
    } else {
      // Browser doesn't support Geolocation

    }

    var docs = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('id'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: '/locational_clearances/queued.json',
      remote: '/locational_clearances/queued.json'
    });
    docs.initialize();

    $('#remote .typeahead').typeahead(null, {
      name: 'lc-docs',
      displayKey: 'id',
      source: docs.ttAdapter()
    }).on('typeahead:selected', function (obj, datum) {
      view.addMarker(new google.maps.LatLng(datum.lat,datum.long));
      var contentString = '<div class="bigwindow"><div class="timeline-badge">' +
        '</div><div class="timeline-panel">      ' +
        '<div class="timeline-heading">        ' +
        '<h4 class="timeline-title" id="applicant-name">'+datum.full_name+'</h4>' +
        '<p><small class="text-muted">' +
        '<i class="glyphicon glyphicon-time" id="applicant-created"></i> 11 hours ago</small></p>      ' +
        '</div>' +
        '<p><strong id="applicant-land-use">'+datum.land_use+'</strong></p>' +
        '<div class="timeline-body">' +
        '<p id="applicant-purpose">'+datum.purpose+'</p>' +
        '</div></div></div>';
      view.infowindow.setContent(contentString);
    });


  },

  addMarker:function(location){
    var view = com.glados.views.locational_clearances.index;
    if(view.marker){
      view.repositionMarker(location);
    } else {
      view.placeMarker(location);
    }

    view.map.panTo(view.marker.getPosition());
    view.map.setZoom(16);
    view.infowindow.open(view.map,view.marker);
  },

  placeMarker: function(location) {
    var view = com.glados.views.locational_clearances.index;
    view.marker = new google.maps.Marker({
      position: location,
      map: view.map
    });

  },

  repositionMarker: function(location) {
    com.glados.views.locational_clearances.index.marker.setPosition(location);
  },

  toggleLayer: function(i){
    var view = com.glados.views.locational_clearances.index;

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
  }

}
