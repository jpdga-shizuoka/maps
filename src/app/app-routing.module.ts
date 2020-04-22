import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseMapComponent } from './course-map/course-map.component';

const routes: Routes = [
  { path: '', component: CourseMapComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
