import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { MainServiceService } from '../main-service.service';
// import { FilterPipe } from '../filter.pipe';
import { FilterPipe } from 'ngx-filter-pipe';

@Component({
  selector: 'app-tech-article',
  templateUrl: './tech-article.component.html',
  styleUrls: ['./tech-article.component.css']
})
export class TechArticleComponent implements OnInit {
  // endpoint: string = "http://localhost/services/";
   endpoint: string = "http://www.theengineersfactory.com/assets/services/";
  selectedTecharticle: any;
  constructor(private modal: NgbModal, private http: HttpClient, private mainService: MainServiceService, private filterPipe: FilterPipe) { }
  sliderContent: any = [];
  //homePageDataFromService=[];
  homePageContent: any = [];
  teamDetails: any = [];
  techarticledetails: any = [];
  ngOnInit(): void {
    //this.http.get('../assets/services/getHomePageContent.php'+"/random="+new Date().getTime()).subscribe(data => {
    let url = this.endpoint + 'getHomePageContent.php' + "/random=" + new Date().getTime();
    let userDetails = this.getLoggedInUserObject();
    if (!this.checkLoginStatus())
      var params = "?userid=" + userDetails['userid'];

    this.http.get(url).subscribe(data => {
      this.sliderContent = data['0'].sliderContent;
      this.teamDetails = data['1'].teamDetails;
      this.techarticledetails = data['2'].techarticledetails;
      this.homePageContent = data['3'].homePageData;
    });
  }
  techArticleFilter: any = { articletitle: '', name: '', technologyname: '', subtechname: '', cost: 0 };
  keywordFilter: any = { name: '' };
  techFilter: any = { technologyname: '' };
  subTechFilter: any = { subtechname: '' };
  articleTypeFilter = "";
  freeFilter: any = { cost: Number };
  authorFilter: any = { name: '' };

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
  showTechArticleComments(techarticle) {
    this.selectedTecharticle = techarticle;
    let requestObject = {
      "articleid": techarticle.articleid
    };

    this.http.post(this.endpoint + 'getArticleComments.php', requestObject, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/articleUpDownCount.php', requestObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      let parsedData: JSON = JSON.parse('' + data);
      this.articlecomments = parsedData['articlecomments'];

    });
  }

  buyNowModelClick(techarticle) {
    let userDetails = this.getLoggedInUserObject();
    this.selectedTecharticle = techarticle;
    let requestObject = {
      "articleid": techarticle.articleid,
      "userid": userDetails['userid']
    };

    this.http.post(this.endpoint + 'buynowArticleRegister.php', requestObject, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/articleUpDownCount.php', requestObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      //this.articlecomments=parsedData['articlecomments'];

    });
  }
  mailContent = "";
  sendMailToAuthorForPurchase(techarticleid, mailContent) {
    let userDetails = this.getLoggedInUserObject();
    let requestObject = {
      "articleid": techarticleid,
      "mailContent": mailContent,
      "userid": userDetails['userid']
    };

    this.http.post(this.endpoint + 'mailToAuthorForPurchase.php', requestObject, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/articleUpDownCount.php', requestObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['mailSent'] == 'done') {
        alert('Mail sent Successfully. Author will contact you.');
        this.mailContent = "";
        document.getElementById("closeBuynowModal").click();
      } else if (parsedData['mailSent'] == 'failed') {
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

  commentToBeAdded = "";
  commentOperation(techarticleid, commentid, articleComment, operationType) {
    let userDetails = this.getLoggedInUserObject();
    let requestObject = {
      "articleid": techarticleid,
      "articleComment": articleComment,
      "userid": userDetails['userid'],
      "operationType": operationType,
      "commentid": commentid
    };

    this.http.post(this.endpoint + 'commentsUpdateDeleteAdd.php', requestObject, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/articleUpDownCount.php', requestObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['commentUpdateDeleteAddQuery'] == 'done') {
        this.showTechArticleComments(this.selectedTecharticle);
        if (operationType == 'U')
          alert('Comment updated Successfully');
        this.commentToBeAdded = "";
      } else if (parsedData['commentUpdateDeleteAddQuery'] == 'failed') {
        alert('Failed to update');
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
