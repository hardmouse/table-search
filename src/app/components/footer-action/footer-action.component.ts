import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { DataService } from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';
import { ModalService } from '../../services/modal.service';
import { InputConReturn, RequestReturn,SelectedApprovalRequests } from '../../module/common.model';
import { SubscribableService } from '../../services/subscribable.service';
import { Subscription, Observable, Subject } from "rxjs";
@Component({
  selector: 'app-footer-action',
  templateUrl: './footer-action.component.html',
  styleUrls: ['./footer-action.component.scss']
})
export class FooterActionComponent implements OnInit {

  footerModal = 'footer-reject-modal';

  delegateCheck:boolean = false;
  delegateObj:any=[];

  approverList:any=[];
  approverListFiltered:any=[];
  approverSearchValue:string="";
  approverNoResult:boolean = false;
  approverTableShow:boolean = false;

  approverHeaders:any=["First Name","Last Name","Known As","Email","Phone","Client Business Group"];
  _sub_approve:Subscription;
  submitChangesList:number[]=[];
  constructor(
    public dataService: DataService,
    public subs:SubscribableService,
    private modalService: ModalService,
    private notifyService : NotificationService,
    private _eref: ElementRef
  ) { 
    // this._sub_approve = this.subs.approve.subscribe(value => {
     
    //   if(value!=null){
    //   }
      
    // });
  }

  ngOnInit(): void {
    this.getApprovers();
  }
  ngOnDestroy() {
    if(this._sub_approve){
      this._sub_approve.unsubscribe();
    }
  }

  getApprovers(){
    this.dataService.getData('./assets/mockData/approvers-list.json').subscribe( data => {
    // this.dataService.getData('./assets/mockdata/approval-list2.json').subscribe( data => {
      this.approverListFiltered = this.approverList = data[0].approvers;
      
      // for(let i=0; i< this.approverList.length;i++){
      //   console.log(this.approverList[i]);
      // }
    });
  }
  stripHtml(html){
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  sortItems(delegate:boolean=false){
    console.log(this.subs.requestsListFiltered);
    let msgBody:any;
    let changedItems=[];
    this.submitChangesList = [];
    if(delegate){
      for(let i=0; i < this.subs.requestsListFiltered.length; i++){
        let _temp:RequestReturn = new RequestReturn;
        _temp.name = this.subs.requestsListFiltered[i].BuildingItemNo;
        for(let j=0; j<this.subs.requestsListFiltered[i].EquipmentEntityChanges.length;j++){
          //console.log("EntityField==>",this.subs.requestsListFiltered[i].EquipmentEntityChanges[j].EntityField);
          if(this.subs.requestsListFiltered[i].EquipmentEntityChanges[j].isCheckedDetail){
            this.submitChangesList.push(this.subs.requestsListFiltered[i].EquipmentEntityChanges[j].ChangeId);
            _temp.detail.push(this.subs.requestsListFiltered[i].EquipmentEntityChanges[j]);
            _temp.isCheck = true;
            this.delegateCheck = true;
          }
        }
        changedItems.push(_temp);
      }
      msgBody = changedItems;
    }else{
      msgBody = `<ul>`;
      for(let i=0; i < this.subs.requestsListFiltered.length; i++){
        let _showItem=false;
        let _tempContainer:string = "<li>" + this.subs.requestsListFiltered[i].BuildingItemNo + "<ul>";
        for(let j=0; j<this.subs.requestsListFiltered[i].EquipmentEntityChanges.length;j++){
          if(this.subs.requestsListFiltered[i].EquipmentEntityChanges[j].isCheckedDetail){
            this.submitChangesList.push(this.subs.requestsListFiltered[i].EquipmentEntityChanges[j].ChangeId);
            _showItem = true;
            _tempContainer += "<li>" + this.subs.requestsListFiltered[i].EquipmentEntityChanges[j].EntityField + " - " + this.subs.requestsListFiltered[i].EquipmentEntityChanges[j].NewValue + "</li>";
          }
        }
        _tempContainer += "</ul></li>";
        if(_showItem){
          msgBody += _tempContainer;
        }
      }
      msgBody += `</ul>`;
    }
    return msgBody;
  }
  approve(){
    console.clear();
    let msgBody = this.sortItems();
    if(this.stripHtml(msgBody)==""){
      this.notifyService.showLimitedNote("Nothing checked.", "Note:");
    }else{

      this.notifyService.showApproved(msgBody, "APPROVED:");
      const url = 'equipmentchangerequests/approve';
      let _request: SelectedApprovalRequests = new SelectedApprovalRequests();
      _request.EquipmentEntityChangeIds = this.submitChangesList;
      const request = JSON.stringify(_request);
      this.dataService.post(url,request,"").subscribe( (rs:number[] )  =>{
        console.log(rs); 
      });
      
    }
  }

  reject(){
    console.clear();
    let msgBody = this.sortItems();
    if(this.stripHtml(msgBody)==""){
      this.notifyService.showLimitedNote("Nothing checked.", "Note:");
    }else{
      this.notifyService.showRejected(msgBody, "REJECTED:");
      const url = 'equipmentchangerequests/reject';
      let _request: SelectedApprovalRequests = new SelectedApprovalRequests();
      _request.EquipmentEntityChangeIds = this.submitChangesList;
      const request = JSON.stringify(_request);
      this.dataService.post(url,request,"").subscribe( (rs:number[] )  =>{
        console.log(rs);
      });
    }
  }
  delegate(_approver){
    console.clear();
    let msgBody = this.sortItems();
    this.closeModal(this.footerModal);
    this.notifyService.showDelegated(msgBody, "The following building item(s) have been delegated to "+_approver.fname + " " +_approver.lname +".");
    
    this.approverListFiltered = [];
    this.approverSearchValue = ""
    this.approverTableShow = false;
    this.approverNoResult = false;
  }
  delegateSelect(){
    this.openModal(this.footerModal);
  }

  openModal(id: string) {
    console.clear();
    this.delegateObj = this.sortItems(true);
    console.log("delegateCheck:",this.delegateCheck,this.delegateObj);
    if(!this.delegateCheck){
      this.notifyService.showLimitedNote("Nothing checked.", "Note:");
    }else{
      this.notifyService.clearToastr();
      this.modalService.open(id);
    }
  }

  closeModal(id: string) {
    this.delegateObj=[];
    this.delegateCheck = false;
    this.modalService.close(id);
  }
  approverSearchChange(_rv:InputConReturn){
    this.approverSearchValue = (_rv.value!==undefined)?_rv.value.trim():"";
    this.approverListFiltered = [];
    this.approverList.forEach(u=>{
      let _fn = this.approverSearchValue.toLocaleLowerCase();
      if(
        u.fname.toLocaleLowerCase().indexOf(_fn)>=0 ||
        u.lname.toLocaleLowerCase().indexOf(_fn)>=0 ||
        u.known.toLocaleLowerCase().indexOf(_fn)>=0 ||
        u.email.toLocaleLowerCase().indexOf(_fn)>=0 ||
        u.phone.toLocaleLowerCase().indexOf(_fn)>=0
        ){
        this.approverListFiltered.push(u);
      }
    });
    
    if(this.approverListFiltered.length > 0 && this.approverSearchValue != ""){
      this.approverTableShow = true;
      this.approverNoResult = false;
    }else{
      this.approverTableShow = false;
      if(this.approverSearchValue!=""){
        this.approverNoResult = true;
      }else{
        this.approverNoResult = false;
      }
      
    }
  }
  selectApprover(_data){
    this.delegate(_data);
  }
  hideReasonSearch(){

  }
  conclick(){

  }
}