import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { MainServiceService } from '../main-service.service';

import { FilterPipe } from 'ngx-filter-pipe';
import { Http } from '@angular/http';

@Component({
  selector: 'app-stuvation',
  templateUrl: './stuvation.component.html',
  styleUrls: ['./stuvation.component.css']
})
export class StuvationComponent implements OnInit {
  // endpoint: string = "../assets/services/"
  // endpoint: string = "../assets/services/"
  endpoint: string = "../assets/services/"


  // endpoint: string = "../assets/services/"
  selectedStuvation: any;
  constructor(private modal: NgbModal, private http: HttpClient, private httpnew: Http,
    private mainService: MainServiceService, private filterPipe: FilterPipe) { }
  sliderContent: any = [];
  //homePageDataFromService=[];
  homePageContent: any = [];
  teamDetails: any = [];
  stuvationdetails: any = [];
  userId;
  Baseurl = "http://engfactory.accrosian.com/";
  ngOnInit(): void {
    //this.http.get('../assets/services/getHomePageContent.php'+"/random="+new Date().getTime()).subscribe(data => {
    let url = this.endpoint + 'getHomePageContent.php' + "/random=" + new Date().getTime();
    let userDetails = this.getLoggedInUserObject();
    if (!this.checkLoginStatus())
      url += "?userid=" + userDetails['userid'];
    this.userId = userDetails['userid'];
    this.http.get(url).subscribe(data => {
      console.log(data);
      this.sliderContent = data['0'].sliderContent;
      this.teamDetails = data['1'].teamDetails;
      this.stuvationdetails = data['10'].stuvationdetails;
      this.homePageContent = data['3'].homePageData;
      console.log(this.sliderContent);
      console.log(this.homePageContent);
      console.log(this.teamDetails);
      console.log(this.stuvationdetails);
    });
    this.getstuationData();
  }

  ResponseData = [];
  getstuationData() {
    let userDetails = this.getLoggedInUserObject();
    this.httpnew.get(this.Baseurl + 'stuvation_list' + '?user_id=' + userDetails['user_id']).subscribe(response => {
      this.ResponseData = response.json().data;
      console.log(this.ResponseData);
    });
  }




  stuvationFilter: any = { projectType: '', projectTitle: '', technologyname: '', subtechname: '' };

  keywordFilter = "";
  techFilter = "";
  subTechFilter = "";
  articleTypeFilter = "";
  freeFilter = "";
  authorFilter = "";
  showJoinTeamPopup(stuvation) {
    this.selectedStuvation = stuvation;
    console.log(this.selectedStuvation);
  }

  stuvationUpDownCountUpdate(stuvationid, updateType) {
    let userDetails = this.getLoggedInUserObject();
    let requestObject = {
      "stuvationid": stuvationid,
      "updateType": updateType,
      "userid": userDetails['userid']
    };

    this.http.post(this.endpoint + 'stuvationUpDownCount.php', requestObject, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/articleUpDownCount.php', requestObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['stuvationUpDownCountQuery'] == 'done') {
        this.ngOnInit();
      } else if (parsedData['stuvationUpDownCountQuery'] == 'failed') {
        alert('Failed to update');
      }

    });
  }

  followerUpdate(userId, operationType) {
    let userDetails = this.getLoggedInUserObject();
    console.log(userDetails);
    let requestObject = {
      "followerId": userDetails['userid'],
      "operationType": operationType,
      "userid": userId
    };

    this.http.post(this.endpoint + 'addFollower.php', requestObject, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/articleUpDownCount.php', requestObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['followerUpdateQuery'] == 'done') {
        this.ngOnInit();
      } else if (parsedData['followerUpdateQuery'] == 'failed') {
        alert('Failed to update');
      }

    });
  }

  stuvationcomments = [];
  showStuvationComments(stuvation) {
    console.log(stuvation);
    this.selectedStuvation = stuvation;
    let requestObject = {
      "stuvationid": stuvation.stuvationid
    };
    console.log(requestObject);

    this.http.post(this.endpoint + 'getStuvationComments.php', requestObject, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/articleUpDownCount.php', requestObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      this.stuvationcomments = parsedData['stuvationcomments'];

    });
  }

  joinTeamOperation(projectid, rolename, comment): void {
    let userDetails = this.getLoggedInUserObject();
    //console.log(userDetails['userid']);
    let registrationObject: any = {
      "projectid": projectid,
      "rolename": rolename,
      "registereduserid": userDetails['userid'],
      "comment": comment
    };
    this.http.post(this.endpoint + 'joinTeamOperation.php', registrationObject, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/applyForTechEvents.php', registrationObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['techEventRegistrationQuery'] == 'done') {
        alert('Joined Successfully');
        this.ngOnInit();
      } else if (parsedData['techEventRegistrationQuery'] == 'failed') {
        alert('Failed to Join');
      } else if (parsedData['alreadyRegistered'] == 'true') {
        alert('Already Joined');
      }

    });
  }

  commentToBeAdded = "";
  commentOperation(stuvationid, commentid, stuvationcomment, operationType) {
    let userDetails = this.getLoggedInUserObject();
    let requestObject = {
      "stuvationid": stuvationid,
      "stuvationcomment": stuvationcomment,
      "userid": userDetails['userid'],
      "operationType": operationType,
      "commentid": commentid
    };

    this.http.post(this.endpoint + 'stuvationcommentsUpdateDeleteAdd.php', requestObject, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/articleUpDownCount.php', requestObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['commentUpdateDeleteAddQuery'] == 'done') {
        this.showStuvationComments(this.selectedStuvation);
        if (operationType == 'U')
          alert('Comment updated Successfully');
        this.commentToBeAdded = "";
        this.selectedStuvation.editClicked = 'N';
      } else if (parsedData['commentUpdateDeleteAddQuery'] == 'failed') {
        alert('Failed to update');
      }

    });
  }

  stuvationConnectOperation(projectid, comment): void {
    let userDetails = this.getLoggedInUserObject();
    //console.log(userDetails['userid']);
    let registrationObject: any = {
      "projectid": projectid,
      "registereduserid": userDetails['userid'],
      "comment": comment
    };
    this.http.post(this.endpoint + 'stuvationConnectOperation.php', registrationObject, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/applyForTechEvents.php', registrationObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['stuvationConnectOperation'] == 'done') {
        alert('Sent Successfully. Creator will contact you.');
        this.ngOnInit();
      } else if (parsedData['stuvationConnectOperation'] == 'failed') {
        alert('Failed to Join');
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
  joinAsRadio1 = false;
  joinAsRadio2 = false;
  joinTeam() {
    this.joinAsRadio1 = true;
    this.joinAsRadio2 = false;
  }

  joinTeam1() {
    this.joinAsRadio2 = true;
    this.joinAsRadio1 = false;
  }
}
