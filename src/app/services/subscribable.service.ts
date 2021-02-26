import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EquipmentChangeSearchResult } from '../module/common.model';

@Injectable({
  providedIn: 'root'
})
export class SubscribableService {
  public dropdownOpen:boolean = false;
  public filterArray = new BehaviorSubject<any>([]);
  public requestsListFiltered : EquipmentChangeSearchResult[] = [];
  tipClosing = new BehaviorSubject<string>("");
  public clientSelected:number=-1;
  public approve = new BehaviorSubject<number[]>(null);
  constructor() { }
}
