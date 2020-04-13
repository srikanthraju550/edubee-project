
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { MainServiceService } from '../main-service.service';
@Component({
  selector: 'app-staticdata',
  templateUrl: './staticdata.component.html',
  styleUrls: ['./staticdata.component.css',
    '../tech-article/tech-article.component.css',
    '../tech-bank/tech-bank.component.css',
    '../stuvation/stuvation.component.css']
})
export class StaticdataComponent implements OnInit {
  file_path: string;
  action;
  Baseurl = "http://theengineersfactory.com/dashboard/";
  ResponseData = [];
  TechResponseData = [];
  TechtlkResponseData = [];
  showTechbank: boolean;
  showTechconnect: boolean;
  showstuation: boolean;
  getMyTechBankDataList = [];
  getMyTechConnctData = [];
  getMyTechTalktData = [];
  StuvResponseData = [];
  getMyStuvData = [];
  image_path;
  title;
  file_path1;
  constructor(private route: ActivatedRoute, private http: Http, private mainService: MainServiceService) {
    this.route.params.subscribe((params: Params) => {
      this.action = params['action'];
      if (this.action == 'myTechBank') {
        this.getMyTechBankData();
        this.showTechbank = true;
        this.showTechconnect = false;
        this.showstuation = false;
        this.title = "My Tech Bank";
      } else if (this.action == 'myTechConnect') {
        this.getMyTechConnectData();
        this.getMyTechtalkData();
        this.showTechbank = false;
        this.showTechconnect = true;
        this.showstuation = false;
        this.title = "My Tech Connect";
      } else if (this.action == 'myStuation') {
        this.getMyStuation();
        this.showTechbank = false;
        this.showTechconnect = false;
        this.showstuation = true;
        this.title = "My Stuation";
      }
    });

  }




  ngOnInit() {
  }


  getLoggedInUserObject(): JSON {
    return this.mainService.getLoggedInUserObject();
  }

  getMyTechBankData() {
    this.getMyTechBankDataList = [];
    var tbData = [];
    let userDetails = this.getLoggedInUserObject();
    this.http.get(this.Baseurl + 'tech-article-list' + '?user_id=' + userDetails['user_id']).subscribe(response => {
      this.ResponseData = response.json().data;
      for (var i = 0; i < this.ResponseData.length; i++) {
        if (this.ResponseData[i].user_id === userDetails['user_id']) {
          tbData.push(this.ResponseData[i]);
        }
      }
      this.getMyTechBankDataList = tbData.reverse();
      // console.log(this.getMyTechBankDataList);
      this.image_path = response.json().image_path;

      this.file_path = response.json().image_path;
      this.file_path1 = response.json().file_path;
    });
  }
  getMyTechConnectData() {
    this.getMyTechConnctData = [];
    var tteData = [];
    let userDetails = this.getLoggedInUserObject();
    this.http.get(this.Baseurl + 'tech-teach-list' + '?user_id=' + userDetails['user_id']).subscribe(response => {
      this.TechResponseData = response.json().data;
      for (var i = 0; i < this.TechResponseData.length; i++) {
        if (this.TechResponseData[i].user_id === userDetails['user_id']) {
          tteData.push(this.TechResponseData[i]);
        }
      }
      this.image_path = response.json().image_path;

      this.getMyTechConnctData = tteData.reverse();
      // console.log(this.getMyTechConnctData);
    });
  }
  getMyTechtalkData() {
    this.getMyTechTalktData = [];
    var ttDAta = [];
    let userDetails = this.getLoggedInUserObject();
    this.http.get(this.Baseurl + 'tech-talk-list' + '?user_id=' + userDetails['user_id']).subscribe(response => {
      this.TechtlkResponseData = response.json().data;
      for (var i = 0; i < this.TechtlkResponseData.length; i++) {
        if (this.TechtlkResponseData[i].user_id === userDetails['user_id']) {
          ttDAta.push(this.TechtlkResponseData[i]);
        }
      }
      this.image_path = response.json().image_path;

      this.getMyTechTalktData = ttDAta.reverse()
      // console.log(this.getMyTechTalktData);
    });
  }
  getMyStuation() {
    this.getMyStuvData = [];
    var sData = [];
    let userDetails = this.getLoggedInUserObject();

    this.http.get(this.Baseurl + 'stuvation-list' + '?user_id=' + userDetails['user_id']).subscribe(response => {
      this.StuvResponseData = response.json().data;
      for (var i = 0; i < this.StuvResponseData.length; i++) {
        if (this.StuvResponseData[i].user_id === userDetails['user_id']) {
          sData.push(this.StuvResponseData[i]);
        }
      }
      this.image_path = response.json().image_path;
      this.getMyStuvData = sData.reverse();
      console.log(this.getMyStuvData);
    });
  }

  checkLoginStatus(): boolean {
    return this.mainService.checkLoginStatus();
  }
  articletype;
  articletitle;
  emailaddress;
  contactnumber;
  cost;
  technologyname;
  subtechname;
  abstract;
  showcost = false;
  viewTechTeachDetails1(techTeach): void {
    for (var i = 0; i < this.getMyTechBankDataList.length; i++) {
      if (techTeach.tech_article_id === this.getMyTechBankDataList[i].tech_article_id) {
        this.articletype = this.getMyTechBankDataList[i].article_type;
        this.articletitle = this.getMyTechBankDataList[i].title;
        this.emailaddress = this.getMyTechBankDataList[i].contact_email;
        this.contactnumber = this.getMyTechBankDataList[i].contact_number;
        this.cost = this.getMyTechBankDataList[i].cost;
        this.technologyname = this.getMyTechBankDataList[i].technology;
        this.subtechname = this.getMyTechBankDataList[i].sub_technology;
        this.abstract = this.getMyTechBankDataList[i].abstract;
        if (this.getMyTechBankDataList[i].article_type == 'Article') {
          this.showcost = true;
        }
        return;
      }
    }
  }


  articlecomments = [];
  articleId;
  comment;
  showInput: boolean;
  userid;
  showTechArticleComments(techarticle) {
    this.showInput = false;
    this.comment = '';
    this.articleId = techarticle.tech_article_id;
    this.articlecomments = [];
    let userDetails = this.getLoggedInUserObject();
    this.userid = userDetails['name'].toString();

    this.http.get(this.Baseurl + 'tech-article-comments-list' + '?article_id=' + this.articleId).subscribe(data => {
      this.articlecomments = data.json().data;
      for (var i = 0; i < this.articlecomments.length; i++) {
        if (this.userid === this.articlecomments[i].user_id) {
          this.articlecomments[i].showEdit = true;
        } else {
          this.articlecomments[i].showEdit = false;
        }
      }
    });
  }

  commentsEdit() {
    this.showInput = true;
  }
  commentsEditDelete(data, action) {
    let userDetails = this.getLoggedInUserObject();
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    if (action === 'edit') {
      var params = 'user_id=' + userDetails['user_id'] + '&comment_id=' + data.comment_id + '&comment=' + data.comment
      this.http.post(this.Baseurl + 'update-tech-article-comment', params, { headers: headers }).subscribe(res => {
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
      this.http.post(this.Baseurl + 'delete-tech-article-comment', params, { headers: headers }).subscribe(res => {
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

  commentToBeAdded = "";
  commentOperation() {
    let userDetails = this.getLoggedInUserObject();
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    var params = 'user_id=' + userDetails['user_id'] + '&tech_article_id=' + this.articleId + '&comment=' + this.comment
    this.http.post(this.Baseurl + 'tech-article-comment', params, { headers: headers }).subscribe(res => {
      if (res.json().status === true) {
        // alert('comment added successfully');
        document.getElementById("closeCommentsModal").click();
        this.getMyTechBankData();
      } else {
        alert(res.json().message.error);
      }
    }, (err) => {
      alert(err.json().message.error);
    })
  }

  selectedModel: string;
  selectedTechTeach: JSON;
  viewTechTeachDetailss(techTeach): void {
    this.selectedModel = 'techTeach';
    this.selectedTechTeach = techTeach;
  }
  selectedTechTalk: JSON;
  viewTechTalkDetails(techTalk): void {
    this.selectedModel = 'techTalk';
    this.selectedTechTalk = techTalk;
  }

  stuvationcomments = [];
  selectedStuvation;
  stuationId;
  showstuvationComments(stuation) {
    this.showInput = false;
    this.comment = '';
    this.stuationId = stuation.stuvation_id;
    this.stuvationcomments = [];
    let userDetails = this.getLoggedInUserObject();
    this.userid = userDetails['name'].toString();

    this.http.get(this.Baseurl + 'stuvation-comments-list' + '?stuvation_id=' + this.stuationId).subscribe(data => {
      this.stuvationcomments = data.json().data;
      for (var i = 0; i < this.stuvationcomments.length; i++) {
        if (this.userid === this.stuvationcomments[i].user_id) {
          this.stuvationcomments[i].showEdit = true;
        } else {
          this.stuvationcomments[i].showEdit = false;
        }
      }
    });
  }

}
