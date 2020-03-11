import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { MainServiceService } from '../main-service.service';
import { FilterPipe } from 'ngx-filter-pipe';
import { Http, Headers } from '@angular/http';
import { AppComponent } from '../app.component';
import { Validators, FormBuilder, FormArray, ValidationErrors, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tech-bank',
  templateUrl: './tech-bank.component.html',
  styleUrls: ['./tech-bank.component.css']
})
export class TechBankComponent implements OnInit {
  // endpoint: string = "../assets/services/";

  // endpoint: string = "../assets/services/";
  endpoint: string = "../assets/services/";
  Baseurl = "http://theengineersfactory.com/dashboard/";
  constructor(private modal: NgbModal, private http: HttpClient, public app: AppComponent, private fb: FormBuilder, private mainService: MainServiceService, private filterPipe: FilterPipe, private httpnew: Http) { }
  sliderContent: any = [];
  //homePageDataFromService=[];
  homePageContent: any = [];
  teamDetails: any = [];
  techtalkdetails = [];
  techteachdetails: any = [];
  techteachLength: any = 0;
  selectedModel: string;
  selectedTechTeach: JSON;
  selectedTechTalk: JSON;
  techTalkFilter = "";
  keywordFilter = "";
  techFilter = "";
  subTechFilter = "";
  techEventFilter: any = { user_name: '', technology: '', sub_technology: '' };
  date;
  dataDate;
  createTech() {
    this.app.
      createTechTalkForm = this.fb.group({
        topic: ['', Validators.required],
        technology: ['', Validators.required],
        subtechnology: [''],
        techtalktype: ['', Validators.required],
        venueDetails: this.fb.group({
          place: ['', Validators.required],
          city: ['', Validators.required],
          address: ['', Validators.required],
          date: ['', Validators.required],
          fromTime: ['', Validators.required],
          toTime: ['', Validators.required]
        }),
        registrationDetails: this.fb.group({
          webaddress: ['', Validators.required],
          maxregcount: ['', Validators.required],
          regfee: ['', Validators.required],
          eligibility: ['', Validators.required],
          seatcapacity: ['', Validators.required]
        }),
        expertDetails: this.fb.group({
          name: ['', Validators.required],
          company: ['', Validators.required],
          speakerType: ['', Validators.required],
          worklocation: ['', Validators.required],
          position: ['', Validators.required],
          experience: ['', Validators.required]
        }),
        userDetails: this.fb.group(this.getLoggedInUserObject()),
        agreeTermsAndConditions: [false, Validators.required]
      });

    this.app.createTechTeachForm = this.fb.group({
      topic: ['', Validators.required],
      abstract: ['', Validators.required],
      technology: ['', Validators.required],
      subtechnology: [''],
      techteachtype: ['', Validators.required],
      venueDetails: this.fb.group({
        place: ['', Validators.required],
        city: ['', Validators.required],
        address: ['', Validators.required],
        date: ['', Validators.required],
        fromTime: ['', Validators.required],
        toTime: ['', Validators.required]
      }),
      registrationDetails: this.fb.group({
        webaddress: ['', Validators.required],
        maxregcount: ['', Validators.required],
        regfee: ['', Validators.required],
        eligibility: ['', Validators.required],
        seatcapacity: ['', Validators.required]
      }),
      expertDetails: this.fb.group({
        name: ['', Validators.required],
        company: ['', Validators.required],
        speakerType: ['', Validators.required],
        worklocation: ['', Validators.required],
        position: ['', Validators.required],
        experience: ['', Validators.required]
      }),
      userDetails: this.fb.group(this.getLoggedInUserObject())

    });
  }
  ResponseData = [];

  ngOnInit() {
    // this.http.get(this.endpoint + 'getHomePageContent.php' + "/random=" + new Date().getTime()).subscribe(data => {
    //   //this.http.get('http://localhost:8080/edubee/getHomePageContent.php'+"/random="+new Date().getTime()).subscribe(data => {
    //   this.sliderContent = data['0'].sliderContent;
    //   this.teamDetails = data['1'].teamDetails;
    //   this.homePageContent = data['3'].homePageData;
    //   this.techtalkdetails = data['4'].techtalkdetails;
    //   this.techteachdetails = data['5'].techteachdetails;
    //   this.techteachLength = this.techtalkdetails.length;
    //   console.log(this.techtalkdetails);

    // });
    this.getTechTeachList();
    this.getTechTalkList();
  }

  getTechTeachList() {
    let userDetails = this.getLoggedInUserObject();
    this.httpnew.get(this.Baseurl + 'tech-teach-list').subscribe(response => {
      this.ResponseData = response.json().data;
      this.date = new Date();

      for (var i = 0; i < this.ResponseData.length; i++) {
        this.dataDate = new Date(this.ResponseData[i].event_date);
        if (this.date.getFullYear() >= this.dataDate.getFullYear()) {
          if (this.date.getMonth() + 1 >= this.dataDate.getMonth() + 1) {
            if (this.date.getDate() >= this.dataDate.getDate()) {
              this.ResponseData[i].showReg = false;
            }

          }
        }
      }
    });

  }

  getTechTalkList() {
    let userDetails = this.getLoggedInUserObject();
    this.httpnew.get(this.Baseurl + 'tech-talk-list').subscribe(response => {
      this.techtalkdetails = response.json().data;
      this.date = new Date();
      for (var i = 0; i < this.techtalkdetails.length; i++) {
        this.dataDate = new Date(this.techtalkdetails[i].event_date);
        console.log(this.dataDate.getMonth() + 1);
        if (this.date.getFullYear() >= this.dataDate.getFullYear()) {
          if (this.date.getMonth() + 1 >= this.dataDate.getMonth() + 1) {
            if (this.date.getDate() >= this.dataDate.getDate()) {
              this.techtalkdetails[i].showReg = false;
            }
          }
        }
      }
      console.log(this.techtalkdetails);
    });

  }


  viewTechTeachDetails(techTeach): void {
    this.selectedModel = 'techTeach';
    this.selectedTechTeach = techTeach;
  }

  viewTechTalkDetails(techTalk): void {
    this.selectedModel = 'techTalk';
    this.selectedTechTalk = techTalk;
  }

  applyForEventTechTeach(techTeach): void {
    let userDetails = this.getLoggedInUserObject();
    let registrationObject: any = {
      "eventid": techTeach.techteachid,
      "eventtype": 'techTeach',
      "registereduserid": userDetails['userid']
    };
    this.http.post(this.endpoint + 'applyForTechEvents.php', registrationObject, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      let parsedData: JSON = JSON.parse('' + data);
      if (parsedData['techEventRegistrationQuery'] == 'done') {
        // alert('Registered Successfully for the Event');
        this.ngOnInit();
      } else if (parsedData['techEventRegistrationQuery'] == 'failed') {
        alert('Registration Failed for the Event');
      } else if (parsedData['alreadyRegistered'] == 'true') {
        alert('Already Registered for the Event');
      }

    }, (err) => {
      alert(err.json().message.error);
    });
  }
  techteachid: any;
  techtalkid: any;
  applyForEventTechTalk(techdata): void {
    let userDetails = this.getLoggedInUserObject();
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.techteachid = techdata.tech_teach_id == undefined ? '' : techdata.tech_teach_id;
    this.techtalkid = techdata.tech_talk_id == undefined ? '' : techdata.tech_talk_id;
    var params = 'user_id=' + userDetails['user_id'] + '&tech_teach_id=' + this.techteachid + '&tech_talk_id=' + this.techtalkid
      + '&email=' + userDetails['email'] + '&mobile=' + userDetails['mobile']

    this.httpnew.post(this.Baseurl + 'apply-event', params, { headers: headers }).subscribe(res => {
      if (res.json().status === true) {
        alert(res.json().message);
      } else {
        alert(res.json().message.error);
      }
    }, (err) => {
      alert(err.json().message.error);
    })


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
    this.techEventFilter.technology = '';
    this.techEventFilter.sub_technology = '';
    this.showKeyword = false;
    this.showArticle = true;
    this.showTechnology = false;
    this.showSubTech = false;
    this.showAuthor = false;
    this.showCost = false;
  }

  selectTechnology() {
    this.techEventFilter.user_name = '';
    this.techEventFilter.sub_technology = '';
    this.showKeyword = false;
    this.showArticle = false;
    this.showTechnology = true;
    this.showSubTech = false;
    this.showAuthor = false;
    this.showCost = false;
    this.getTechnologyList();
  }
  selectSubTechnology() {
    this.techEventFilter.user_name = '';
    this.techEventFilter.technology = '';
    this.showKeyword = false;
    this.showArticle = false;
    this.showTechnology = false
    this.showSubTech = true;
    this.showAuthor = false;
    this.showCost = false;
    this.getSubTechList();
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

}
