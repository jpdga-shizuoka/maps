import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventPageComponent } from './event-page/event-page.component';
import { CourseMapComponent } from './course-map/course-map.component';
import { ReloadComponent } from './app-reload';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { PrintFormComponent } from './print-form/print-form.component';
import { PrintRulesComponent } from './print-rules/print-rules.component';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { PrintCardComponent } from './print-card/print-card.component';

const routes: Routes = [
  { path: '', component: EventPageComponent},
  { path: 'course/:eventId/:courseId', component: CourseMapComponent},
  { path: 'reload', component: ReloadComponent},
  { path: 'preview', component: VideoPlayerComponent},

  //
  // for printing
  // @see https://github.com/IdanCo/angular-print-service as well
  //
  { path: 'print', component: PrintFormComponent,
    outlet: 'print',
    children: [
      { path: 'rules/:eventId/:courseId/:teeType', component: PrintRulesComponent }
    ]
  },
  { path: 'print', component: PrintFormComponent,
    outlet: 'print',
    children: [
      { path: 'layout/:eventId/:courseId/:teeType', component: PrintLayoutComponent }
    ]
  },
  { path: 'print', component: PrintFormComponent,
    outlet: 'print',
    children: [
      { path: 'card/:eventId/:courseId/:teeType', component: PrintCardComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
