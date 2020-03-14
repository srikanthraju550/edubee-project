import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { MainServiceService } from '../main-service.service';
import { FilterPipe } from 'ngx-filter-pipe';
import { Http, Headers } from '@angular/http';
import { AppComponent } from '../app.component';
import { Validators, FormBuilder, FormArray, ValidationErrors, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stuvation',
  templateUrl: './stuvation.component.html',
  styleUrls: ['./stuvation.component.css']
})
export class StuvationComponent implements OnInit {
  // endpoint: string = "../assets/services/"
  // endpoint: string = "../assets/services/"
  endpoint: string = "../assets/services/";
  // endpoint: string = "../assets/services/"
  selectedStuvation: any;
  constructor(private modal: NgbModal, private http: HttpClient, private httpnew: Http,
    private mainService: MainServiceService, private filterPipe: FilterPipe, public app: AppComponent, private fb: FormBuilder) { }
  sliderContent: any = [];
  //homePageDataFromService=[];
  homePageContent: any = [];
  teamDetails: any = [];
  stuvationdetails: any = [];
  userId;
  Baseurl = "http://theengineersfactory.com/dashboard/";
  stuvationFilter: any = { title: '', technology: '', sub_technology: '', project_type: '' };

  ngOnInit(): void {
    //this.http.get('../assets/services/getHomePageContent.php'+"/random="+new Date().getTime()).subscribe(data => {
    let url = this.endpoint + 'getHomePageContent.php' + "/random=" + new Date().getTime();
    let userDetails = this.getLoggedInUserObject();
    if (!this.checkLoginStatus())
      url += "?userid=" + userDetails['userid'];
    this.userId = userDetails['userid'];
    this.http.get(url).subscribe(data => {
      this.sliderContent = data['0'].sliderContent;
      this.teamDetails = data['1'].teamDetails;
      this.stuvationdetails = data['10'].stuvationdetails;
      this.homePageContent = data['3'].homePageData;

    });
    this.getstuationData();
  }

  clearDataProz() {
    this.app.createProjtecStuvationForm = this.fb.group({
      projectType: ['', Validators.required],
      projectStatus: ['', Validators.required],
      title: ['', Validators.required],
      abstract: ['', Validators.required],
      sub_technology_id: [''],
      technology_id: ['', Validators.required],
      idea: [''],
      ideaDescription: [''],
      prototypeAvailable: ['Yes'],
      referenceLink: [''],
      expectedBudget: [''],
      lookingProfessorGuidance: ['Yes'],
      lookingMentorship: ['Yes'],
      lookingStudentPartner: ['Yes'],
      lookingSponsorship: ['Yes'],
      teamSize: [''],
      lastDateOfJoining: ['1'],
      noOfSponsors: [''],
      file: [''],
    });
  }

  clearInProz() {
    this.app.createStuvationForm = this.fb.group({
      projectType: ['', Validators.required],
      projectStatus: ['', Validators.required],
      title: ['', Validators.required],
      // abstract: ['', Validators.required],
      sub_technology_id: [''],
      technology_id: ['', Validators.required],
      idea: ['', Validators.required],
      ideaDescription: ['', Validators.required],
      prototypeAvailable: ['Yes'],
      referenceLink: [''],
      expectedBudget: [''],
      lookingProfessorGuidance: ['Yes'],
      lookingMentorship: ['Yes'],
      lookingStudentPartner: ['Yes'],
      lookingSponsorship: ['Yes'],
      teamSize: [''],
      lastDateOfJoining: ['1'],
      noOfSponsors: [''],
      file: ['']
    });
  }
  ResponseData = [];
  image_path;
  file_path;
  action: number;
  liked: boolean;
  getstuationData() {
    let userDetails = this.getLoggedInUserObject();
    this.httpnew.get(this.Baseurl + 'stuvation-list' + '?user_id=' + userDetails['user_id']).subscribe(response => {
      this.ResponseData = response.json().data.reverse();
      this.image_path = response.json().image_path;
      this.file_path = response.json().file_path;
    });
  }

  likeStuation(stuationId, operationType, user_id) {
    let userDetails = this.getLoggedInUserObject();
    if (parseInt(operationType) > 0 && (user_id === userDetails['user_id'])) {
      this.action = 2;
    } else if (this.liked === true) {
      this.action = 2;
    } else {
      this.action = 1;
    }
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    var params = 'user_id=' + userDetails['user_id'] + '&stuvation_id=' + stuationId + '&action=' + this.action
    this.httpnew.post(this.Baseurl + 'like-stuvation', params, { headers: headers }).subscribe(res => {

      if (this.action === 1) {
        this.liked = true;
      } else {
        this.liked = false;
      }
      if (res.json().status === true) {

        this.ngOnInit();
      } else {
        alert(res.json().message.error);
      }
    }, (err) => {
      alert(err.json().message.error);
    })
  }

  followerUpdate(stuationId, userId, operationType) {
    let userDetails = this.getLoggedInUserObject();

    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    var params = 'user_id=' + userDetails['user_id'] + '&followed_user_id=' + userId + '&action=' + operationType + '&stuvation_id=' + stuationId
    this.httpnew.post(this.Baseurl + 'follow-stuvation', params, { headers: headers }).subscribe(res => {
      if (res.json().status === true) {

        this.ngOnInit();
      } else {
        alert(res.json().message.error);
      }
    }, (err) => {
      alert(err.json().message.error);
    })
  }


  stuationId;
  comment;
  showInput: boolean;
  userid;
  showstuvationComments(stuation) {
    this.showInput = false;
    this.comment = '';
    this.stuationId = stuation.stuvation_id;
    this.stuvationcomments = [];
    let userDetails = this.getLoggedInUserObject();
    this.userid = userDetails['name'].toString();

    this.httpnew.get(this.Baseurl + 'stuvation-comments-list' + '?stuvation_id=' + this.stuationId).subscribe(data => {
      this.stuvationcomments = data.json().data;
      for (var i = 0; i < this.stuvationcomments.length; i++) {
        if (this.userid === this.stuvationcomments[i].user_id) {
          this.stuvationcomments[i].showEdit = true;
        } else {
          this.stuvationcomments[i].showEdit = false;
        }
      }
      console.log(this.stuvationcomments);
    });
  }

  commentsEdit() {
    this.showInput = true;
  }
  commentToBeAdded = "";
  commentOperation() {
    let userDetails = this.getLoggedInUserObject();
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    var params = 'user_id=' + userDetails['user_id'] + '&stuvation_id=' + this.stuationId + '&comment=' + this.comment
    this.httpnew.post(this.Baseurl + 'stuvation-comment', params, { headers: headers }).subscribe(res => {
      if (res.json().status === true) {
        // alert('comment added successfully');
        document.getElementById("closeCommentsModal").click();
        this.getstuationData();
      } else {
        alert(res.json().message.error);
      }
    }, (err) => {
      alert(err.json().message.error);
    })
  }
  commentsEditDelete(data, action) {
    let userDetails = this.getLoggedInUserObject();
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    if (action === 'edit') {
      var params = 'user_id=' + userDetails['user_id'] + '&comment_id=' + data.comment_id + '&comment=' + data.comment
      this.httpnew.post(this.Baseurl + 'update-stuvation-comment', params, { headers: headers }).subscribe(res => {
        if (res.json().status === true) {
          // alert(res.json().message);
          document.getElementById("closeCommentsModal").click();
        } else {
          alert(res.json().message.error);
        }
      }, (err) => {
        alert(err.json().message.error);
      })
    } else if (action === 'delete') {
      var params = 'user_id=' + userDetails['user_id'] + '&comment_id=' + data.comment_id
      this.httpnew.post(this.Baseurl + 'delete-stuvation-comment', params, { headers: headers }).subscribe(res => {
        if (res.json().status === true) {
          // alert(res.json().message);
          document.getElementById("closeCommentsModal").click();
        } else {
          alert(res.json().message.error);
        }
      }, (err) => {
        alert(err.json().message.error);
      })
    }
  }

  keywordFilter = "";
  techFilter = "";
  subTechFilter = "";
  articleTypeFilter = "";
  freeFilter = "";
  authorFilter = "";
  stuvationConnectModel;
  joinTeamAsConnectModel;
  showJoinTeamPopup(stuvation) {
    this.selectedStuvation = stuvation;
    this.stuvationConnectModel = '';
    this.joinTeamAsConnectModel = '';
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

    }, (err) => {
      alert(err.json().message.error);
    });
  }



  stuvationcomments = [];

  joinTeamOperation(projectid, rolename, comment): void {

    let userDetails = this.getLoggedInUserObject();
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    var params = 'user_id=' + userDetails['user_id'] + '&stuvation_id=' + projectid + '&role=' + rolename + '&description=' + comment
    this.httpnew.post(this.Baseurl + 'join-team', params, { headers: headers }).subscribe(res => {
      if (res.json().status === true) {
        // alert(res.json().message);
        document.getElementById("closeJoinTeamPopupModal").click();
        this.getstuationData();
      } else {
        alert(res.json().message.error);
      }
    }, (err) => {
      alert(err.json().message.error);
    })
  }

  // commentToBeAdded = "";
  // commentOperation(stuvationid, commentid, stuvationcomment, operationType) {
  //   let userDetails = this.getLoggedInUserObject();
  //   let requestObject = {
  //     "stuvationid": stuvationid,
  //     "stuvationcomment": stuvationcomment,
  //     "userid": userDetails['userid'],
  //     "operationType": operationType,
  //     "commentid": commentid
  //   };

  //   this.http.post(this.endpoint + 'stuvationcommentsUpdateDeleteAdd.php', requestObject, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
  //     //this.http.post('http://localhost:8080/edubee/articleUpDownCount.php', requestObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
  //     console.log(data);
  //     let parsedData: JSON = JSON.parse('' + data);
  //     console.log(parsedData);
  //     if (parsedData['commentUpdateDeleteAddQuery'] == 'done') {
  //       this.showStuvationComments(this.selectedStuvation);
  //       if (operationType == 'U')
  //         alert('Comment updated Successfully');
  //       this.commentToBeAdded = "";
  //       this.selectedStuvation.editClicked = 'N';
  //     } else if (parsedData['commentUpdateDeleteAddQuery'] == 'failed') {
  //       alert('Failed to update');
  //     }

  //   });
  // }

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
        // alert('Sent Successfully. Creator will contact you.');
        this.ngOnInit();
      } else if (parsedData['stuvationConnectOperation'] == 'failed') {
        alert('Failed to Join');
      }

    }, (err) => {
      alert(err.json().message.error);
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
    this.stuvationFilter.project_type = '';
    this.stuvationFilter.technology = '';
    this.stuvationFilter.sub_technology = '';
    this.showKeyword = true;
    this.showArticle = false;
    this.showTechnology = false;
    this.showSubTech = false;
    this.showAuthor = false;
    this.showCost = false;
  }

  selectType() {
    this.stuvationFilter.technology = '';
    this.stuvationFilter.title = '';
    this.stuvationFilter.sub_technology = '';
    this.showKeyword = false;
    this.showArticle = true;
    this.showTechnology = false;
    this.showSubTech = false;
    this.showAuthor = false;
    this.showCost = false;
  }

  selectTechnology() {
    this.stuvationFilter.title = '';
    this.stuvationFilter.project_type = '';
    this.stuvationFilter.sub_technology = '';
    this.showKeyword = false;
    this.showArticle = false;
    this.showTechnology = true;
    this.showSubTech = false;
    this.showAuthor = false;
    this.showCost = false;
    this.getTechnologyList();
  }
  selectSubTechnology() {
    this.stuvationFilter.technology = '';
    this.stuvationFilter.project_type = '';
    this.stuvationFilter.title = '';
    this.showKeyword = false;
    this.showArticle = false;
    this.showTechnology = false
    this.showSubTech = true;
    this.showAuthor = false;
    this.showCost = false;
    this.getSubTechList();
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

  subtechnologylist: any = [];
  technologyList = [];

  getSubTechList() {
    this.httpnew.get(this.Baseurl + 'sub-technology-list').subscribe(res => {
      this.subtechnologylist = res.json().data;
    })
  }

  getTechnologyList() {
    this.httpnew.get(this.Baseurl + 'technology-list').subscribe(res => {
      this.technologyList = res.json().data;
    })
  }

  showProfileData() {

  }

}
