
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
import { MainServiceService } from '../main-service.service';
@Component({
  selector: 'app-staticdata',
  templateUrl: './staticdata.component.html',
  styleUrls: ['./staticdata.component.css',
              '../tech-article/tech-article.component.css',
              '../tech-bank/tech-bank.component.css']
})
export class StaticdataComponent implements OnInit {
  file_path: string;
  action;
  Baseurl = "http://engfactory.accrosian.com/";
  ResponseData = [];
  TechResponseData = [];
  TechtlkResponseData = [];
  showTechbank: boolean;
  showTechconnect: boolean;
  showstuation: boolean;
  getMyTechBankDataList = [];
  getMyTechConnctData=[];
  getMyTechTalktData=[];
  StuvResponseData=[];
  getMyStuvData=[];
  constructor(private route: ActivatedRoute, private http: Http, private mainService: MainServiceService) {
    this.route.params.subscribe((params: Params) => {
      this.action = params['action'];
  

    if (this.action == 'myTechBank') {
      this.getMyTechBankData();
      this.showTechbank = true;
      this.showTechconnect = false;
      this.showstuation = false;
    } else if (this.action == 'myTechConnect') {
      this.getMyTechConnectData();
      this.getMyTechtalkData();
      this.showTechbank = false;
      this.showTechconnect = true;
      this.showstuation = false;
    } else if (this.action == 'myStuation') {
      this.getMyStuation();
      this.showTechbank = false;
      this.showTechconnect = false;
      this.showstuation = true;
    }
  });
  }

  ngOnInit() {
  
  }


  getLoggedInUserObject(): JSON {
    return this.mainService.getLoggedInUserObject();
  }

  getMyTechBankData() {
    this.getMyTechBankDataList=[];
    let userDetails = this.getLoggedInUserObject();
    this.http.get(this.Baseurl + 'tech-article-list' + '?user_id=' + userDetails['user_id']).subscribe(response => {
      this.ResponseData = response.json().data;
      for (var i = 0; i < this.ResponseData.length; i++) {
        if (this.ResponseData[i].user_id === userDetails['user_id']) {
          this.getMyTechBankDataList.push(this.ResponseData[i]);
        }
      }
      // console.log(this.getMyTechBankDataList);
      this.file_path = response.json().image_path;
    });
  }
  getMyTechConnectData() {
    this.getMyTechConnctData=[];
    let userDetails = this.getLoggedInUserObject();
    this.http.get(this.Baseurl + 'tech-teach-list' + '?user_id=' + userDetails['user_id']).subscribe(response => {
      this.TechResponseData = response.json().data;
      for (var i = 0; i < this.TechResponseData.length; i++) {
        if (this.TechResponseData[i].user_id === userDetails['user_id']) {
          this.getMyTechConnctData.push(this.TechResponseData[i]);
        }
      }
      // console.log(this.getMyTechConnctData);
    });
  }
  getMyTechtalkData() {
    this.getMyTechTalktData= [];
    let userDetails = this.getLoggedInUserObject();
    this.http.get(this.Baseurl + 'tech-talk-list' + '?user_id=' + userDetails['user_id']).subscribe(response => {
      this.TechtlkResponseData = response.json().data;
      for (var i = 0; i < this.TechtlkResponseData.length; i++) {
        if (this.TechtlkResponseData[i].user_id === userDetails['user_id']) {
          this.getMyTechTalktData.push(this.TechtlkResponseData[i]);
        }
      }
      // console.log(this.getMyTechTalktData);
    });
  }
  getMyStuation() {
    this.getMyStuvData= [];
    let userDetails = this.getLoggedInUserObject();
    this.http.get(this.Baseurl + 'stuvation_list' + '?user_id=' + userDetails['user_id']).subscribe(response => {
      this.StuvResponseData = response.json().data;
      for (var i = 0; i < this.StuvResponseData.length; i++) {
        if (this.StuvResponseData[i].user_id === userDetails['user_id']) {
          this.getMyStuvData.push(this.StuvResponseData[i]);
        }
      }
      console.log(this.getMyStuvData);
    });
  }


}
