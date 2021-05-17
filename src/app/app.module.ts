import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { AngularResizedEventModule } from 'angular-resize-event';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MapsComponent } from './maps/maps.component';
import { CourseMapComponent } from './course-map/course-map.component';
import { CourseTableComponent } from './course-table/course-table.component';
import { HoleInfoSheetComponent } from './hole-info-sheet/hole-info-sheet.component';
import { EventTableComponent } from './event-table/event-table.component';
import { HoleInfoComponent } from './hole-info/hole-info.component';
import { LengthUnitPipe } from './length-unit.pipe';
import { MeterFootComponent } from './meter-foot/meter-foot.component';
import { PeriodPipe } from './period.pipe';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { LocalizePipe } from './localize.pipe';
import { LongPressDirective } from './long-press.directive';
import { GlobalLocalComponent } from './global-local/global-local.component';
import { EventPageComponent } from './event-page/event-page.component';
import { PrefaceComponent } from './preface/preface.component';
import { ConfigComponent } from './config/config.component';
import { IndexComponent } from './index/index.component';
import { ReloadComponent } from './app-reload';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { PreviewComponent } from './preview/preview.component';
import { PrintFormComponent } from './print-form/print-form.component';
import { PrintRulesComponent } from './print-rules/print-rules.component';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { PrintDialogComponent } from './dialogs/print-dialog.component';
import { PrintCardComponent } from './print-card/print-card.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    CourseTableComponent,
    CourseMapComponent,
    HoleInfoSheetComponent,
    EventTableComponent,
    HoleInfoComponent,
    LengthUnitPipe,
    MeterFootComponent,
    PeriodPipe,
    EventDetailComponent,
    LocalizePipe,
    LongPressDirective,
    GlobalLocalComponent,
    EventPageComponent,
    PrefaceComponent,
    ConfigComponent,
    IndexComponent,
    ReloadComponent,
    VideoPlayerComponent,
    PreviewComponent,
    PrintFormComponent,
    PrintRulesComponent,
    PrintLayoutComponent,
    PrintDialogComponent,
    PrintCardComponent,
  ],
  imports: [
    BrowserModule,
    GoogleMapsModule,
    AppRoutingModule,
    AngularResizedEventModule,
    BrowserAnimationsModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    HttpClientJsonpModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatBottomSheetModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatIconModule,
    MatRippleModule,
    MatRadioModule,
    MatChipsModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatButtonToggleModule,
  ],
  entryComponents: [
    HoleInfoSheetComponent,
    PrintDialogComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
