import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataService } from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';
import { ModalService } from '../../services/modal.service';
import { InputConReturn, DateTimePickerValue,ApprovalPortalFilter,EquipmentChangeSearchResults,EquipmentChangeSearchResult,GloballFilter,
  ClientItem,EquipmentEntityChange,PhyLocation } from '../../module/common.model';
import { SubscribableService } from '../../services/subscribable.service';
import { allowedNodeEnvironmentFlags } from 'process';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.scss']
})

export class SearchTableComponent implements OnInit, OnChanges {
  @Input() searching:boolean=false;
  @Input() cancelling:boolean=false;
  @Input() showDetail: boolean = true;
  loading:boolean=false;
  checkAllVerify:boolean = false;
  mockKey:any;
  openAll:boolean = true;
  catagory = [
    {id:'1',name:"Building Item and Update Field",input:"",type:"text",default:"",isOpen:false,isDisabled:false},
    {id:'2',name:"Status",input:"ALL",type:"comboCheck",default:[
      {"name":'ALL',"Description":"ALL","isChecked":true},
      {"name":'APPROVED',"Description":"APPROVED","isChecked":false},
      {"name":'PENDING',"Description":"PENDING","isChecked":false},
      {"name":'REJECTED',"Description":"REJECTED","isChecked":false}
    ],isOpen:false,isDisabled:true},
    {id:'3',name:"Old Value",input:"",type:"text",default:"",isOpen:false,isDisabled:false},
    {id:'4',name:"New Value",input:"",type:"text",default:"",isOpen:false,isDisabled:false},
    {id:'5',name:"Reason for Rejection",input:"",type:"text",default:"",isOpen:false,isDisabled:false},
    {id:'6',name:"Requested Date",input:"",type:"date",default:"",isOpen:false,isDisabled:false},
    {id:'7',name:"Location",input:"",type:"table",default:[],isOpen:false,isDisabled:false},
    // {id:'8',name:"System Type",input:"",type:"comboCheck",default:"",isOpen:false,isDisabled:true},
    {id:'9',name:"Client",input:"",type:"comboCheck",default:[],isOpen:false,isDisabled:true},
    {id:'10',name:"Approver",input:"",type:"text",default:"",isOpen:false,isDisabled:false},
    {id:'11',name:"Comments",input:"",type:"text",default:"",isOpen:false,isDisabled:false}
  ];

  clientList:ClientItem[] = [];
  clientSearchKey:string = "";
  clientFiltered:ClientItem[]= [];

  locationList:PhyLocation[] = [];
  locationSearchKey:string = "";
  locationFiltered:any [];

  systemTypeList:any = [];
  systemTypeSearchKey:string = "";
  systemTypeFiltered:any [];

  showReasonSearchDialog:any = [];
  showReasonNoResult:any = [];
  reasonSearchValue:string = "";
  reasonSearchFilter: any =[];
  presetReasonList = [
    {"name":1,"Description":"Equipment already exists"},
    {"name":2,"Description":"The wrong information was entered"},
    {"name":3,"Description":"The wrong action was chosen"},
    {"name":4,"Description":"Add not approved by Facility/Regional Manager"}
  ];

  requestsListView:EquipmentChangeSearchResult[] = [];
  requestsListFiltered:EquipmentChangeSearchResult[] = [];
  //requestsListSearchArray:EquipmentChangeSearchResult[] = [];
  PageNumber:number=1;
  LocationPageNumber:number=1;
  checkAll:boolean=false;
  requestDate:Date=null;
  LocationIdSelected:number=0;

  constructor(
    public dataService: DataService,
    public subs:SubscribableService,
    private modalService: ModalService,
    // private fb: FormBuilder,
    private notifyService : NotificationService
    ) { }
    
  ngOnChanges(changes: SimpleChanges) {
    if(this.checkAllVerify){
      this.checkAll=!this.checkAll;
      this.onCheckAll();
    }
    this.checkAllVerify=true;
    if(changes.searching){
      console.log("Trigger from MAIN parent searching:", changes.searching.currentValue);
    }else if(changes.cancelling){
      console.log("Trigger from MAIN parent cencelling:", changes.cancelling.currentValue);
    }
  }
  ngOnInit(): void {
    this.subs.filterArray.next(this.catagory);
    this.getLocationList();
    this.getClientsList();
    //this.getSystemTypeList();
    this.subs.filterArray.subscribe(x=>{
      console.warn("===== Subscribe to get filtered data ========");
      //this.getDataList();
    })
    this.getRequestList();
  }


  onCheckAll(){
    this.requestsListFiltered.forEach(x=>{
      x.isChecked = this.checkAll;
      x.updated.forEach(i=>{
        if(i.CanBeApproved){i.isCheckedDetail = this.checkAll}
      });
    })
    if(this.checkAll){
      this.notifyService.showLimitedNote("", "All item Checked:");
    }
  }

  isCheckAll(){
    let _isallchecked = true;
    if(this.requestsListFiltered.findIndex(x=>x.isChecked==false)>=0){ _isallchecked=false;}
    else{
      this.requestsListFiltered.forEach(x=>{
        if(x.updated.findIndex(u=>u.isCheckedDetail==false)>=0){
          _isallchecked = false;
        }
      });
    }
    this.checkAll = _isallchecked;
  }

  async getLocationList(){

    const url = 'equipmentchangerequests/getlocations/';
    let body = this.initGlobalFilter();
    const request = JSON.stringify(body);
    this.dataService.post(url,request,"").subscribe( (rs : any)  =>{
      console.log(rs);
      this.locationFiltered = rs.ListLocations;
      this.catagory[6].default = this.locationFiltered;
    });
  }

  initGlobalFilter(){
    let body : GloballFilter = new GloballFilter();
    body.PageNumber =  this.PageNumber;
    body.PageSize = 6;
    body.Clients = "46,5";
    body.SearchQueryData = this.locationSearchKey;
    return body;
  }

  async getClientsList(){

    const url = 'equipmentchangerequests/getclients/';
    //let body = this.initGlobalFilter();
    //const request = JSON.stringify(body);
    this.dataService.post(url,"","").subscribe( (rs : any)  =>{
      console.log(rs);
      this.clientFiltered = rs.ListClients;
      this.clientFiltered.forEach(x=>{x.isChecked = false;})
      let _all = new ClientItem();
      _all.isChecked = true;
      _all.ClientName = "ALL";
      _all.ClientId = -1;
      this.clientFiltered.unshift(_all);
      this.clientList = this.clientFiltered;
     
      //this.catagory[7].default = this.clientFiltered;
      this.catagory[7].input = "ALL";
    });
  }

  async getRequestList(){
    const url = 'equipmentchangerequests/search/';
    // const url = './assets/mockdata/approval-list2.json';
    let body = this.initFilterParam();
    const request = JSON.stringify(body);
    this.requestsListFiltered = [];
    this.loading=true;
    this.dataService.post2(url,request,"").subscribe( (rs : EquipmentChangeSearchResults)  =>{
      console.log(rs);
      this.loading=false;
      this.requestsListFiltered = rs.SearchResults;
      this.requestsListFiltered.forEach(x=>{
        x.updated = x.EquipmentEntityChanges;
        x.isChecked=false;
        x.isOpen=true;
        x.noChildApprovable = (x.EquipmentEntityChanges.findIndex(_x=>_x.CanBeApproved==true)<0) ? true : false;
        x.updated.forEach(y=>{y.isCheckedDetail = false});
      });
      this.subs.requestsListFiltered = this.requestsListFiltered;
    });
  }

  initFilterParam(){
    let body : ApprovalPortalFilter = new ApprovalPortalFilter();
    body.PageNumber =  this.PageNumber;
    body.PageSize = 50;
    body.BuildingItemNumber = this.catagory[0].input;
    body.Clients = this.initSelectedClientId();
    body.ListStatus=this.catagory[1].input;
    body.OldValue=this.catagory[2].input;
    body.NewValue=this.catagory[3].input;
    body.ReasonRejection=this.catagory[4].input;
    body.RequestDate=this.catagory[5].input;
    body.Location=(this.LocationIdSelected==0)? "":this.LocationIdSelected.toString();
    body.Comments=this.catagory[9].input;
    body.Approver=this.catagory[8].input;
    return body;
  }

  initSelectedClientId(){
    let _c="";
    if(this.clientFiltered && this.clientFiltered.length>0 ){
      if(this.clientFiltered[0].isChecked){
        return _c;
      }
      else{
        this.clientFiltered.filter(x=>x.ClientName!="ALL").forEach(x=>{
          if(x.isChecked){
            _c = _c + x.ClientId + ",";
          }
        })
      }
    }
    
    return _c;
  }

  inputIconClick(_irv :InputConReturn,_cata,_type){
    if(_irv.value!==undefined &&_type!=="table"){
      this.catagory[_cata].input = _irv.value.trim();
      this.getRequestList();
    }
    else if(_type=="table"){
      this.catagory[_cata].input = _irv.value.trim();
      
      if(this.catagory[_cata].input==""){
        this.locationFiltered = [];
        this.catagory[_cata].isOpen = true;
        this.LocationIdSelected = 0;
        this.locationSearchKey = "";
        this.catagory[6].default = this.locationFiltered;
        this.getLocationList();
      }
      else{
        this.catagory[_cata].isOpen = false;
      }
      
      this.getRequestList();
    }
  }

  inputSelectClick(_irv :InputConReturn,_cata,_type){
    this.catagory[_cata].input = _irv.value.trim();
    if(_type == "comboCheck"){
      this.catagory[_cata].isOpen = true;
      this.subs.dropdownOpen=true;
      this.catagory[7].input="";
      this.clientFiltered.filter(x=>x.ClientName!="ALL").forEach(x=>{
        if(x.isChecked){
          this.catagory[7].input = this.catagory[7].input + x.ClientName + ",";
        }
        if(this.catagory[7].input.length>100){
          return;
        }
      });
      if(this.catagory[7].input=="" || this.clientFiltered.filter(x=>x.ClientName!="ALL").findIndex(X=>X.isChecked==false)<0){
        this.catagory[7].input = "ALL";
      }
    }
  }

  checkByGroup(_group,_checked){
    
    this.requestsListFiltered[_group].updated.forEach(i=>{
      if(i.CanBeApproved){i.isCheckedDetail = _checked}
    });
    this.subs.requestsListFiltered = this.requestsListFiltered;
    this.isCheckAll();
  }
 
  checkRequestListDetail(_group,_item,_checked){
    this.requestsListFiltered[_group].updated[_item].isCheckedDetail = _checked;
    if(this.requestsListFiltered[_group].updated.findIndex(x=>x.isCheckedDetail==false && x.CanBeApproved) < 0){
      this.requestsListFiltered[_group].isChecked = true;
    }
    else{
      this.requestsListFiltered[_group].isChecked = false;
    }
    this.subs.requestsListFiltered = this.requestsListFiltered;
    this.isCheckAll();
  }


  checkRowDetail(_group,_item){
    // console.log("CanBeApproved:",this.requestsListFiltered[_group].updated[_item].CanBeApproved);
    if(this.requestsListFiltered[_group].updated[_item].CanBeApproved){
      this.requestsListFiltered[_group].updated[_item].isCheckedDetail = !this.requestsListFiltered[_group].updated[_item].isCheckedDetail;
      this.checkRequestListDetail(_group,_item,this.requestsListFiltered[_group].updated[_item].isCheckedDetail);
    }
  }
  checkItemCollapse(_group){
    this.requestsListFiltered[_group].isOpen = !this.requestsListFiltered[_group].isOpen;
  }
  checkAllCollapse(){
    this.openAll = !this.openAll;
    for(let i=0; i < this.requestsListFiltered.length;i++){
      this.requestsListFiltered[i].isOpen = this.openAll;
    }
  }

  mouseoutDropdown(_group,_item){
    // this.showReasonSearchDialog[_group][_item] = false;
    // console.log("out:",_group,_item);
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }
  hideSearchs(titlename:string){
    this.closeAllTitleDropdown();
    this.catagory.forEach(x=>{x.isOpen = false;})
  }

  updateReasonValue(_group,_item,_val){
    this.requestsListFiltered[_group].updated[_item].reason = _val;
  }
  reasonTextOnChang(_rv :InputConReturn,_group,_item){
    this.requestsListFiltered.forEach(x=>x.updated.forEach(y=>{y.showReasonSearchDialog=false;}));
    this.reasonSearchValue = (_rv.value!==undefined)?_rv.value.trim():"";
    //this.updateReasonValue(_group,_item,this.reasonSearchValue);
    this.requestsListFiltered[_group].updated[_item].reason = this.reasonSearchValue;
    this.reasonSearchFilter = [];
    this.presetReasonList.forEach(u=>{
      let _v = u.Description;
      if(_v.toLocaleLowerCase().indexOf(this.reasonSearchValue.toLocaleLowerCase())>=0){
        this.reasonSearchFilter.push(u);
      }
    });
    if(this.reasonSearchFilter.length >0){
      this.requestsListFiltered[_group].updated[_item].showReasonSearchDialog = true;
    }else{
      this.requestsListFiltered[_group].updated[_item].showReasonSearchDialog = true;
    }

  }
  hideReasonSearch(){
    this.requestsListFiltered.forEach(x=>x.updated.forEach(y=>{y.showReasonSearchDialog=false;}));
  }

  selectTheReason(_pick,_group,_item){
    this.requestsListFiltered[_group].updated[_item].reason = this.reasonSearchFilter[_pick].Description;
    this.requestsListFiltered[_group].updated[_item].showReasonSearchDialog=false;
  }
  selectLocation(_p,id,_i){
    this.LocationIdSelected = id;
    this.catagory[_i].input = _p;
    this.closeAllTitleDropdown();
  }
  selectTitle(_p,_i){
    this.catagory[_i].input = _p.Description;
    console.log(_p.length,_i);
    this.closeAllTitleDropdown();
  }

  selectClientComboCheck(_i,_p){
    if(_p==0){
      this.clientFiltered[_p].isChecked = !this.clientFiltered[_p].isChecked;
      if(this.clientFiltered[_p].isChecked){
        this.clientFiltered.forEach(x=>x.isChecked=true);
        this.catagory[7].input = "ALL";
      }
      else{
        this.clientFiltered.filter(x=>x.ClientName!="ALL").forEach(x=>x.isChecked=false);
        this.catagory[7].input = "ALL";
      }
    }
    else{
      this.clientFiltered[_p].isChecked = !this.clientFiltered[_p].isChecked;
      if(this.clientFiltered.filter(x=>x.ClientName!="ALL").findIndex(x=>x.isChecked==false)<0){
        this.clientFiltered[0].isChecked = true;
        this.catagory[7].input = "ALL";
      }
      else{
        this.clientFiltered[0].isChecked = false;
        this.catagory[7].input="";
        this.clientFiltered.filter(x=>x.ClientName!="ALL").forEach(x=>{
          if(x.isChecked){
            this.catagory[7].input = this.catagory[7].input + x.ClientName+ ",";
          }
          if(this.catagory[7].input.length>100){
            return;
          }
        });
        
      }
    }
  }

  selectComboCheck(_i,_p){
    this.catagory[_i].input = "";
    if(_p==0){
      //this.catagory[_i].default[_p]['isChecked'] = true;
      this.catagory[_i].input = "ALL";
      this.catagory[_i].default[_p]['isChecked'] = !this.catagory[_i].default[_p]['isChecked'];
      if(this.catagory[_i].default[_p]['isChecked']){
        for(let k=1; k<this.catagory[_i].default.length;k++){
          this.catagory[_i].default[k]['isChecked'] = true;
        }
      }
      else{
        for(let k=1; k<this.catagory[_i].default.length;k++){
          this.catagory[_i].default[k]['isChecked'] = false;
        }
      }
    }
    else{
      this.catagory[_i].default[_p]['isChecked'] = !this.catagory[_i].default[_p]['isChecked'];
    }
    let _isAllTrue = 0; // Check if all items checked
    for(let k=1; k<this.catagory[_i].default.length;k++){
      if(this.catagory[_i].default[k]['isChecked'] == true){
        this.catagory[_i].input += this.catagory[_i].default[k]['name'] + ",";
        _isAllTrue++;
      }
    }
    
    if(_isAllTrue==this.catagory[_i].default.length-1)  {
      this.catagory[_i].default[0]['isChecked'] = true;
      this.catagory[_i].input = "ALL";
    }
    else{
      this.catagory[_i].default[0]['isChecked'] = false;
    }
    if(this.catagory[_i].input != "ALL"){
      this.catagory[_i].input = this.catagory[_i].input.slice(0, -1); // remove xtra , at the end
    }
  }

  

  closeAllTitleDropdown(){
    for(let i=0; i<this.catagory.length;i++){
      this.catagory[i].isOpen = false;
      if(this.catagory[i].name == "Client"){
        this.catagory[7].input = "";
        this.clientFiltered.filter(x=>x.ClientName!="ALL").forEach(x=>{
          if(x.isChecked){
            this.catagory[i].input = this.catagory[i].input + x.ClientName + ",";
          }
          if(this.catagory[i].input.length>100){
            return;
          }
        });
        if(this.catagory[7].input=="" || this.clientFiltered.filter(x=>x.ClientName!="ALL").findIndex(y=>y.isChecked==false)<0){
          this.catagory[7].input = "ALL";
        }
      }
    }
  }
  filterTextOnChang(_irv :InputConReturn,_cata,_type){
    this.closeAllTitleDropdown();
    this.subs.dropdownOpen=true;
    console.log(_irv,_cata,_type,this.subs.filterArray);
    this.catagory[_cata].input = _irv.value.trim();
    this.catagory[_cata].isOpen = !this.catagory[_cata].isOpen;

    if(_type=='table' && _cata==6){
      
      this.locationSearchKey = (_irv.value!==undefined)?_irv.value.trim():"";
      if(this.locationSearchKey !=""){
        this.catagory[6].input = "";
        this.locationFiltered = [];
        this.LocationIdSelected = 0;
        this.getLocationList();
        //this.catagory[6].default = this.locationFiltered;
      }
      else if(this.catagory[6].input==""){
        this.getLocationList();
      }
      
    }
    
  }
 

  //add filter code here Martin Hu
  setDateValue(dateValue: DateTimePickerValue,_type) {
    this.requestDate = dateValue.SelectedDateValue;
    this.catagory[5].input = this.formatDate(dateValue.SelectedDateValue);
    this.catagory[5].isOpen = !this.catagory[5].isOpen;
    this.getRequestList();
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }
}
