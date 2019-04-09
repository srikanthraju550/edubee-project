import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
import { MainServiceService } from '../main-service.service';

@Component({
  selector: 'app-staticdata',
  templateUrl: './staticdata.component.html',
  styleUrls: ['./staticdata.component.css']
})
export class StaticdataComponent implements OnInit {
  action;
  Baseurl = "http://engfactory.accrosian.com/";
  ResponseData = [];
  showTechbank: boolean;
  showTechconnect: boolean;
  showstuation: boolean;
  getMyTechBankDataList = [];
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
    let userDetails = this.getLoggedInUserObject();
    this.http.get(this.Baseurl + 'tech-article-list' + '?user_id=' + userDetails['user_id']).subscribe(response => {
      this.ResponseData = response.json().data;
      for (var i = 0; i < this.ResponseData.length; i++) {
        if (this.ResponseData[i].user_id === userDetails['user_id']) {
          this.getMyTechBankDataList.push(this.ResponseData[i]);
        }
      }
    });
  }
  getMyTechConnectData() {

  }

  getMyStuation() {

  }


}
