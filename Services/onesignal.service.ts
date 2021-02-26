import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Injectable()
export class OneSignalService {
    constructor(
        public oneSignal: OneSignal,
        public alert: AlertController,
        public PlatForm: Platform,
    ) { }
    
    //Only use this method, should be placed in Oninit or IonviewwillEnter
    startOneSignal() {
        this.PlatForm.ready().then(() => {
            //Search key and sender id, or read doccument on ionic onesignal for more infomation
            this.oneSignal.startInit("Your key go here, it look like a long text and number merged, with some '-' between them", "Your sender id go here, it is a string just number"); 
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

            this.oneSignal.handleNotificationReceived().subscribe(data => {
                let message = data.payload.body;
                let title = data.payload.title;
                console.log(title,'   ',message)
                this.showNotification(title, message);
            });
            this.oneSignal.handleNotificationOpened().subscribe(data => {
                let message = data.notification.payload.body;
                let title = data.notification.payload.title;
                console.log(title,'   ',message)
                this.showNotification(title, message);
            });
            this.oneSignal.endInit();
        })
    }

    //use aleart or anything would display the notyfy from onesignal push
    showNotification(title, message) {
        this.alert.create({
            mode: 'ios',
            header: title,
            message: message,
            buttons: [{
                text: 'OK',
            }]
        })
        .then((ele) => {
            ele.present();
        });
    }
}