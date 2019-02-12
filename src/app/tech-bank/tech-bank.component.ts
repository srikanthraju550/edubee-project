import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { MainServiceService } from '../main-service.service';
import { FilterPipe } from '../filter.pipe';

@Component({
  selector: 'app-tech-bank',
  templateUrl: './tech-bank.component.html',
  styleUrls: ['./tech-bank.component.css']
})
export class TechBankComponent implements OnInit {
  endpoint: string = "http://localhost/services/";
  // endpoint: string = "http://www.theengineersfactory.com/assets/services/";
  constructor(private modal: NgbModal, private http: HttpClient, private mainService: MainServiceService) { }
  sliderContent: any = [];
  //homePageDataFromService=[];
  homePageContent: any = [];
  teamDetails: any = [];
  techtalkdetails: any = [];
  techteachdetails: any = [];
  techteachLength: any = 0;
  selectedModel: string;
  selectedTechTeach: JSON;
  selectedTechTalk: JSON;
  techTalkFilter = "";
  keywordFilter = "";
  techFilter = "";
  subTechFilter = "";
  techEventFilter: any = { articletitle: '', name: '', technologyname: '', subtechname: '', cost: 0 };


  ngOnInit(): void {
    this.http.get(this.endpoint + 'getHomePageContent.php' + "/random=" + new Date().getTime()).subscribe(data => {
      //this.http.get('http://localhost:8080/edubee/getHomePageContent.php'+"/random="+new Date().getTime()).subscribe(data => {
      this.sliderContent = data['0'].sliderContent;
      this.teamDetails = data['1'].teamDetails;
      this.homePageContent = data['3'].homePageData;
      this.techtalkdetails = data['4'].techtalkdetails;
      this.techteachdetails = data['5'].techteachdetails;
      this.techteachLength = this.techtalkdetails.length;
      console.log(this.techtalkdetails);

    });
  }


  viewTechTeachDetails(techTeach): void {
    console.dir(techTeach);
    this.selectedModel = 'techTeach';
    this.selectedTechTeach = techTeach;
  }

  viewTechTalkDetails(techTalk): void {
    console.dir(techTalk);
    this.selectedModel = 'techTalk';
    this.selectedTechTalk = techTalk;
  }

  applyForEventTechTeach(techTeach): void {
    let userDetails = this.getLoggedInUserObject();
    //console.log(userDetails['userid']);
    let registrationObject: any = {
      "eventid": techTeach.techteachid,
      "eventtype": 'techTeach',
      "registereduserid": userDetails['userid']
    };
    this.http.post(this.endpoint + 'applyForTechEvents.php', registrationObject, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/applyForTechEvents.php', registrationObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['techEventRegistrationQuery'] == 'done') {
        alert('Registered Successfully for the Event');
        this.ngOnInit();
      } else if (parsedData['techEventRegistrationQuery'] == 'failed') {
        alert('Registration Failed for the Event');
      } else if (parsedData['alreadyRegistered'] == 'true') {
        alert('Already Registered for the Event');
      }

    });
  }

  applyForEventTechTalk(techTalk): void {
    let userDetails = this.getLoggedInUserObject();
    //console.log(userDetails['userid']);
    let registrationObject: any = {
      "eventid": techTalk.techtalkid,
      "eventtype": 'techTalk',
      "registereduserid": userDetails['userid']
    };
    this.http.post(this.endpoint + 'applyForTechEvents.php', registrationObject, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/applyForTechEvents.php', registrationObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['techEventRegistrationQuery'] == 'done') {
        alert('Registered Successfully for the Event');
        this.ngOnInit();
      } else if (parsedData['techEventRegistrationQuery'] == 'failed') {
        alert('Registration Failed for the Event');
      } else if (parsedData['alreadyRegistered'] == 'true') {
        alert('Already Registered for the Event');
      }

    });
  }

  checkLoginStatus(): boolean {
    return this.mainService.checkLoginStatus();
  }

  getLoggedInUserObject(): JSON {
    return this.mainService.getLoggedInUserObject();
  }

  logout(): void {
    this.mainService.logout();
  }

  showKeyword = true;
  showArticle = false;
  showTechnology = false;
  showSubTech = false;
  showAuthor = false;
  showCost = false;

  selectKeyword() {
    this.showKeyword = true;
    this.showArticle = false;
    this.showTechnology = false;
    this.showSubTech = false;
    this.showAuthor = false;
    this.showCost = false;
  }

  selectType() {
    this.showKeyword = false;
    this.showArticle = true;
    this.showTechnology = false;
    this.showSubTech = false;
    this.showAuthor = false;
    this.showCost = false;
  }

  selectTechnology() {
    this.showKeyword = false;
    this.showArticle = false;
    this.showTechnology = true;
    this.showSubTech = false;
    this.showAuthor = false;
    this.showCost = false;
  }
  selectSubTechnology() {
    this.showKeyword = false;
    this.showArticle = false;
    this.showTechnology = false
    this.showSubTech = true;
    this.showAuthor = false;
    this.showCost = false;
  }

  selectAuthor() {
    this.showKeyword = false;
    this.showArticle = false;
    this.showTechnology = false
    this.showSubTech = false;
    this.showAuthor = true;
    this.showCost = false;
  }
  selectFree() {
    this.showKeyword = false;
    this.showArticle = false;
    this.showTechnology = false
    this.showSubTech = false;
    this.showAuthor = false;
    this.showCost = true;
  }


}
