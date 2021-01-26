import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent {
  @ViewChild('videoplayer') videoplayer;

  stop() {
    this.videoplayer.nativeElement.pause();
  }
}
