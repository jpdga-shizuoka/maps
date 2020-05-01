import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventTableComponent } from './event-table/event-table.component';
import { CourseMapComponent } from './course-map/course-map.component';

const routes: Routes = [
  { path: '', component: EventTableComponent},
  { path: 'course/:courseId', component: CourseMapComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
