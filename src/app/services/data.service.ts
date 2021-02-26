import { Injectable } from '@angular/core';
import { Observable,timer,throwError,forkJoin  } from 'rxjs';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { WebApi } from '../modules/core/classes/webApi';
// import { WebServiceType } from '../modules/core/classes/webServiceType';
import {
  map,
  mergeMap,
  catchError,
  tap
} from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SubscribableService } from '../services/subscribable.service';

const mockurl = "./assets/mockdata/approval-list2.json";

@Injectable()
export class DataService {

  constructor(
    private http: HttpClient,
    public subs:SubscribableService
  ) { }

  getData(url) {
    return this.http.get(url);
  }

  getRequestListData(keys:any=[]) {
    console.warn(keys);
    return this.http.get(mockurl+'?keys='+keys);
  }

  get(url): Observable<any> {
    url = this.getUrl(url);
    return this.http.get(url).pipe(map((response: Response) => {

      return response;
    }), catchError(err => {

      const errMsg = 'Error while calling API (get): ' + url + ', error detail: ' + JSON.stringify(err); // add request
      console.log(err);

      if (err instanceof HttpErrorResponse) {


        }
        return throwError(err);
      }));

  }

  post(url, body, apiName, times = 1, enforceAuthToken = false): Observable<any> {


    const toMock = this.useMockData(url);
    const originalUrl: string = url;
    url = this.getUrl(url);
    if (toMock) { // get mock data from the folder 'asset/mockData'
      return this.http.get(url).pipe(map((response: Response) => {

        return response;
      }), catchError(err => {
        return this.handlePostException(err, apiName, url,  body, times);
      }));
    } else {

        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
         return this.http.post(url, body.toString(), {headers:headers}).pipe(map((response: Response) => {

            return response;
        }), catchError((err) => {

        return this.handlePostException(err, apiName, url,  body, times);
      }));
    }
  }

  private getUrl(url) {

    const lang = "en";
    if (url.toLowerCase().indexOf('http://') >= 0 || url.toLowerCase().indexOf('.json') >= 0 || url.toLowerCase().indexOf('.html') >= 0) {
      return environment.rootFolder + url;
    } else {
      if (this.useMockData(url)) {
        if (url.indexOf('?') > 0) {
          url = url.substring(0, url.indexOf('?'));
        }
        url = environment.rootFolder + 'assets/mockData/' + url.substring(0, url.length - 1) + '.html';
      } else {

        url = environment.apiEndpoints["realConditionWebAPI"]  + this.subs.clientSelected + '/api/'  + url;
      }
    }
    return url;
  }




  useMockData(url) {
    //let key = url.replace('/', '_');
    let key = url.replace(/\//g, '_').replace(/-/g, '_');
    const pQuestionMark = key.indexOf('?');
    if (pQuestionMark > 0) {
      key = key.substring(0, pQuestionMark);
    }
    let retVaue = false;

    if (environment.useMockData.all) {
      retVaue = environment.useMockData.all;
    }
    return retVaue;
  }




  handlePostException(err, apiName, url, payload, times) {
    const self = this;
    const errMsg = 'time ' + times.toString() +  ', Error while calling API (post): ' + url + ', error detail: ' + JSON.stringify(err) + '. Request: ' + JSON.stringify(payload);

    if (err instanceof HttpErrorResponse) {
      if (err.status === 500) {
        if (times < 3) {
          return timer(200).pipe(mergeMap(() => {  // wait for 0.2 second then call again.
            return self.post(url, payload, apiName, times + 1);
          }));
        } else {
          //this.router.navigate(['/exception']); // if get 500 error for 3 times, redirect to login page.
        }
      } else if (err.status === 401) { // if 401 error, it might be time-out, redirect to login page.
        //this.router.navigate(['/exception']);
      } else {

      }
    }

    return throwError(err);
  }


  post1(url, body, apiName, times = 1): Observable<any> {

    const toMock = this.useMockData(url);

    const originalUrl: string = url;
    //url = this.getUrl(url);
    if (toMock) { // get mock data from the folder 'asset/mockData'
        return this.http.get(url).pipe(map((response: Response) => {

            return response;
        }), catchError(err => {
            return this.handlePostException(err, apiName, url, originalUrl, body);
        }));
    } else {



        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        //headers = headers.append('Authorization', 'Bearer {bc4a39fd-9c92-4eb9-9ada-1de93937b39b}');
        url = "http://localhost/approvalPortal/api/"+url+"?sessionid={A40D5DE2-3EEA-4387-A4CA-3C72A2B40041}"
        return this.http.post(url, body.toString(), { headers: headers }).pipe(map((response: Response) => {

            return response;
        }), catchError(err => {
            if (err instanceof HttpErrorResponse) {
                console.log(err);
            }
            return this.handlePostException(err, apiName, url, originalUrl, body);
        }));
    }
}


  post2(url, body, apiName, times = 1): Observable<any> {

      const toMock = this.useMockData(url);

      const originalUrl: string = url;
      url = this.getUrl(url);
      if (toMock) { // get mock data from the folder 'asset/mockData'
          return this.http.get(url).pipe(map((response: Response) => {

              return response;
          }), catchError(err => {
              return this.handlePostException(err, apiName, url, originalUrl, body);
          }));
      } else {



          let headers = new HttpHeaders();
          headers = headers.append('Content-Type', 'application/json');
          //headers = headers.append('Authorization', 'Bearer {bc4a39fd-9c92-4eb9-9ada-1de93937b39b}');
          url = "http://localhost/approvalPortal/"+this.subs.clientSelected+"/api/"+url+"?sessionid={ED229685-0C90-43CF-8254-0055B25DDCA9}"
          return this.http.post(url, body.toString(), { headers: headers }).pipe(map((response: Response) => {

              return response;
          }), catchError(err => {
              if (err instanceof HttpErrorResponse) {
                  console.log(err);
              }
              return this.handlePostException(err, apiName, url, originalUrl, body);
          }));
      }
  }

  post4(url, body, apiName, times = 1): Observable<any> {

      const toMock = this.useMockData(url);

      const originalUrl: string = url;
      url = this.getUrl(url);
      if (toMock) { // get mock data from the folder 'asset/mockData'
          return this.http.get(url).pipe(map((response: Response) => {

              return response;
          }), catchError(err => {
              return this.handlePostException(err, apiName, url, originalUrl, body);
          }));
      } else {



          let headers = new HttpHeaders();
          headers = headers.append('Content-Type', 'application/json');
          //headers = headers.append('Authorization', 'Bearer {bc4a39fd-9c92-4eb9-9ada-1de93937b39b}');
          url = "http://localhost/approvalPortal/"+this.subs.clientSelected+"/api/equipmentchangerequests/getlocations?sessionid={ED229685-0C90-43CF-8254-0055B25DDCA9}"
          return this.http.post(url, body.toString(), { headers: headers }).pipe(map((response: Response) => {

              return response;
          }), catchError(err => {
              if (err instanceof HttpErrorResponse) {
                  console.log(err);
              }
              return this.handlePostException(err, apiName, url, originalUrl, body);
          }));
      }
  }

  post6(url, body, apiName, times = 1): Observable<any> {

      const toMock = this.useMockData(url);

      const originalUrl: string = url;
      url = this.getUrl(url);
      if (toMock) { // get mock data from the folder 'asset/mockData'
          return this.http.get(url).pipe(map((response: Response) => {

              return response;
          }), catchError(err => {
              return this.handlePostException(err, apiName, url, originalUrl, body);
          }));
      } else {



          let headers = new HttpHeaders();
          headers = headers.append('Content-Type', 'application/json');
          //headers = headers.append('Authorization', 'Bearer {bc4a39fd-9c92-4eb9-9ada-1de93937b39b}');
          url = "http://localhost/approvalPortal/"+this.subs.clientSelected+"/api/equipmentchangerequests/getclients?sessionid={ED229685-0C90-43CF-8254-0055B25DDCA9}"
          return this.http.post(url, body.toString(), { headers: headers }).pipe(map((response: Response) => {

              return response;
          }), catchError(err => {
              if (err instanceof HttpErrorResponse) {
                  console.log(err);
              }
              return this.handlePostException(err, apiName, url, originalUrl, body);
          }));
      }
  }


}
