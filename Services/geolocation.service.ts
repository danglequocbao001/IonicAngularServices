import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { LoadingService } from './loading.service';
import { Platform } from '@ionic/angular';

interface Location {
    lat: number;
    lng: number;
    address: string;
}

@Injectable()

export class GeolocationService {

    lat: any = 0;
    lng: any = 0;

    geoEncoderOptions: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
    };

    customerLocation: Location = {
        lat: 0,
        lng: 0,
        address: "null"
    };

    constructor(public geolocation: Geolocation,
        public nativeGeocoder: NativeGeocoder,
        public loadingService: LoadingService,
        public PlatForm: Platform,
        ) {}

    //only use this method
    getCurrentLocation() {
        this.PlatForm.ready().then(() => {
            this.loadingService.present();
            this.geolocation.getCurrentPosition().then((resp) => {
                this.lat = resp.coords.latitude;
                this.lng = resp.coords.longitude;
                this.getGeoEncoder(this.lat, this.lng);
                console.log(this.lat,'  ', this.lng)
                this.loadingService.dismiss();
            })
            .catch((err) => {
                console.log(err);
            })
        })
    }

    getGeoEncoder(latitude, longitude) {
        this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoEncoderOptions)
        .then((result: NativeGeocoderResult[]) => {
            console.log('result', result)
            this.customerLocation.address = this.generateAddress(result[result.length-1]);
            console.log('address: ',this.customerLocation.address);
        })
        .catch((error: any) => {
            console.log(error);
        });
    }

    generateAddress(addressObj) {
        let obj = [];
        let address = "";
        for (let key in addressObj) {
          obj.push(addressObj[key]);
        }
        obj.reverse();
        for (let val in obj) {
          if (obj[val].length)
            address += obj[val] + ', ';
        }
        return address.slice(0, -2);
    }

    distanceFromUserToPoint(lat1: number, lng1: number, lat2: number, lng2: number) {
        //count distance from user to their church, church's lat & long given by BE to count
        const R = 6371000;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lng2 - lng1) * (Math.PI / 180);
        const la1ToRad = lat1 * (Math.PI / 180);
        const la2ToRad = lat2 * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(la1ToRad) * Math.cos(la2ToRad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return Math.round(d/1000);
    }

    // loadMap() {
    //     Environment.setEnv({
    //       'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyBH-sWHs1mfptQLcfd-UgRWwExsVQ45vAk',
    //       'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyBH-sWHs1mfptQLcfd-UgRWwExsVQ45vAk'
    //     });
    //     this.map.moveCamera({
    //       target: {
    //         lat: this.customerLocation.lat,
    //         lng: this.customerLocation.lng
    //       },
    //       zoom: 18,
    //       tilt: 30,
    //     })
    //     this.map.clear()
    //     this.map.addMarkerSync({
    //       icon: 'blue',
    //       animation: 'DROP',
    //       position: {
    //         lat: this.customerLocation.lat,
    //         lng: this.customerLocation.lng
    //       }
    //     })
    // }
}