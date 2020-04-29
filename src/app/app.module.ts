import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { AngularResizedEventModule } from 'angular-resize-event';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRippleModule } from '@angular/material/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MapsComponent } from './maps/maps.component';
import { CourseMapComponent } from './course-map/course-map.component';
import { CourseTableComponent } from './course-table/course-table.component';
import { HoleInfoSheetComponent } from './hole-info-sheet/hole-info-sheet.component';
import { EventTableComponent } from './event-table/event-table.component';
import { EventComponent } from './event/event.component';
import { HoleInfoComponent } from './hole-info/hole-info.component';

@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    CourseTableComponent,
    CourseMapComponent,
    HoleInfoSheetComponent,
    EventTableComponent,
    EventComponent,
    HoleInfoComponent,
  ],
  imports: [
    BrowserModule,
    GoogleMapsModule,
    AppRoutingModule,
    AngularResizedEventModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatBottomSheetModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatRippleModule,
  ],
  entryComponents: [
    HoleInfoSheetComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
