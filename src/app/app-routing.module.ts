import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventPageComponent } from './event-page/event-page.component';
import { CourseMapComponent } from './course-map/course-map.component';
import { ReloadComponent } from './app-reload';

const routes: Routes = [
  { path: '', component: EventPageComponent},
  { path: 'course/:eventId/:courseId', component: CourseMapComponent},
  { path: 'reload', component: ReloadComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
