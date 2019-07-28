import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MainServiceService } from '../main-service.service';
import { Http, Headers } from '@angular/http';

import { FilterPipe } from '../filter.pipe';
// import { FilterPipe } from '../filter.pipe';

@Component({
  selector: 'app-tech-article',
  templateUrl: './tech-article.component.html',
  styleUrls: ['./tech-article.component.css']
})
export class TechArticleComponent implements OnInit {
  // endpoint: string = "../assets/services/";
  endpoint: string = "../assets/services/";
  Baseurl = "http://theengineersfactory.com/dashboard/";
  selectedTecharticle: any;
  constructor(private http: HttpClient, private httpnew: Http, private mainService: MainServiceService) { }
  sliderContent: any = [];
  //homePageDataFromService=[];
  homePageContent: any = [];
  teamDetails: any = [];
  techarticledetails: any = [];
  userid: string;
  technologyList = [];
  ResponseData: any = [];
  file_path: string;
  file_path1: string;
  techArticleFilte;
  techArticleFilterr: any = { title: '', user_name: '', technology: '', sub_technology: '', cost: 0, article_type: '' };
  keywordFilter: any = { user_name: '' };
  techFilter: any = { technology: '' };
  subTechFilter: any = { sub_technology: '' };
  articleTypeFilter = "";
  freeFilter: any = { cost: Number };
  authorFilter: any = { user_name: '' };
  ngOnInit(): void {

    let userDetails = this.getLoggedInUserObject();
    if (!this.checkLoginStatus()) {
      this.userid = userDetails['user_id'].toString();
    }
    console.log(this.userid);


    this.getArticles();

  }

  getTechnologyList() {
    this.httpnew.get(this.Baseurl + 'technology-list').subscribe(res => {
      this.technologyList = res.json().data;
    })
  }

  getArticles() {
    let userDetails = this.getLoggedInUserObject();
    this.httpnew.get(this.Baseurl + 'tech-article-list' + '?user_id=' + userDetails['user_id']).subscribe(response => {
      this.ResponseData = response.json().data.reverse();
      console.log(this.ResponseData);
      this.file_path = response.json().image_path;
      this.file_path1 = response.json().file_path;
      // console.log(this.ResponseData);
    });
  }




  articleUpDownCountUpdate(techarticleid, updateType) {
    let userDetails = this.getLoggedInUserObject();
    let requestObject = {
      "articleid": techarticleid,
      "updateType": updateType,
      "userid": userDetails['userid']
    };

    this.http.post(this.endpoint + 'articleUpDownCount.php', requestObject, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/articleUpDownCount.php', requestObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      let parsedData: JSON = JSON.parse('' + data);
      if (parsedData['articleUpDownCountQuery'] == 'done') {
        this.ngOnInit();
      } else if (parsedData['articleUpDownCountQuery'] == 'failed') {
        alert('Failed to update');
      }

    });
  }
  articlecomments = [];
  articleId;
  comment;
  showTechArticleComments(techarticle) {
    this.showInput = false;
    this.comment = '';
    this.articleId = techarticle.tech_article_id;
    this.articlecomments = [];
    let userDetails = this.getLoggedInUserObject();
    this.userid = userDetails['name'].toString();

    this.httpnew.get(this.Baseurl + 'tech-article-comments-list' + '?article_id=' + this.articleId).subscribe(data => {
      this.articlecomments = data.json().data;
      for (var i = 0; i < this.articlecomments.length; i++) {
        if (this.userid === this.articlecomments[i].user_id) {
          this.articlecomments[i].showEdit = true;
        } else {
          this.articlecomments[i].showEdit = false;
        }
      }
      console.log(this.articlecomments);
    });
  }

  buyNowModelClick(techarticle) {
    let userDetails = this.getLoggedInUserObject();
    this.selectedTecharticle = techarticle;

  }
  mailContent = "";
  sendMailToAuthorForPurchase() {
    let userDetails = this.getLoggedInUserObject();
    let requestObject = 'user_id=' + userDetails['user_id'] + '&tech_article_id=' + this.selectedTecharticle.tech_article_id +
      '&name=' + this.selectedTecharticle.user_name + '&message=' + this.mailContent

    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.httpnew.post(this.Baseurl + 'buy-tech-article', requestObject, { headers: headers }).subscribe(res => {
      if (res.json().status === true) {
        alert(res.json().message);
        document.getElementById("buynowModal").click();
        this.ngOnInit();
      } else {
        alert(res.json().message);
      }
      //this.articlecomments=parsedData['articlecomments'];

    });
  }

  followerUpdate(articleId, operationType) {
    let userDetails = this.getLoggedInUserObject();

    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    var params = 'user_id=' + userDetails['user_id'] + '&tech_article_id=' + articleId + '&action=' + operationType
    this.httpnew.post(this.Baseurl + 'follow-tech-article', params, { headers: headers }).subscribe(res => {
      if (res.json().status === true) {
        this.ngOnInit();
      } else {
        alert(res.json().message);
      }
    })
  }
  action: number;
  liked: boolean;
  likeArticle(articleId, operationType, user_id) {
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

    var params = 'user_id=' + userDetails['user_id'] + '&tech_article_id=' + articleId + '&action=' + this.action
    this.httpnew.post(this.Baseurl + 'like-tech-article', params, { headers: headers }).subscribe(res => {

      if (this.action === 1) {
        this.liked = true;
      } else {
        this.liked = false;
      }
      if (res.json().status === true) {
        this.ngOnInit();
      } else {
        alert(res.json().message);
      }
    })
  }

  commentToBeAdded = "";
  commentOperation() {
    let userDetails = this.getLoggedInUserObject();
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    var params = 'user_id=' + userDetails['user_id'] + '&tech_article_id=' + this.articleId + '&comment=' + this.comment
    this.httpnew.post(this.Baseurl + 'tech-article-comment', params, { headers: headers }).subscribe(res => {
      if (res.json().status === true) {
        alert('comment added successfully');
        document.getElementById("closeCommentsModal").click();
        this.getArticles();
      } else {
        alert(res.json().message);
      }
    })
  }
  showInput: boolean;
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
      this.httpnew.post(this.Baseurl + 'update-tech-article-comment', params, { headers: headers }).subscribe(res => {
        if (res.json().status === true) {
          alert(res.json().message);
          document.getElementById("closeCommentsModal").click();
        } else {
          alert(res.json().message);
        }
      })
    } else if (action === 'delete') {
      var params = 'user_id=' + userDetails['user_id'] + '&comment_id=' + data.comment_id
      this.httpnew.post(this.Baseurl + 'delete-tech-article-comment', params, { headers: headers }).subscribe(res => {
        if (res.json().status === true) {
          alert(res.json().message);
          document.getElementById("closeCommentsModal").click();
        } else {
          alert(res.json().message);
        }
      })
    }
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
  articletype;
  articletitle;
  emailaddress;
  contactnumber;
  cost;
  technologyname;
  subtechname;
  abstract;
  showcost = false;
  viewTechTeachDetails(techTeach): void {
    for (var i = 0; i < this.ResponseData.length; i++) {
      if (techTeach.tech_article_id === this.ResponseData[i].tech_article_id) {
        this.articletype = this.ResponseData[i].article_type;
        this.articletitle = this.ResponseData[i].title;
        this.emailaddress = this.ResponseData[i].contact_email;
        this.contactnumber = this.ResponseData[i].contact_number;
        this.cost = this.ResponseData[i].cost;
        this.technologyname = this.ResponseData[i].technology;
        this.subtechname = this.ResponseData[i].sub_technology;
        this.abstract = this.ResponseData[i].abstract;
        if (this.ResponseData[i].article_type == 'Article') {
          this.showcost = true;
        }
        return;
      }
    }
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
    this.getTechnologyList();
  }
  selectSubTechnology() {
    this.showKeyword = false;
    this.showArticle = false;
    this.showTechnology = false
    this.showSubTech = true;
    this.showAuthor = false;
    this.showCost = false;
    this.getSubTechList();
  }

  subtechnologylist: any = [];

  getSubTechList() {
    this.httpnew.get(this.Baseurl + 'sub-technology-list').subscribe(res => {
      this.subtechnologylist = res.json().data;
    })

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
