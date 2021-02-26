import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GeolocationService } from 'src/app/@app-core/utils';
@Component({
    selector: 'app-map',
    templateUrl: './map.page.html',
    styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
    map: google.maps.Map;

    center: google.maps.LatLngLiteral = this.GeolocationService.centerService;

    infoWindows: any = [];

    markers = [
        {
            location: { lat: 10.2346234, lng: 106.2363665 },
            name: 'some name',
            thumb_image: [{ url: 'url of image' }],
            address: 'an address',
        },
        {
            location: { lat: 10.2346234, lng: 106.2363665 },
            name: 'some name',
            thumb_image: [{ url: 'url of image' }],
            address: 'an address',
        },
        {
            location: { lat: 10.2346234, lng: 106.2363665 },
            name: 'some name',
            thumb_image: [{ url: 'url of image' }],
            address: 'an address',
        }
    ]

    @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
    constructor(
        public platform: Platform,
        private GeolocationService: GeolocationService,
        private geolocationService: GeolocationService,
    ) { }

    ngOnInit() {
        this.GeolocationService.getCurrentLocation();
        this.addDataMarkerToMap();
    }

    ionViewWillEnter() {
        this.center = this.GeolocationService.centerService;
        this.initMap();
    }

    ngAfterViewInit() {
    }

    initMap(): void {
        this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
            center: this.center,
            zoom: 15,
            disableDefaultUI: true,
        });
    }

    getCurrentLocation() {
        this.GeolocationService.getCurrentLocation();
        this.center = this.GeolocationService.centerService;
        this.initMap();
        this.addCurrenMarker();
        this.addDataMarkerToMap();
    }

    addCurrenMarker() {
        let currentMarker = new google.maps.Marker({
            position: new google.maps.LatLng(this.center.lat, this.center.lng),
            label: 'Change your location',
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            draggable: true,
        });
        currentMarker.setMap(this.map);
        this.getCurrentMarkerLatLng(currentMarker, this.center.lat, this.center.lng);
    }

    getCurrentMarkerLatLng(currentMarker, lat, lng) {
        google.maps.event.addListener(currentMarker, 'dragend', function (event) {
            lat = event.latLng.lat();
            lng = event.latLng.lng();
        });
    }

    addDataMarkerToMap() {

    }

    addMarkersToMap(markers) {
        for (let marker of markers) {
            let distance = this.geolocationService.distanceFromUserToPoint(this.center.lat, this.center.lng, marker.location.lat, marker.location.long);
            let position = new google.maps.LatLng(marker.location.lat, marker.location.long);
            let mapMarker = new google.maps.Marker({
                position: position,
                label: marker.name,
                icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
            });
            let mapMarkerInfo = {
                name: marker.name,
                url: marker.thumb_image.url,
                address: marker.address,
                distance: distance,
                lat: marker.location.lat,
                lng: marker.location.long,
            }

            mapMarker.setMap(this.map);
            this.addInfoWindowToMarker(mapMarker, mapMarkerInfo);
        }
    }

    async addInfoWindowToMarker(marker, mapMarkerInfo) {
        let infoWindowContent =
            '<div *ngIf=" markers.length != null ">' +
            '<h3 style=" display: block; text-align: center; ">' + mapMarkerInfo.name + '</h3>' +
            '<img style=" height: 100px; width: 100%; display: block; border-radius: 12px; " src=' + mapMarkerInfo.url + '>' +
            '<h5>' + mapMarkerInfo.address + '</h5>' +
            '<p>Distance: ' + mapMarkerInfo.distance + ' km</p>' +
            '<p>Latitude: ' + mapMarkerInfo.lat + '</p>' +
            '<p>Longitude: ' + mapMarkerInfo.lng + '</p>' +
            '<ion-button id="navigate" style=" --background: #F6C33E; --border-radius: 10px; display: block; ">' + 'Navigate here' + '</ion-button>'
        '</div>';
        let infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent,
        });

        marker.addListener('click', () => {
            this.closeAllInfoWindows();
            infoWindow.open(this.map, marker);

            google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
                document.getElementById('navigate').addEventListener('click', () => {
                    window.open('https://www.google.com/maps/dir/?api=1&destination=' + mapMarkerInfo.lat + ',' + mapMarkerInfo.lng);
                });
            });

        });
        this.infoWindows.push(infoWindow);
    }

    closeAllInfoWindows() {
        for (let window of this.infoWindows) {
            window.close();
        }
    }
}
