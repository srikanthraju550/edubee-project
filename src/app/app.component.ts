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

import { Validators, FormBuilder, FormArray, ValidationErrors } from '../../node_modules/@angular/forms';
import { HttpClient } from '../../node_modules/@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

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
})
export class AppComponent {
  navbarOpen = false;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  isCollapsed = true;
  title = 'app';
  url;

  // endpoint: string = "http://localhost/services/";
  endpoint: string = "http://localhost/services/";
  // endpoint: string = "http://theengineersfactory.com/assets/services/";
  //endpoint: string="http://localhost/services/"
  userid;
  uploader: FileUploader = new FileUploader({ url: this.endpoint + "profilePictureUpload.php", removeAfterUpload: false, autoUpload: false });
  fileUploaderTechArticle: FileUploader = new FileUploader({ url: this.endpoint + "publicationFileUpload.php", removeAfterUpload: false, autoUpload: false });
  fileUploaderReferenceLink: FileUploader = new FileUploader({ url: this.endpoint + "fileUploaderReferenceLink.php", removeAfterUpload: false, autoUpload: false });

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {
        this.url = (<FileReader>event.target).result;
        console.log(this.url);
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

  constructor(private modal: NgbModal, public router: Router, private http: HttpClient, private mainService: MainServiceService, private fb: FormBuilder, private calendar: NgbCalendar) { }

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
  techConnectSelector;
  openMe(): void {
    console.log(document.getElementById("datefield"));
  }
  minDateString;

  ngOnInit(): void {




    let today = new Date();
    console.dir(today);
    this.minDateString = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    console.log(this.minDateString);
    //document.getElementById("datefield").setAttribute("min", today.toDateString());
    console.dir(document.getElementById("datefield"));
    let url = this.endpoint + 'getHomePageContent.php' + "/random=" + new Date().getTime();
    let userDetails = this.getLoggedInUserObject();
    console.log(this.getLoggedInUserObject());
    if (!this.checkLoginStatus())
      url += "?userid=" + userDetails['userid'];

    //this.http.get('http://localhost/services/getHomePageContent.php'+"/random="+new Date().getTime()).subscribe(data => {
    this.http.get(url).subscribe(data => {
      console.log(data);
      this.sliderContent = data['0'].sliderContent;
      this.teamDetails = data['1'].teamDetails;
      this.homePageContent = data['3'].homePageData;
      this.technologyconfig = data['6'].technologyconfig;
      this.subtechnologyconfig = data['7'].subtechnologyconfig;
      this.techTalkTypeConfig = data['8'].techtalktypeconfig;
      this.techTeachTypeConfig = data['9'].techteachtypeconfig;
      this.stuvationtypeconfig = data['11'].stuvationtypeconfig;
      // document.getElementById("signupDropdown").click();
      // document.getElementById("signupDropdown").click();
      this.updateSubTechList(this.createTechArticleForm.value.technology);
    });
  }
  subtechnologylist: any = [];
  updateSubTechList(technologyid) {
    console.log(technologyid);
    this.subtechnologylist = this.subtechnologyconfig;/* .filter(obj => {
      console.log(obj.technologyid);
      return obj.technologyid === technologyid;
    }) */
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
  createStuvationForm = this.fb.group({
    projectType: ['', Validators.required],
    projectStatus: ['', Validators.required],
    title: [''],
    abstract: [''],
    subtechnology: [''],
    technology: [''],
    idea: [''],
    ideaDescription: [''],
    prototypeAvailable: ['Y'],
    referenceLink: [''],
    expectedBudget: [''],
    lookingProfessorGuidance: ['Y'],
    lookingMentorship: ['Y'],
    lookingStudentPartner: ['Y'],
    lookingSponsorship: ['Y'],
    userDetails: this.fb.group(this.getLoggedInUserObject()),

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
    email: ['', Validators.required],
    contactnumber: ['', Validators.required],
    title: ['', Validators.required],
    abstract: ['', Validators.required],
    subtechnology: ['1', Validators.required],
    technology: ['1', Validators.required],

    paidArticle: ['Y'],
    cost: [''],
    publicationlink: [''],
    userDetails: this.fb.group(this.getLoggedInUserObject()),
    articleType: ['Article', Validators.required],
    agreeTermsAndConditions: [false, Validators.required],
    publicationSelector: ['1'],
    publicationFileUpload: ['']
  });

  onCreateTechArticleFormSubmit() {
    this.createTechArticleForm.value.userDetails = this.getLoggedInUserObject();
    console.warn(this.createTechArticleForm.value);
    this.http.post(this.endpoint + 'createTechArticle.php', this.createTechArticleForm.value, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/createTechArticle.php', this.createTechArticleForm.value,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['techarticledetailsQuery'] == 'done') {
        alert('Tech Article Created');
        document.getElementById("closeCreateTechArticleModal").click();
        location.reload();
      } else if (parsedData['techarticledetailsQuery'] == 'failed') {
        alert('Tech Article creation Failed');

      }

    });
  }

  onCreateStuvationFormSubmit() {
    this.createStuvationForm.value.userDetails = this.getLoggedInUserObject();
    console.warn(this.createStuvationForm.value);
    this.http.post(this.endpoint + 'createStuvation.php', this.createStuvationForm.value, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/createTechArticle.php', this.createTechArticleForm.value,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['stuvationdetailsquery'] == 'done') {
        alert('Stuvation has been sent for Admin Approval. After confirmation it will be reflected.');
        document.getElementById("closeCreateStuvationFormModal").click();
        location.reload();
      } else if (parsedData['stuvationdetailsquery'] == 'failed') {
        alert('Stuvation creation Failed');

      }

    });
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
    this.http.post(this.endpoint + 'createEngship.php', this.createEngshipForm.value, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
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

  onCreateTechTeachFormSubmit() {
    this.createTechTeachForm.value.userDetails = this.getLoggedInUserObject();
    console.warn(this.createTechTeachForm.value);
    //this.http.post('http://localhost/services/createTechTeach.php', this.createTechTeachForm.value,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
    this.http.post(this.endpoint + 'createTechTeach.php', this.createTechTeachForm.value, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['techteachdetailsQuery'] == 'done') {
        alert('Tech Teach Created');
        this.fileUploaderTechArticle.uploadAll();
        document.getElementById("closeCreateTechTeachModal").click();
        location.reload();
        this.createTechTeachForm.reset();
      } else if (parsedData['techteachdetailsQuery'] == 'failed') {
        alert('Tech Teach creation Failed');

      }

    });
  }

  onCreateTechTalkFormSubmit() {
    this.createTechTalkForm.value.userDetails = this.getLoggedInUserObject();
    console.warn(this.createTechTeachForm.value);
    this.http.post(this.endpoint + 'createTechTalk.php', this.createTechTalkForm.value, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/createTechTalk.php', this.createTechTalkForm.value,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['techtalkdetailsQuery'] == 'done') {
        alert('Tech Talk Created');
        location.reload();
        document.getElementById("closeCreateTechTalkModal").click();
        this.createTechTalkForm.reset();
      } else if (parsedData['techtalkdetailsQuery'] == 'failed') {
        alert('Tech Talk creation Failed');

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

  closeLoginBox(): void {
    console.log('closeLoginBox');
    document.getElementById("closeLoginForm").click();
  }

  loginForm = this.fb.group({
    username: ['', Validators.required],
    //email: ['asd1', Validators.required],
    password: ['', Validators.required],
    rememberMe: false
  });

  onLoginFormSubmit() {
    console.warn(this.loginForm.value);

    this.http.post(this.endpoint + 'login.php', this.loginForm.value, { headers: {}, responseType: 'json' }).subscribe(data => {
      //this.http.post('http://localhost:8080/edubee/login.php', this.loginForm.value,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      this.loginForm.reset();
      if (parsedData['loginStatus'] == 'successful') {
        //alert('Logged In Successfully');
        sessionStorage.setItem("loggedInUserName", JSON.stringify(parsedData));
        console.log(sessionStorage.getItem("loggedInUserName"));
        document.getElementById("closeLoginForm").click();
        this.ngOnInit();
      } else if (parsedData['loginStatus'] == 'failed') {
        alert('Incorrect Username/Email or Password. Please Try Again !!');
      } else if (parsedData['loginStatus'] == 'unverified') {
        alert('Kindly verify your email address in order to proceed !!');
      }
    });
  }

  studentRegistrationForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    contact: ['', Validators.required],
    dob: ['01/01/1994', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirmpassword: ['', Validators.required],
    schoolname: ['asd', Validators.required],
    schoolcity: ['1', Validators.required],
    schoolstate: ['1', Validators.required],
    college: ['sv', Validators.required],
    collegecity: ['1', Validators.required],
    collegestate: ['1', Validators.required],
    collegebranch: ['asf', Validators.required],
    miniprojecttitle: ['asd', Validators.required],
    miniprojectdescription: ['we', Validators.required],
    majorprojecttitle: ['q', Validators.required],
    majorprojectdescription: ['gg', Validators.required],
    technologies: ['hh', Validators.required],
    skills: ['tt', Validators.required],
    profilePicture: ['', Validators.required],
    agreeTermsAndConditions: [false, Validators.required]

  });

  engineerRegistrationForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    contact: ['', Validators.required],
    dob: ['01/01/1994', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirmpassword: ['', Validators.required],
    schoolname: ['asd', Validators.required],
    schoolcity: ['1', Validators.required],
    schoolstate: ['1', Validators.required],
    college: ['sv', Validators.required],
    collegecity: ['1', Validators.required],
    collegestate: ['1', Validators.required],
    collegebranch: ['asf', Validators.required],
    miniprojecttitle: ['asd', Validators.required],
    miniprojectdescription: ['we', Validators.required],
    majorprojecttitle: ['q', Validators.required],
    majorprojectdescription: ['gg', Validators.required],
    technologies: ['hh', Validators.required],
    skills: ['tt', Validators.required],
    profilePicture: ['', Validators.required],
    agreeTermsAndConditions: [false, Validators.required],
    workExperience: this.fb.array([
      this.fb.group({
        role: [''],
        companyName: [''],
        yearsOfExperience: ['']
      })
    ])
  });

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
    console.warn(this.engineerRegistrationForm.value);
    let headers = new Headers({ 'Content-Type': 'multipart/form-data' });

    this.http.post(this.endpoint + 'engineerRegistration.php', this.engineerRegistrationForm.value, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //  this.http.post('http://localhost:8080/edubee/engineerRegistration.php', this.engineerRegistrationForm.value,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      this.engineerRegistrationForm.reset();
      if (parsedData['userAlreadyExists'] == 'true') {
        alert('User Already Exists');
      } else if (parsedData['profieCreationStatus'] == 'successful') {
        this.userid = parsedData['userid'];
        console.log(this.userid);
        alert('Profile Created Successfully');
        this.uploader.uploadAll();
        document.getElementById("closeEngineerRegistrationForm").click();
      } else if (parsedData['profieCreationStatus'] == 'partiallySuccessful') {
        alert('Partially Profile Created');
      }

    });
  }

  onStudentRegistrationFormSubmit() {
    console.warn(this.studentRegistrationForm.value);
    this.studentRegistrationForm.reset();
    let headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    this.http.post(this.endpoint + 'studentRegistration.php', this.studentRegistrationForm.value, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //  this.http.post('http://localhost:8080/edubee/studentRegistration.php', this.studentRegistrationForm.value,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      this.studentRegistrationForm.reset();
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['userAlreadyExists'] == 'true') {
        alert('User Already Exists');
      } else if (parsedData['profieCreationStatus'] == 'successful') {
        this.userid = parsedData['userid'];
        console.log(this.userid);
        alert('Profile Created Successfully');
        this.uploader.uploadAll();
        document.getElementById("closeStudentRegistrationForm").click();
      } else if (parsedData['profieCreationStatus'] == 'partiallySuccessful') {
        alert('Partially Profile Created');
      }
      /*   let _formData = new FormData();
      _formData.append("Name", this.studentRegistrationForm.value.email);
      _formData.append("MyFile", this.studentRegistrationForm.value.profilePicture);
      let body = _formData;
      let headers = new Headers();
     
      this._http.post("http://localhost/services/profilePictureUpload.php", body, {
        headers: headers
    })
        .subscribe((data) => this.message = data);
        */
    });

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
