import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InputConReturn } from '../../module/common.model';
import { SubscribableService } from '../../services/subscribable.service';
@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.scss']
})
export class ComboBoxComponent implements OnInit {

  @Input() name: string;
  @Input() title: string;
  @Input() isDisabled:boolean=false;
  @Input() isComboCheck:boolean=false;
  @Input() isSelect:boolean=false;
  @Input() isDate:boolean=false;
  @Input() isSearch:boolean = false;
  @Input() isFilter:boolean = false;
  @Input() isTable:boolean=false;
  @Input() hasplaceholder:boolean;
  @Input() valueInput:string;
  @Input() hideTitle:boolean;
  @Input() isValid:boolean = true;
  @Input() errorMessage:string;
  @Input() maxLen:number=100;
  @Input() infoTip:string;
  @Input() type:string;
  @Input() infoTipShow:boolean=false;
  @Output() inputClick = new EventEmitter<InputConReturn>();
  @Output() fieldIconClick = new EventEmitter<InputConReturn>();
  @Output() inputBlur = new EventEmitter<boolean>();
  inputReturn:InputConReturn=new InputConReturn();
  @Output() selectClick = new EventEmitter<InputConReturn>();
  inputValue:string="";
  isOnBlur:boolean = true;

  constructor(public subs:SubscribableService) {
    this.inputValue = this.valueInput;
  }

  ngOnInit(): void {
  }

  onClick(event: KeyboardEvent) {
    this.inputReturn=new InputConReturn();
    this.inputReturn.name=this.name;
    // this.valueInput="";
    this.inputReturn.value=this.valueInput;
    this.fieldIconClick.emit(this.inputReturn);
  }

  onClean(event: KeyboardEvent) {
    this.inputReturn=new InputConReturn();
    this.inputReturn.name=this.name;
    this.valueInput="";
    this.inputReturn.value=this.valueInput;
    this.fieldIconClick.emit(this.inputReturn);
  }

  onSelect(event: KeyboardEvent) {
    this.inputReturn=new InputConReturn();
    this.inputReturn.name=this.name;
    //this.valueInput="";
    this.inputReturn.value=this.valueInput;
    this.selectClick.emit(this.inputReturn);
  }


  checkKeyUp($event){
    this.inputReturn=new InputConReturn();
    this.inputReturn.name=this.name;
    this.inputReturn.value=this.valueInput;
    this.inputReturn.isBlur= false;
    this.inputClick.emit(this.inputReturn);
  }
  onBlur(){
    console.log("onBlur()");
    this.inputBlur.emit(true);
    // this.subs.dropdownOpen = false;
  }

  hideSearchs(){
    this.inputReturn=new InputConReturn();
    this.inputReturn.name=this.name;
    this.inputReturn.value=this.valueInput;
    this.inputReturn.isBlur= true;
    this.inputClick.emit(this.inputReturn);
  }

  columnClick(){
    this.subs.dropdownOpen = false;
    //this.fieldIconClick.emit(this.inputReturn);
    // console.log("columnClick:",this.inputReturn)
    this.inputReturn=new InputConReturn();
    this.inputReturn.name=this.name;
    this.inputReturn.value=this.valueInput;
    this.inputReturn.isBlur= false;
    this.inputClick.emit(this.inputReturn);
  }

  checkClass(){
    return this.isValid ? '' : 'danger';
  }

  infoTipShowing(){
    let _n = this.title;
    this.subs.tipClosing.next(_n);
  }
}
