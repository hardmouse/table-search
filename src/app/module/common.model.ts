export class InputConReturn {
  name: string;
  value: string;
  isBlur : boolean;
}
export class RequestReturn {
  name: string = "";
  isCheck: boolean = false;
  detail: any = [];
}

export class DateTimePickerValue {
  Field: string;
  SelectedDateValue: Date;
}

export class SRtoWorkOrderConfig {
  
  static readonly RealSuiteVersion = "VERSIONXX";
  static readonly MinLengthPhoneNumberWithoutCountryCode = 10;
  static readonly ServerTimeZoneOffset = -5;
  static readonly ServerTimeZone = "-0500";
  static readonly LegacyRealHelpModule = "REALHELP";
  static readonly LegacyRealHelpWorkOrderManagementApp = "RHLP_WORKORDERMGMT";
  static readonly LegacyFlexWorkOrderObjectName = "FLEX_RHLP_WORKORDER";
}

export class GloballFilter{
  PageNumber: number;
  PageSize : number;
  Clients :string="";
  SearchQueryData:string="";
}


export class ApprovalPortalFilter{
  PageNumber: number;
  PageSize : number;
  Clients :string="";
  //Status:string="";
  OldValue:string="";
  NewValue:string="";
  BuildingItemNumber:string="";
  ReasonRejection:string="";
  RequestDate:string="";
  Location:string="";
  Comments:string="";
  Approver:string="";
  ListStatus:string="";
}

export class EquipmentChangeSearchResults{
  TotalCount:number;
  SearchResults:EquipmentChangeSearchResult[];
}

export class EquipmentChangeSearchResult{
  RequestId:number;
  EquipmentId:number;
  ClientId:number;
  RequestSource:string="";
  InitialApproversList:string="";
  CurrentApproversList:string="";
  BuildingItemNo:string="";
  RequestDate:Date;
  Location:string="";
  LocationID:number;
  Approver:string="";
 
  
  EquipmentEntityChanges:EquipmentEntityChange[];
  isChecked:boolean
  updated:EquipmentEntityChange[];
  isOpen:boolean;
  noChildApprovable:boolean;
}

export class EquipmentEntityChange{
  ChangeId:number;
  RequestId:number;
  ClientId:number;
  OldValue:string="";
  NewValue:string="";
  Status:string="";
  ChangeRequestNotes:string="";
  ApprovedBy:string="";
  RejectedBy:string="";
  InitialApproversList:string="";
  CurrentApproversList:string="";
  Comments:string="";
  showReasonSearchDialog:boolean;
  isCheckedDetail:boolean;
  reason:any;
  EntityField:string="";
  CanBeApproved:boolean;
}

export class PhyLocation{
  ClientId:number;
  LocationId:number;
  PhysicalLocationName:string="";
  Address:string="";
  City:string="";
  Province:string="";
  PostalCode:string="";
  SiteName:string="";
  ShortName:string="";
  LocationTypeName:string="";
}

export class ClientItem{
  ClientName:string="";
  ClientId:number;
  isChecked:boolean=false;
}

export class SelectedApprovalRequests{
  EquipmentEntityChangeIds:number[];
}