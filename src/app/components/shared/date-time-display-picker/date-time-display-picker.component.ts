import { Component, OnInit, ChangeDetectionStrategy, Input, Output, OnDestroy, ViewChild, ElementRef,EventEmitter } from '@angular/core';
import { ChangeDetectorRef, Pipe, PipeTransform, WrappedValue } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { LocaleDateAdapter } from '../../shared/adapters/LocaleDateAdapter';
import { DateAdapter } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { TimeZoneService } from '../../shared/timezone/timezone.service';
import * as moment from 'moment';
import { SRTOWO_DATE_FORMATS } from '../../shared/constants/SRToWO_Date_Formats';
import { DateTimePickerValue} from '../../../module/common.model';

@Component({
  selector: 'app-date-time-display-picker',
  templateUrl: './date-time-display-picker.component.html',
  styleUrls: ['./date-time-display-picker.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useExisting: LocaleDateAdapter
    }
  ],
})

export class DateTimeDisplayPickerComponent implements OnInit, OnDestroy {

  @Input() control: AbstractControl;
  @Input() selectedDate: Date;
  @Input() dateFieldLabel: string;
  @Input() isReadOnly: boolean = false;
  @Input() isRequired: boolean = false;
  @Input() min:Date;
  @Input() max:Date;
  @Output() selectedDateValue = new EventEmitter<any>();

  private subscriptions: Subscription[] = [];
  private lastTimeZoneOffset: number = 0;
  

  @ViewChild('pickerInput', {static:true}) public pickerInputERef: ElementRef;

  constructor(private timeZoneService: TimeZoneService,private adapter: LocaleDateAdapter) { }
  ngOnInit() {
    
    //this.setValidation();
    
    this.subscriptions.push(this.timeZoneService.selectedTimeZoneShortName 
      .subscribe((shortName) => {
        //this.dateAdapter.setLocale('en-GB');
      }));

      //this.adapter.timeZone = "ETS";
  }


  resetDate() {
    this.selectedDate = null;
    let datePicker : DateTimePickerValue = new DateTimePickerValue();
    datePicker.Field = this.dateFieldLabel;
    datePicker.SelectedDateValue = null;
    this.selectedDateValue.emit(datePicker);
  }

  onDateChanged(type: string, event: any) {
    console.log(`${type}: ${event.value}`);
    let value :string = event.targetElement.value;
    let date = this.adapter.parse(value.trim());
    
    this.selectedDate = date;
    let datePicker : DateTimePickerValue = new DateTimePickerValue();
    datePicker.Field = this.dateFieldLabel;
    datePicker.SelectedDateValue = this.selectedDate;
    this.selectedDateValue.emit(datePicker);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getESTValue(): Date {
    var value = moment(this.control.value, SRTOWO_DATE_FORMATS.parse.valueFromDatePicker, true);
    value = value.add(-this.lastTimeZoneOffset, 'hour');
    return value.toDate();
  }
}
