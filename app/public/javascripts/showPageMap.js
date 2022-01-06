function initMap() {
	// The map, centered at Uluru
	const map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: picture.geometry,
	});
	// The marker, positioned at Uluru
	const marker = new google.maps.Marker({
		position: picture.geometry,
		map: map,
	});
}
