import { Injectable } from '@angular/core';
import { AudioManagement } from '@ionic-native/audio-management/ngx';

@Injectable()
export class AudioManagerService {

    constructor( private audioman: AudioManagement) { }

    switchRingerMode() {
        this.audioman.getMaxVolume(AudioManagement.VolumeType.RING).then((maxVolumn) => {
            this.audioman.setVolume(AudioManagement.VolumeType.RING,
            (maxVolumn.maxVolume)/(100)).then(() => {
            console.log(maxVolumn.maxVolume);
            }, (err) => {
                alert(JSON.stringify(err));
            })
        })
    }

    switchNormalMode() {
        this.audioman.getMaxVolume(AudioManagement.VolumeType.RING).then((maxVolumn) => {
            this.audioman.setVolume(AudioManagement.VolumeType.RING, 5).then(() => {
            console.log(maxVolumn.maxVolume);
            }, (err) => {
                alert(JSON.stringify(err));
            })
        })
    }

    getAudioMode() {
        this.audioman.getAudioMode().then((value: AudioManagement.AudioModeReturn) => {
            // console.log('Device audio mode is ' + value.label + ' (' + value.audioMode + ')');
            alert('Device audio mode is ' + value.label + ' (' + value.audioMode + ')')
        })
        .catch((reason) => {
            console.log(reason);
        });
    }
}