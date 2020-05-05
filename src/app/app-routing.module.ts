import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventPageComponent } from './event-page/event-page.component';
import { CourseMapComponent } from './course-map/course-map.component';

const routes: Routes = [
  { path: '', component: EventPageComponent},
  { path: 'course/:eventId/:courseId', component: CourseMapComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
