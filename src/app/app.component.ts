import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { MainServiceService } from './main-service.service';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';

import { Validators, FormBuilder, FormArray, ValidationErrors, FormGroup } from '../../node_modules/@angular/forms';
import { HttpClient } from '../../node_modules/@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
// import { MainService } from './main';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // providers: [MainService]
})
export class AppComponent {
  navbarOpen = false;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  isCollapsed = true;
  title = 'app';
  url;


  // endpoint: string = "../assets/services/"
  endpoint: string = "http://engfactory.accrosian.com/";
  Baseurl = "http://engfactory.accrosian.com/";
  endpoint1: string = "http://theengineersfactory.com/assets/services/";
  strImage;
  userid;
  uploader: FileUploader = new FileUploader({ url: this.endpoint + "profilePictureUpload.php", removeAfterUpload: false, autoUpload: false });
  fileUploaderTechArticle: FileUploader = new FileUploader({ url: this.endpoint + "publicationFileUpload.php", removeAfterUpload: false, autoUpload: false });
  fileUploaderReferenceLink: FileUploader = new FileUploader({ url: this.endpoint + "fileUploaderReferenceLink.php", removeAfterUpload: false, autoUpload: false });

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.strImage = (<FileReader>event.target).result;
        this.url = this.strImage.split(',')[1];
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'month';

  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];

  activeDayIsOpen: boolean = false;
  date: { year: number, month: number };

  constructor(private modal: NgbModal, public router: Router, private http: Http, private mainService: MainServiceService, private fb: FormBuilder, private calendar: NgbCalendar) { }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }
  sliderContent: any = [];
  //homePageDataFromService=[];
  homePageContent: any = [];
  teamDetails: any = [];
  technologyconfig: any = [];
  subtechnologyconfig: any = [];
  techTalkTypeConfig: any = [];
  techTeachTypeConfig: any = [];
  stuvationtypeconfig: any = [];
  techConnectSelector: string;
  techConnectSelector1: string;
  showTechTeach = false;
  showTechTalk = false;
  openMe(): void {
    this.showTechTeach = true;
    this.showTechTalk = false;
    this.getTechTypeList();
  }
  openMe1(): void {
    this.showTechTeach = false;
    this.showTechTalk = true;
    this.getTechTalkList();
  }
  minDateString;
  submitted = false;
  userImagePath;
  technologyList = [];
  projectTypeList = [];
  projectTypeId;
  ngOnInit(): void {
    let today = new Date();
    this.userImagePath = sessionStorage.getItem('userImagePath');
    this.minDateString = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    //document.getElementById("datefield").setAttribute("min", today.toDateString());
    let url = this.endpoint1 + 'getHomePageContent.php' + "/random=" + new Date().getTime();
    let userDetails = this.getLoggedInUserObject();
    console.log(userDetails);
    if (!this.checkLoginStatus())
      url += "?userid=" + userDetails['user_id'];

    this.http.get(url).subscribe(data => {
      // this.sliderContent = data['0'].sliderContent;
      // this.teamDetails = data['1'].teamDetails;
      // this.homePageContent = data['3'].homePageData;
      // this.technologyconfig = data['6'].technologyconfig;
      // this.subtechnologyconfig = data['7'].subtechnologyconfig;
      // this.techTalkTypeConfig = data['8'].techtalktypeconfig;
      // this.techTeachTypeConfig = data['9'].techteachtypeconfig;
      // this.stuvationtypeconfig = data['11'].stuvationtypeconfig;
      // this.updateSubTechList(this.createTechArticleForm.value.technology);
    });
    this.getTechnologyList();
    this.getProjecttype();
  }
  getProjecttype() {
    this.http.get(this.endpoint + 'project-type').subscribe(res => {
      this.projectTypeList = res.json().data;
    })
  }

  selectProjectType(value) {
    this.projectTypeId = value;
  }

  getTechnologyList() {
    this.http.get(this.endpoint + 'technology-list').subscribe(res => {
      this.technologyList = res.json().data;
    })
  }



  subtechnologylist: any = [];
  techId;
  subTechId;
  getSubTechList(technologyid) {
    this.techId = technologyid;
    this.http.get(this.endpoint + 'sub-technology-list').subscribe(res => {
      this.subtechnologylist = res.json().data;
    })

  }
  getSubtechId(subtechId) {
    this.subTechId = subtechId;
  }
  techTeachTypeList = [];
  getTechTypeList() {
    this.http.get(this.endpoint + 'tech-teach-type').subscribe(res => {
      this.techTeachTypeList = res.json().data;
    })
  }

  techTalkTypeList = [];
  getTechTalkList() {
    this.http.get(this.endpoint + 'tech-talk-type').subscribe(res => {
      this.techTalkTypeList = res.json().data;
    })
  }


  createStuvationForm = this.fb.group({
    projectType: ['', Validators.required],
    projectStatus: ['', Validators.required],
    title: [''],
    abstract: [''],
    sub_technology_id: ['', Validators.required],
    technology_id: ['', Validators.required],
    idea: [''],
    ideaDescription: [''],
    prototypeAvailable: ['Y'],
    referenceLink: [''],
    expectedBudget: [''],
    lookingProfessorGuidance: ['Y'],
    lookingMentorship: ['Y'],
    lookingStudentPartner: ['Y'],
    lookingSponsorship: ['Y'],

    teamSize: [''],
    lastDateOfJoining: ['1'],
    noOfSponsors: [''],

  });

  createTechTalkForm = this.fb.group({
    topic: ['', Validators.required],
    technology: ['', Validators.required],
    subtechnology: ['', Validators.required],
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

  _keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }



  createTechArticleForm = this.fb.group({
    contact_email: ['', Validators.required],
    contact_number: ['', Validators.required],
    title: ['', Validators.required],
    abstract: ['', Validators.required],
    technology_id: ['', Validators.required],
    sub_technology_id: ['', Validators.required],
    article_type: ['', Validators.required],
    is_paid: [''],
    cost: [''],
    publicationSelector: ['', Validators.required],
    publication_link: [''],
    publication_file: [''],
    is_agreed: ['', Validators.required]

  });
  showUpload: boolean;
  showCost: boolean;
  showLink: boolean;
  fileType(action) {
    if (action === 'file') {
      this.showUpload = true;
      this.showLink = false;
    } else if (action === 'publicationLink') {
      this.showUpload = false;
      this.showLink = true;
    }
  }
  selectPaid(action) {
    if (action === 'yes') {
      this.showCost = true;
    } else {
      this.showCost = false;
    }
  }
  showArticle: boolean;
  articleValue;
  articleType(value) {
    this.articleValue = value;
    if (value === 'Article') {
      this.showArticle = true;
    } else {
      this.showArticle = false;
    }
  }

  get f() { return this.createTechArticleForm.controls; }
  parsedData;
  onCreateTechArticleFormSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.createTechArticleForm.invalid) {
      alert('Required fields Missing');
      return;
    }

    let userDetails = this.getLoggedInUserObject();
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    var params = 'user_id=' + userDetails['user_id'] +
      '&contact_email=' + this.createTechArticleForm.value.contact_email
      + '&contact_number=' + this.createTechArticleForm.value.contact_number +
      '&title=' + this.createTechArticleForm.value.title +
      '&abstract=' + this.createTechArticleForm.value.abstract +
      '&technology_id=' + this.techId +
      '&sub_technology_id=' + this.subTechId +
      '&article_type=' + this.articleValue +
      '&is_paid=' + this.createTechArticleForm.value.is_paid +
      '&cost=' + this.createTechArticleForm.value.cost +
      '&publication_link=' + this.createTechArticleForm.value.publication_link +
      '&publication_file=' + this.url +
      '&is_agreed=' + this.createTechArticleForm.value.is_agreed

    this.http.post(this.Baseurl + 'create-tech-article', params, { headers: headers }).subscribe(data => {
      if (data.json().status === true) {
        alert(data.json().message);
        document.getElementById("closeCreateTechArticleModal").click();
        this.router.navigate(['/techbank'])
        location.reload();
      } else {
        alert(data.json().message);
      }


    });
  }

  onCreateStuvationFormSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.createStuvationForm.invalid) {
      alert('Required fields Missing');
      return;
    }

    let userDetails = this.getLoggedInUserObject();
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });


    var params = 'user_id=' + userDetails['user_id'] +
      '&project_type_id=' + this.projectTypeId
    '&project_status=' + this.createStuvationForm.value.projectStatus +
      '&title=' + this.createStuvationForm.value.title +
      '&technology_id=' + this.techId +
      '&sub_technology_id=' + this.subTechId +
      '&abstract=' + this.createStuvationForm.value.abstract +
      '&idea=' + this.createStuvationForm.value.idea +
      '&idea_desc=' + this.createStuvationForm.value.ideaDescription +
      '&is_looking_for_mentorship=' + this.createStuvationForm.value.lookingMentorship +


      this.http.post(this.Baseurl + 'create-stuvation', params, { headers: headers }).subscribe(data => {
        if (data.json().status === true) {
          alert(data.json().message);
          document.getElementById("createProjectModal").click();
          document.getElementById("createStuvationModal").click();
          this.router.navigate(['/techbank'])
          location.reload();
        } else {
          alert(data.json().message);
        }


      });







    // this.createStuvationForm.value.userDetails = this.getLoggedInUserObject();
    // console.warn(this.createStuvationForm.value);
    // const headers = new Headers({
    //   'Content-Type': 'multipart/form-data'
    // });
    // this.http.post(this.endpoint + 'createStuvation.php', this.createStuvationForm.value, { headers: headers }).subscribe(data => {
    //   //this.http.post('http://localhost:8080/edubee/createTechArticle.php', this.createTechArticleForm.value,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
    //   console.log(data);
    //   let parsedData: JSON = JSON.parse('' + data);
    //   console.log(parsedData);
    //   if (parsedData['stuvationdetailsquery'] == 'done') {
    //     alert('Stuvation has been sent for Admin Approval. After confirmation it will be reflected.');
    //     document.getElementById("closeCreateStuvationFormModal").click();
    //     location.reload();
    //   } else if (parsedData['stuvationdetailsquery'] == 'failed') {
    //     alert('Stuvation creation Failed');

    //   }

    // });
  }


  createEngshipForm = this.fb.group({
    engshipType: ['', Validators.required],
    mentorName: [this.getLoggedInUserObject()['name'], Validators.required],
    email: [this.getLoggedInUserObject()['emailaddress'], Validators.required],
    contact: [this.getLoggedInUserObject()['contactnumber'], Validators.required],
    organization: ['s'],
    position: ['a'],
    workLocation: ['a'],
    country: ['b'],
    technology: ['', Validators.required],
    subtechnology: ['', Validators.required],
    timeSpend: ['', Validators.required],
    numberOfHours: ['1', Validators.required],
    membershipChargeFlag: ['', Validators.required],
    membershipCharge: [''],
    willingToTravelFlag: ['Y', Validators.required],
    mentorBeforeFlag: ['Y', Validators.required],
    lookingForEFSupportFlag: ['Y', Validators.required],
    tncAcceptFlag: [false, Validators.required],
    userid: [this.getLoggedInUserObject()['userid'], Validators.required],
    branch: ['a'],
    college: ['b'],
    tenthPercent: ['1'],
    plustwoPercent: ['1'],
    graduationPercent: ['1'],
    postgradPercent: ['1'],
    learningGoals: ['ss'],
    lookingFor: ['', Validators.required]
  });

  getFormValidationErrors() {
    Object.keys(this.createEngshipForm.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.createEngshipForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }

  onCreateEngshipFormSubmit() {
    this.createEngshipForm.value.userDetails = this.getLoggedInUserObject();
    console.warn(this.createEngshipForm.value);
    const headers = new Headers({
      'Content-Type': 'multipart/form-data'
    });
    this.http.post(this.endpoint + 'createEngship.php', this.createEngshipForm.value, { headers: headers }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/createTechArticle.php', this.createTechArticleForm.value,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['stuvationdetailsquery'] == 'done') {
        alert('Engship has been sent for Admin Approval. After confirmation it will be reflected.');
        document.getElementById("closeCreateEngshipFormModal").click();
        location.reload();
      } else if (parsedData['stuvationdetailsquery'] == 'failed') {
        alert('Engship creation Failed');

      }

    });
  }

  techTeachTypeId;
  selectTechTeachType(event) {
    this.techTeachTypeId = event;
  }


  createTechTeachForm = this.fb.group({
    topic: ['', Validators.required],
    abstract: ['', Validators.required],
    technologyArea: ['', Validators.required],
    technology: ['', Validators.required],
    subtechnology: ['', Validators.required],
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
    userDetails: this.fb.group(this.getLoggedInUserObject()),
    agreeTnc: [false, Validators.required]

  });
  onCreateTechTeachFormSubmit() {
    this.createTechTeachForm.value.userDetails = this.getLoggedInUserObject();
    console.warn(this.createTechTeachForm.value);

    this.submitted = true;

    // stop here if form is invalid
    if (this.createTechTeachForm.invalid) {
      alert('Required fields Missing');
      return;
    }

    let userDetails = this.getLoggedInUserObject();
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    var params = 'tech_teach_id=' + '' +
      '&user_id=' + userDetails['user_id'] +
      'tech_teach_type_id=' + this.techTeachTypeId +
      '&topic=' + this.createTechTeachForm.value.topic +
      '&abstract=' + this.createTechTeachForm.value.abstract +
      '&technology_area=' + this.createTechTeachForm.value.technologyArea +
      '&technology_id=' + this.techId +
      '&sub_technology_id=' + this.subTechId +
      '&place=' + this.createTechTeachForm.value.venueDetails.place +
      '&city=' + this.createTechTeachForm.value.venueDetails.city +
      '&address=' + this.createTechTeachForm.value.venueDetails.address +
      '&event_date=' + this.createTechTeachForm.value.venueDetails.date +
      '&from_time=' + this.createTechTeachForm.value.venueDetails.fromTime +
      '&to_time=' + this.createTechTeachForm.value.venueDetails.toTime +
      '&web_address=' + this.createTechTeachForm.value.registrationDetails.webaddress +
      '&max_reg_allowed=' + this.createTechTeachForm.value.registrationDetails.maxregcount +
      '&reg_fee=' + this.createTechTeachForm.value.registrationDetails.regfee +
      '&eligibility=' + this.createTechTeachForm.value.registrationDetails.eligibility +
      '&seat_capacity=' + this.createTechTeachForm.value.registrationDetails.seatcapacity +
      '&expert_name=' + this.createTechTeachForm.value.expertDetails.name +
      '&company=' + this.createTechTeachForm.value.expertDetails.company +
      '&speaker_type=' + this.createTechTeachForm.value.expertDetails.speakerType +
      '&working_location=' + this.createTechTeachForm.value.expertDetails.worklocation +
      '&position=' + this.createTechTeachForm.value.expertDetails.position +
      '&experience=' + this.createTechTeachForm.value.expertDetails.experience


    this.http.post(this.endpoint + 'create-tech-teach', params, { headers: headers }).subscribe(res => {
      if (res.json().status === true) {
        alert(res.json().message);
        this.createTechTeachForm.reset();
        document.getElementById("closeCreateTechTeachModal").click();
        location.reload();
      } else {
        alert(res.json().message);
      }
    })
  }
  selectedTechTalkType;
  selectTechtalkType(value) {
    this.selectedTechTalkType = value;
  }


  onCreateTechTalkFormSubmit() {
    this.createTechTalkForm.value.userDetails = this.getLoggedInUserObject();
    this.submitted = true;
    // stop here if form is invalid
    if (this.createTechTalkForm.invalid) {
      alert('Required fields Missing');
      return;
    }

    let userDetails = this.getLoggedInUserObject();
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    var params =
      'user_id=' + userDetails['user_id'] +
      '&tech_talk_type_id=' + this.selectedTechTalkType +
      '&topic=' + this.createTechTalkForm.value.topic +
      '&abstract=' + this.createTechTalkForm.value.abstract +
      '&technology_area=' + this.createTechTalkForm.value.technologyArea +
      '&technology_id=' + this.techId +
      '&sub_technology_id=' + this.subTechId +
      '&place=' + this.createTechTalkForm.value.venueDetails.place +
      '&city=' + this.createTechTalkForm.value.venueDetails.city +
      '&address=' + this.createTechTalkForm.value.venueDetails.address +
      '&event_date=' + this.createTechTalkForm.value.venueDetails.date +
      '&from_time=' + this.createTechTalkForm.value.venueDetails.fromTime +
      '&to_time=' + this.createTechTalkForm.value.venueDetails.toTime +
      '&web_address=' + this.createTechTalkForm.value.registrationDetails.webaddress +
      '&max_reg_allowed=' + this.createTechTalkForm.value.registrationDetails.maxregcount +
      '&reg_fee=' + this.createTechTalkForm.value.registrationDetails.regfee +
      '&eligibility=' + this.createTechTalkForm.value.registrationDetails.eligibility +
      '&seat_capacity=' + this.createTechTalkForm.value.registrationDetails.seatcapacity +
      '&expert_name=' + this.createTechTalkForm.value.expertDetails.name +
      '&company=' + this.createTechTalkForm.value.expertDetails.company +
      '&speaker_type=' + this.createTechTalkForm.value.expertDetails.speakerType +
      '&working_location=' + this.createTechTalkForm.value.expertDetails.worklocation +
      '&position=' + this.createTechTalkForm.value.expertDetails.position +
      '&experience=' + this.createTechTalkForm.value.expertDetails.experience


    this.http.post(this.endpoint + 'create-tech-talk', params, { headers: headers }).subscribe(res => {
      if (res.json().status === true) {
        alert(res.json().message);
        document.getElementById("closeCreateTechTeachModal").click();
        this.createTechTalkForm.reset();
        // location.reload();
      } else {
        alert(res.json().message);
      }
    })
  }










  // onCreateTechTalkFormSubmit() {
  //   this.createTechTalkForm.value.userDetails = this.getLoggedInUserObject();
  //   console.warn(this.createTechTeachForm.value);
  //   const headers = new Headers({
  //     'Content-Type': 'multipart/form-data'
  //   });
  //   this.http.post(this.endpoint + 'createTechTalk.php', this.createTechTalkForm.value, { headers: headers }).subscribe(data => {
  //     //this.http.post('http://localhost:8080/edubee/createTechTalk.php', this.createTechTalkForm.value,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
  //     console.log(data);
  //     let parsedData: JSON = JSON.parse('' + data);
  //     console.log(parsedData);
  //     if (parsedData['techtalkdetailsQuery'] == 'done') {
  //       alert('Tech Talk Created');
  //       location.reload();
  //       document.getElementById("closeCreateTechTalkModal").click();
  //       this.createTechTalkForm.reset();
  //     } else if (parsedData['techtalkdetailsQuery'] == 'failed') {
  //       alert('Tech Talk creation Failed');

  //     }

  //   });
  // }

  checkLoginStatus(): boolean {
    return this.mainService.checkLoginStatus();
  }

  getLoggedInUserObject(): JSON {
    return this.mainService.getLoggedInUserObject();
  }

  logout(): void {
    this.mainService.logout();
  }

  closeLoginBox(): void {
    console.log('closeLoginBox');
    document.getElementById("closeLoginForm").click();
  }

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onLoginFormSubmit() {

    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    var params = 'email=' + this.loginForm.value.email + '&password=' + this.loginForm.value.password

    this.http.post(this.endpoint + 'user-login', params, { headers: headers }).subscribe(response => {
      if (response.json().status !== false) {
        alert('Login Successfully');
        this.loginForm.reset();
        let parsedData = response.json().data;
        sessionStorage.setItem("loggedInUserName", JSON.stringify(parsedData[0]));
        sessionStorage.setItem("userImagePath", response.json().image_path);
        sessionStorage.setItem("userId", response.json().user_id);
        console.log(sessionStorage.userId);
        document.getElementById("closeLoginForm").click();
        this.ngOnInit();
      } else {
        alert('Invalid Credentials');
      }
    })
  }

  studentRegistrationForm = this.fb.group({
    user_type: ['student'],
    user_name: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', Validators.required],
    mobile: ['', Validators.required],
    password: ['', Validators.required],
    con_password: ['', Validators.required],
    profile_image: [this.url],
    is_agreed: ['yes']

  });

  engineerRegistrationForm = this.fb.group({
    user_type: ['engineer'],
    user_name: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', Validators.required],
    mobile: ['', Validators.required],
    password: ['', Validators.required],
    con_password: ['', Validators.required],
    profile_image: [this.url],
    is_agreed: ['yes']

  });

  get logValid() {
    return this.loginForm.controls;
  }
  get studValid() {
    return this.studentRegistrationForm.controls;
  }

  get engValid() {
    return this.engineerRegistrationForm.controls;
  }
  get workExperience() {
    return this.engineerRegistrationForm.get('workExperience') as FormArray;
  }

  addWorkExperience() {
    this.workExperience.push(this.fb.group({
      role: [''],
      companyName: [''],
      yearsOfExperience: ['']
    }));
  }

  onEngineerRegistrationFormSubmit() {
    this.engineerRegistrationForm.value.profile_image = this.url;

    const headers = new Headers({
      'Content-Type': "application/x-www-form-urlencoded",
    });
    var params = 'user_name=' + this.engineerRegistrationForm.value.user_name +
      '&name=' + this.engineerRegistrationForm.value.name +
      '&email=' + this.engineerRegistrationForm.value.email +
      '&mobile=' + this.engineerRegistrationForm.value.mobile +
      '&password=' + this.engineerRegistrationForm.value.password +
      '&con_password=' + this.engineerRegistrationForm.value.con_password +
      '&profile_image=' + this.engineerRegistrationForm.value.profile_image +
      '&is_agreed=' + this.engineerRegistrationForm.value.is_agreed
    this.http.post(this.endpoint + 'user-register', params, { headers: headers }).subscribe(res => {
      this.engineerRegistrationForm.reset();
      this.router.navigate(['/']);
      alert('Profile Created Successfully');
      // this.uploader.uploadAll();
      document.getElementById("closeEngineerRegistrationForm").click();
    })
  }

  onStudentRegistrationFormSubmit() {
    this.studentRegistrationForm.value.profile_image = this.url;
    const headers = new Headers({
      'Content-Type': "application/x-www-form-urlencoded",
    });
    var params = 'user_name=' + this.studentRegistrationForm.value.user_name +
      '&name=' + this.studentRegistrationForm.value.name +
      '&email=' + this.studentRegistrationForm.value.email +
      '&mobile=' + this.studentRegistrationForm.value.mobile +
      '&password=' + this.studentRegistrationForm.value.password +
      '&con_password=' + this.studentRegistrationForm.value.con_password +
      '&profile_image=' + this.studentRegistrationForm.value.profile_image +
      '&is_agreed=' + this.studentRegistrationForm.value.is_agreed
    this.http.post(this.endpoint + 'user-register', params, { headers: headers }).subscribe(res => {
      this.studentRegistrationForm.reset();
      this.router.navigate(['/']);
      alert('Profile Created Successfully');
      // this.uploader.uploadAll();
      document.getElementById("closeStudentRegistrationForm").click();
    })


  }

  openmenu() {
    this.navbarOpen = true;
  }

  hidemenu() {
    this.navbarOpen = false;
  }

  goHome() {
    this.router.navigate(['/home']);
    this.navbarOpen = false;
  }
  goTechBank() {
    this.router.navigate(['/techbank']);
    this.navbarOpen = false;
  }
  goTechEvent() {
    this.router.navigate(['/techevent']);
    this.navbarOpen = false;
  }
  goStuation() {
    this.router.navigate(['/stuvation']);
    this.navbarOpen = false;
  }
  goEngShip() {
    this.router.navigate(['/engship']);
    this.navbarOpen = false;
  }
  goProzeMe() {
    this.router.navigate(['/prozectme']);
    this.navbarOpen = false;
  }




}
