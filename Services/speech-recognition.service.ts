import { Injectable } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { Platform } from '@ionic/angular';

@Injectable()
export class SpeechRecognitionService {

    public voiceResult:string;

    constructor(
        public speechRecognition: SpeechRecognition,
        public PlatForm: Platform,
      ) { }

    checkPermission() {
        this.PlatForm.ready().then(() => {
            this.speechRecognition.hasPermission().then((hadPermission: boolean) => {
                if(hadPermission) {
                    this.startVoiceRecord();
                }
                else {
                    this.speechRecognition.requestPermission().then(
                        () => {
                            console.log('Accepted');
                            this.startVoiceRecord();
                        },
                        () => console.error('Denied')
                    )
                }
            });
        })
    }

    startVoiceRecord() {
        this.speechRecognition.startListening().subscribe((matches: Array<string>) => {
          this.voiceResult = matches[0];
          console.log(this.voiceResult);
        })
    }
}