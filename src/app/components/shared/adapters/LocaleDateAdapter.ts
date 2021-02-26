import { NativeDateAdapter } from '@angular/material/core';
import * as moment from 'moment';

import { SRTOWO_DATE_FORMATS,REALHELP_DATE_FORMATS } from '../constants/SRToWO_Date_Formats';

export class LocaleDateAdapter extends NativeDateAdapter {

  _parsedValue: string;
  public timeZone: string = "";

  get parsedValue(): string {
    return this._parsedValue;
  }

  format(date: Date): string {
    return moment(date).format(REALHELP_DATE_FORMATS.display.dateInput) + " " + this.timeZone;
  }

  parse(value: any): Date | null {
    //value = value.toString().replace(" " + this.timeZone, "");
    if (moment(value, REALHELP_DATE_FORMATS.parse.dateInput, true).isValid()) {
      return moment(value, REALHELP_DATE_FORMATS.parse.dateInput, true).toDate();
    }
  }

  createDate(year: number, month: number, date: number): Date {
    // Moment.js will create an invalid date if any of the components are out of bounds, but we
    // explicitly check each case so we can throw more descriptive errors.
    if (month < 0 || month > 11) {
      throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }

    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    this.locale = 'en-CA'; //make dynamic
    let tzOffset = 0;
    //const result = new Date(moment().utcOffset(tzOffset).format());// moment().utcOffset(tzOffset).toDate();
    //const result = moment.utc({ year, month, date }).locale(this.locale);
    const result = moment({ year, month, date });
    // If the result isn't valid, the date must have been out of bounds for this month.
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result.toDate();
  }
}

