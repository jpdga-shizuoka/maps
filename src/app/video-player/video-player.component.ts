import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent {
  @ViewChild('videoplayer') videoplayer;

  stop(): void {
    const player = this.videoplayer as ElementRef<HTMLMediaElement>;
    player.nativeElement.pause();
  }
}
