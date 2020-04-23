import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { AngularResizedEventModule } from 'angular-resize-event';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDividerModule } from '@angular/material/divider';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MapsComponent } from './maps/maps.component';
import { CourseMapComponent } from './course-map/course-map.component';
import { CourseTableComponent } from './course-table/course-table.component';
import { HoleInfoSheetComponent } from './hole-info-sheet/hole-info-sheet.component';

@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    CourseTableComponent,
    CourseMapComponent,
    HoleInfoSheetComponent,
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
    MatTabsModule,
    MatBottomSheetModule,
    MatDividerModule,
  ],
  entryComponents: [
    HoleInfoSheetComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
