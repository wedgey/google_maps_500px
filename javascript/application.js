var markers = [];
var map;

function getImages(latlng) {
  $.ajax({
    url: 'https://api.500px.com/v1/photos/search',
    data: {
      consumer_key: 'VGreza5Q2JBab9NAbs8hIxpTIVfXhYF77F9gQ5v1',
      geo: '' + latlng.lat + ',' + latlng.lng + ',' + '100km',
      rpp: 20,
      term: $('form.search-form input[name=search_terms').val(),
      image_size: 21,
      sort: '_score'
    },
    success: function(images) {
      images.photos.forEach(function(image) {
        addImageMarker(image);
      });
    }
  });
}

function addImageMarker(image) {
  var marker = new google.maps.Marker({
    position: {lat: image.latitude, lng: image.longitude},
    map: map,
    title: image.name
  });

  markers.push(marker);

  var contentString = '<img class="img-responsive" src="'+image.image_url+'"><h2>'+image.name+'</h2>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}

function getUserLocation() {
  var current_location = {lat: 49.2827 , lng: -123.1207};
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      current_location = {lat: position.coords.latitude, lng: position.coords.longitude};
    });
  }
  return current_location;
}
// This example displays a marker at the center of Australia.
// When the user clicks the marker, an info window opens.

function initMap() {
  var uluru = getUserLocation();
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: uluru
  });

  getImages(uluru);

  map.addListener('dragend', function() {
    var center = map.getCenter();
    getImages({lat: center.lat(), lng: center.lng()});
  });
}

$(function() {
  $('form.search-form').on('submit', function() {
    event.preventDefault();
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
    var center = map.getCenter();
    getImages({lat: center.lat(), lng: center.lng()}); 
  });
});