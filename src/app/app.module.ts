import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { LocaleDateAdapter } from './components/shared/adapters/LocaleDateAdapter';
import { MatNativeDateModule} from "@angular/material/core";
import { FooterActionComponent } from './components/footer-action/footer-action.component';
import { MainComponent } from './components/main/main.component';
import { SearchTableComponent } from './components/search-table/search-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { DateTimeDisplayPickerComponent } from './components/shared/date-time-display-picker/date-time-display-picker.component';
import { DataService } from './services/data.service';
import { ToastsComponent } from './components/toasts/toasts.component';
import { ModalComponent } from './components/modal/modal.component';
import { ComboBoxComponent } from './components/combo-box/combo-box.component';
import { PipesModule } from './services/pipes/pipes.module';

import { SubscribableService } from './services/subscribable.service';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterActionComponent,
    MainComponent,
    SearchTableComponent,
    ToastsComponent,
    ModalComponent,
    ComboBoxComponent,
    DateTimeDisplayPickerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    PipesModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule
  ],
  providers: [
    DataService,
    SubscribableService,
    LocaleDateAdapter,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
