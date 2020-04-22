import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { AngularResizedEventModule } from 'angular-resize-event';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MapsComponent } from './maps/maps.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CourseTableComponent } from './course-table/course-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    CourseTableComponent,
  ],
  imports: [
    BrowserModule,
    GoogleMapsModule,
    AppRoutingModule,
    AngularResizedEventModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
