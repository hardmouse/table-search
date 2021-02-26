import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

export enum TimeZoneToggle {
  USER,
  BUILDING
}

@Injectable({
  providedIn: 'root'
})
export class TimeZoneService {
  public toggleSelection: TimeZoneToggle;

  public ServerTimeZoneOffset = -5;
  public ServerTimeZone = "-0500";
  private _selectedTimeZoneDescription: BehaviorSubject<string> = new BehaviorSubject<string>("");
  private _selectedTimeZoneShortName: BehaviorSubject<string> = new BehaviorSubject<string>("");
  private _selectedTimeZoneOffset: BehaviorSubject<number> = new BehaviorSubject<number>(this.ServerTimeZoneOffset);
  private _selectedTimeZone: BehaviorSubject<string> = new BehaviorSubject<string>(this.ServerTimeZone);

  private subscriptions: Subscription[] = [];

  get selectedTimeZoneDescription(): Observable<string> {
    return this._selectedTimeZoneDescription;
  }

  get selectedTimeZoneShortName(): Observable<string> {
    return this._selectedTimeZoneShortName;
  }

  get selectedTimeZoneOffset(): Observable<number> {
    return this._selectedTimeZoneOffset;
  }

  get selectedTimeZone(): Observable<string> {
    return this._selectedTimeZone;
  }


  constructor() {
    
  }

  public getESTOffSet(offset: number): number {
    return offset - (this.ServerTimeZoneOffset);

  }


  private timeZoneFromOffset(timeZoneOffset: number): string {
    let time = timeZoneOffset;
    if (time == 0) return undefined;

    var offset = time < 0 ? "-" : "+";
    let sTime = Math.abs(time).toString();
    var value;
    if (sTime.indexOf('.') != -1)
      value = sTime.replace(".5", "30");
    else
      value = sTime + "00";

    return offset + value.padStart(4, '0');
  }

  // public toggleTimeZone(selection: TimeZoneToggle) {
  //   if (this.toggleSelection != selection) {
  //     this.toggleSelection = selection;
  //     this.subscriptions.forEach((subscription) => subscription.unsubscribe());

  //     if (selection == TimeZoneToggle.USER) {
  //       this.subscriptions.push(this.userService.userTimeZone
  //         .subscribe((timeZoneShortName) => {
  //           this._selectedTimeZoneShortName.next(timeZoneShortName);
  //         }));

  //       this.subscriptions.push(this.userService.userTimeZoneDescription
  //         .subscribe((userTimeZoneDescription) => {
  //           this._selectedTimeZoneDescription.next(userTimeZoneDescription);
  //         }));

  //       this.subscriptions.push(this.userService.userTimeZoneOffset
  //         .subscribe((timeZoneOffset) => {
  //           let offSet = timeZoneOffset;
  //           let adjustedOffSet = this.getESTOffSet(timeZoneOffset);
  //           this._selectedTimeZoneOffset.next(adjustedOffSet);
  //           this._selectedTimeZone.next(this.timeZoneFromOffset(offSet));
  //         }));
  //     }
  //     else {
  //       this.subscriptions.push(this.locationService.getLocation
  //         .subscribe((location) => {
  //           if (location && location.TimeZone) {
  //             let offSet = location.TimeZone.Offset;
  //             let adjustedOffSet = this.getESTOffSet(location.TimeZone.Offset);

  //             this._selectedTimeZoneShortName.next(location.TimeZone.ShortName);
  //             this._selectedTimeZoneDescription.next(location.TimeZone.Description);
  //             this._selectedTimeZoneOffset.next(adjustedOffSet);
  //             this._selectedTimeZone.next(this.timeZoneFromOffset(offSet));
  //           }
  //         }));

  //       this.subscriptions.push(this.workOrderService.parentWorkOrder
  //         .subscribe((parentWorkOrder) => {
  //           if (parentWorkOrder && parentWorkOrder.Location && parentWorkOrder.Location.TimeZone) {
  //             let offSet = parentWorkOrder.Location.TimeZone.Offset;
  //             let adjustedOffSet = this.getESTOffSet(parentWorkOrder.Location.TimeZone.Offset);

  //             this._selectedTimeZoneDescription.next(parentWorkOrder.Location.TimeZone.Description);
  //             this._selectedTimeZoneShortName.next(parentWorkOrder.Location.TimeZone.ShortName);
  //             this._selectedTimeZoneOffset.next(adjustedOffSet);
  //             this._selectedTimeZone.next(this.timeZoneFromOffset(offSet));
  //           }
  //         }));
  //     }
  //   }
  // }
}
