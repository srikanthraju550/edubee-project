import { Injectable } from '@angular/core';
import { HttpClient } from '../../node_modules/@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainServiceService {

  constructor(private http : HttpClient) { }

  checkLoginStatus(): boolean {
    //console.log(sessionStorage.getItem('loggedInUserName'));
    if (sessionStorage.getItem('loggedInUserName') != '')
      return false;
    else
      return true;
  }

  getLoggedInUserObject(): JSON {
    //console.log(sessionStorage.getItem('loggedInUserName'));
    if(sessionStorage.getItem("loggedInUserName")!=undefined && sessionStorage.getItem("loggedInUserName")!=""){
      //console.log(JSON.parse(sessionStorage.getItem("loggedInUserName")));
      return JSON.parse(sessionStorage.getItem("loggedInUserName"));
    }else{
      sessionStorage.setItem("loggedInUserName", "");
      return JSON.parse("{}");
    }
      
  }

  logout(): void {
    sessionStorage.setItem("loggedInUserName", "");
  }

  getCommonDataForAll() : any{
    
    let responseData:any;
    this.http.get('../assets/services/getHomePageContent.php'+"/random="+new Date().getTime()).subscribe(data => {
     //this.http.get('http://localhost:8080/edubee/getHomePageContent.php'+"/random="+new Date().getTime()).subscribe(data => {
      console.log(data);
      responseData = {
        "sliderContent" : data['0'].sliderContent,
        "teamDetails" : data['1'].teamDetails,
        "techarticledetails" : data['2'].techarticledetails,
        "homePageContent" : data['3'].homePageData,
        "techtalkdetails" : data['4'].techtalkdetails,
        "techteachdetails" : data['5'].techteachdetails
      };
      return responseData;
    });
    
  }
}
