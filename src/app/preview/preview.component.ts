import { Component, ViewChild } from '@angular/core';
import { VideoPlayerComponent } from '../video-player/video-player.component';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html'
})
export class PreviewComponent {
  @ViewChild(VideoPlayerComponent) videoPlayerComponent: VideoPlayerComponent;

  onClosed(): void {
    this.videoPlayerComponent.stop();
  }
}
