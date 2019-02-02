import { Component, OnInit } from '@angular/core';
import { NgbModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { MainServiceService } from '../main-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  endpoint: string="http://localhost/services/"
  techarticleregistration: any = [];
  techeventsregistration: any = [];
  technologyconfig: any = [];
  subtechnologyconfig: any = [];
  techtalktypeconfig: any = [];
  techteachregistration: any = [];
  techtalkregistration: any = [];
  techarticledetails: any = [];
  stuvationdetails: any = [];
  techtalkdetails: any;
  techteachdetails: any;
  sliderContent: any = [];
  teamDetails: any;
  homePageContent: any;
  commentToBeAdded;
  commentOperation;
  constructor(private modal: NgbModal, private http: HttpClient, private mainService: MainServiceService, private router: Router) { }

  ngOnInit() {
    let userDetails = this.getLoggedInUserObject();
    console.log(this.getLoggedInUserObject());
    console.log(userDetails!=null && userDetails['usertype']=='admin');
    if(userDetails!=null && userDetails['usertype']=='admin')
      this.getPageContent();
    else
      this.router.navigate(['/home']);
  }

  getPageContent() {
    this.http.get(this.endpoint + 'getAdminPageContent.php' + "/random=" + new Date().getTime()).subscribe(data => {
      console.log(data);
      this.sliderContent = data['0'].sliderContent;
      this.teamDetails = data['1'].teamDetails;
      this.homePageContent = data['3'].homePageData;
      this.techarticledetails = data['2'].techarticledetails;
      this.techtalkdetails = data['4'].techtalkdetails;
      this.techteachdetails = data['5'].techteachdetails;
      this.technologyconfig = data['6'].technologyconfig;
      this.subtechnologyconfig = data['7'].subtechnologyconfig;
      this.techtalktypeconfig = data['8'].techtalktypeconfig;
      this.techarticleregistration = data['9'].techarticleregistration;
      this.techteachregistration = data['10'].techteachregistration;
      this.techtalkregistration = data['11'].techtalkregistration;
      this.stuvationdetails = data['12'].stuvationdetails;
      console.log(this.technologyconfig);
      console.log(this.subtechnologyconfig);
      console.log(this.techtalktypeconfig);
      console.log(this.techarticleregistration);
      console.log(this.techeventsregistration);
    });
  }

  techArticleFilter="";
  keywordFilter="";
  techFilter="";
  subTechFilter="";
  articleTypeFilter="";
  freeFilter="";
  authorFilter="";
  selectedTecharticle;
  updateStatusOperation(id, approvalStatus, authcode, updateSection) {
    let userDetails = this.getLoggedInUserObject();
    let url;
    if (updateSection == 'techarticle') {
      url = this.endpoint + "updateArticleStatus.php?articleId=" + id + "&approvalStatus=approved&authCode=" + authcode;
    } else if (updateSection == 'techteach') {
      url = this.endpoint + "updateTechTeachStatus.php?techteachId=" + id + "&approvalStatus=approved&authCode=" + authcode;
    } else if (updateSection == 'techtalk') {
      url = this.endpoint + "updateTechTalkStatus.php?techtalkId=" + id + "&approvalStatus=approved&authCode=" + authcode;
    } else if (updateSection == 'stuvation') {
      url = this.endpoint + "updateStuvationStatus.php?stuvationId=" + id + "&approvalStatus=approved&authCode=" + authcode;
    }
    this.http.post(url, "", { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/articleUpDownCount.php', requestObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['verificationStatus'] == 'verified') {
        this.getPageContent();
        if (approvalStatus == 'approved')
          alert('Approved Successfully');
        else if (approvalStatus == 'declined')
          alert('Declined Successfully');
      } else if (parsedData['verificationStatus'] == 'unverified') {
        alert('Failed to approve');
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

}
