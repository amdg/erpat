com.glados.views.locational_clearances = com.glados.views.locational_clearances || {};
com.glados.views.locational_clearances.list = {
  map: null,
  layers: [],
  marker: null,
  infowindow: null,

  init: function(){
    var view = com.glados.views.locational_clearances.list;
    if($('#map-canvas').length) {
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

      var myLatlng = new google.maps.LatLng(14.713,120.934);
      view.map.setCenter(myLatlng);
      view.map.setZoom(14);

      view.bindViewApplication();
    }


  },

  addMarker:function(location){
    var view = com.glados.views.locational_clearances.list;
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
    var view = com.glados.views.locational_clearances.list;
    view.marker = new google.maps.Marker({
      position: location,
      map: view.map
    });
  },

  repositionMarker: function(location) {
    com.glados.views.locational_clearances.list.marker.setPosition(location);
  },

  toggleLayer: function(i){
    var view = com.glados.views.locational_clearances.list;

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

  bindViewApplication: function(){
    var view = com.glados.views.locational_clearances.list;
    $('a.inspected-app').on('click', function(e){
      var $app = $(e.currentTarget);
      view.addMarker(new google.maps.LatLng($app.data('app-lat'),$app.data('app-long')));

      var contentString = '<div class="bigwindow"><div class="timeline-badge">' +
        '</div><div class="timeline-panel">      ' +
        '<div class="timeline-heading">        ' +
        '<h4 class="timeline-title" id="applicant-name">'+$app.data('app-full-name')+'</h4>' +
        '<p><small class="text-muted">' +
        '<i class="glyphicon glyphicon-time" id="applicant-created"></i> 11 hours ago</small></p>      ' +
        '</div>' +
        '<p><strong id="applicant-land-use">'+$app.data('app-land-use')+'</strong></p>' +
        '<div class="timeline-body">' +
        '<p id="applicant-purpose">'+$app.data('app-purpose')+'</p>' +
        '<p><strong>Inspector\'s Notes and Feedback</strong></p>' +
        '<p>I know that well enough; but, d\'ye see, the Captain here won\'t believe it; this is his first voyage; he was a Cologne manufacturer before. But come aboard, and mayhap he\'ll believe you, if he won\'t me; and so I\'ll get out of this dirty scrape.</p>'+
        '</div></div></div>' +
        '<div><a href="#" class="btn btn-success approve-app" data-app-id="'+$app.data('app-id')+'">Approve</a><a href="#" class="btn btn-danger reject-app" data-app-id="'+$app.data('app-id')+'">Reject</a></div>';

      view.infowindow.setContent(contentString);
      view.bindModerationBtns();
    });
  },

  bindModerationBtns: function(){
    $('a.approve-app').on('click', function(e){
      var $clicked = $(e.currentTarget);
      var app_id = $clicked.data('app-id');
      $.ajax({
        type: "PUT",
        url: '/locational_clearances/approve',
        data: {id: app_id},
        success: function(response){
          if(response.status === 'success') {
            toastr.success('Application Form Approved', 'Done!');
            $('tr#app-cell-'+app_id).remove();
            com.glados.views.locational_clearances.list.reloadIfEmpty();
            com.glados.views.locational_clearances.list.infowindow.close();
          } else {
            toastr.error('Something went wrong.', 'Failed.')
          }
        },
        dataType: 'json'
      });
    });

    $('a.reject-app').on('click', function(e){
      var $clicked = $(e.currentTarget);
      var app_id = $clicked.data('app-id');
      $.ajax({
        type: "PUT",
        url: '/locational_clearances/reject',
        data: {id: app_id},
        success: function(response){
          if(response.status === 'success') {
            toastr.success('Application has been rejected', 'Done!');
            $('tr#app-cell-'+app_id).remove();
            com.glados.views.locational_clearances.list.reloadIfEmpty();
            com.glados.views.locational_clearances.list.infowindow.close();
          } else {
            toastr.error('Something went wrong.', 'Failed.')
          }
        },
        dataType: 'json'
      });
    });
  },

  reloadIfEmpty: function(){
    if($('#applications-table tr').length === 0) {
      setTimeout(function(){ window.location.reload(); }, 2000);
    }
  }

}
