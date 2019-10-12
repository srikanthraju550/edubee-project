import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit
} from '@angular/core';
import { MainServiceService } from '../main-service.service';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
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
// import $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#33099e',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  lightblue: {
    primary: '#0062cc',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  calendarOptions: Options;
  displayEvent: any;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  sliderValue = 1;
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

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;
  message: Response;
  techTitle = 'Tech Teach';
  showTechTeach = true;
  showTechTalk = false;
  showAcadamicProz = false;
  showStuation = false;
  showProzMe = false;
  showEngship = false;
  filterquickRegData: any;


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
    //this.handleEvent('Dropped or resized', event);
    this.refresh.next();

  }


  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'lg' });
  }
  viewMoreClicked = false;
  viewMoreClickChange(): void {
    this.viewMoreClicked = !this.viewMoreClicked;
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

  constructor(private modal: NgbModal, private http: Http, private fb: FormBuilder, private _http: Http, private mainService: MainServiceService) { }
  sliderContent: any = [];
  //homePageDataFromService=[];
  homePageContent: any = [];
  teamDetails: any = [];
  url;
  getHomePageCounterValues;
  quickRegData = [];

  endpoint: string = "http://theengineersfactory.com/dashboard/";


  // endpoint: string = "../assets/services/";
  // endpoint: string = "../assets/services/";

  loadMe;
  calenderData = [];
  data = [];
  todayDaate;
  today;
  allEventsCount;
  techtalkdetails = [];
  techteachdetails = [];
  selCal = 'tech teach';
  calenderDataForCalender = [];
  viewAllData = [];
  image_path;
  aboutData;
  profile_path;
  date;
  dataDate;
  ngOnInit(): void {

    //dummy  code ends
    this.viewAllData = [];
    this.loadMe = true;
    this.http.get(this.endpoint + 'home_page_content').subscribe(data => {

      this.sliderContent = data.json().banners_data;
      this.image_path = data.json().image_path;
      this.profile_path = data.json().profile_image_path
      this.quickRegData = data.json().quick_registration;
      this.filterquickRegData = this.quickRegData[0];
      this.teamDetails = data.json().student_thoughts;
      // this.homePageContent = data['3'].homePageData;
      // this.getHomePageCounterValues = data['12'].getHomePageCounterValues[0];
      this.techtalkdetails = data.json().tech_talk_details;
      this.techteachdetails = data.json().tech_teach_details;
      this.aboutData = data.json().about_us[0];
      console.log(this.aboutData);
      for (var i = 0; i < this.techteachdetails.length; i++) {
        var eventObject = {
          // start: subDays(startOfDay(new Date(this.techteachdetails[i].start_date)), 1),
          // end: addDays(new Date(this.techteachdetails[i].end_date), 1),
          start: new Date(this.techteachdetails[i].event_date),
          end: new Date(this.techteachdetails[i].event_date),
          title: 'Tech Teach Topic : ' + this.techteachdetails[i].topic,
          color: colors.blue
        };
        this.events.push(eventObject);
      }

      this.refresh.next();
      this.calendarOptions = {
        editable: true,
        eventLimit: false,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,listMonth'
        },

        events: this.techteachdetails
      };
      this.today = new Date();
      this.todayDaate = this.today.getDate();
      // this.calenderDataForCalender = this.techtalkdetails;

      this.date = new Date();
      for (var i = 0; i < this.techteachdetails.length; i++) {
        this.dataDate = new Date(this.techteachdetails[i].event_date);
        if (this.date.getMonth() + 1 === this.dataDate.getMonth() + 1) {
          this.calenderDataForCalender.push(this.techteachdetails[i]);
        }
      }
      this.allEventsCount = this.techteachdetails.length + this.techtalkdetails.length;
    });
    this.counterValues();
  }


  previousMnth(date) {
    this.calenderDataForCalender = [];
    this.date = new Date(date);
    for (var i = 0; i < this.techteachdetails.length; i++) {
      this.dataDate = new Date(this.techteachdetails[i].event_date);
      if (this.date.getMonth() + 1 === this.dataDate.getMonth() + 1) {
        this.calenderDataForCalender.push(this.techteachdetails[i]);
      }
    }
  }

  nextMnth(date) {
    this.calenderDataForCalender = [];
    this.date = new Date(date);
    for (var i = 0; i < this.techteachdetails.length; i++) {
      this.dataDate = new Date(this.techteachdetails[i].event_date);
      if (this.date.getMonth() + 1 === this.dataDate.getMonth() + 1) {
        this.calenderDataForCalender.push(this.techteachdetails[i]);
      }
    }
  }

  counter;
  counterValues() {
    this.http.get(this.endpoint + 'counters').subscribe(data => {
      this.counter = data.json();
    });
  }

  showTechTalkCal() {
    this.events = [];
    this.selCal = 'tech talk';
    this.calenderDataForCalender = [];
    for (var i = 0; i < this.techtalkdetails.length; i++) {
      this.dataDate = new Date(this.techtalkdetails[i].event_date);
      if (this.date.getMonth() + 1 === this.dataDate.getMonth() + 1) {
        this.calenderDataForCalender.push(this.techtalkdetails[i]);
      }
    }
    for (let techTalk of this.techtalkdetails) {
      var eventObject = {
        start: new Date(techTalk.event_date),
        end: new Date(techTalk.event_date),
        title: 'Tech Talk Topic : ' + techTalk.topic,
        color: colors.lightblue
      };
      // console.log(eventObject);
      this.events.push(eventObject);
    }


  }

  showTechTeachCal() {
    this.events = [];
    this.selCal = 'tech teach';
    console.log(this.techteachdetails);
    this.calenderDataForCalender = [];
    for (var i = 0; i < this.techteachdetails.length; i++) {
      this.dataDate = new Date(this.techteachdetails[i].event_date);
      if (this.date.getMonth() + 1 === this.dataDate.getMonth() + 1) {
        this.calenderDataForCalender.push(this.techteachdetails[i]);
      }
    }
    for (let techTeach of this.techteachdetails) {
      var eventObject = {
        start: new Date(techTeach.event_date),
        end: new Date(techTeach.event_date),
        title: 'Tech Teach Topic : ' + techTeach.topic,
        color: colors.blue
      };
      this.events.push(eventObject);
    }

  }
  allEvents = [];
  showAllEventsCal() {
    this.events = [];
    this.selCal = 'all events';
    this.allEvents = [];
    for (var i = 0; i < this.techteachdetails.length; i++) {
      this.allEvents.push(this.techteachdetails[i]);
    }
    for (var j = 0; j < this.techtalkdetails.length; j++) {
      this.allEvents.push(this.techtalkdetails[j]);
    }
    this.calenderDataForCalender = [];
    for (var i = 0; i < this.allEvents.length; i++) {
      this.dataDate = new Date(this.allEvents[i].event_date);
      if (this.date.getMonth() + 1 === this.dataDate.getMonth() + 1) {
        this.calenderDataForCalender.push(this.allEvents[i]);
      }
    }


    for (let techTalk of this.techtalkdetails) {
      var eventObject = {
        start: new Date(techTalk.event_date),
        end: new Date(techTalk.event_date),
        title: 'Tech Talk Topic : ' + techTalk.topic,
        color: colors.lightblue
      };
      // console.log(eventObject);
      this.events.push(eventObject);
    }

    for (let techTeach of this.techteachdetails) {
      var eventObject = {
        start: new Date(techTeach.event_date),
        end: new Date(techTeach.event_date),
        title: 'Tech Teach Topic : ' + techTeach.topic,
        color: colors.blue
      };
      this.events.push(eventObject);
    }
  }


  closeLoginBox(): void {
    console.log('closeLoginBox');
    document.getElementById("closeLoginForm").click();
  }







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

  checkLoginStatus(): boolean {
    return this.mainService.checkLoginStatus();
  }

  getLoggedInUserObject(): JSON {
    return this.mainService.getLoggedInUserObject();
  }

  logout(): void {
    this.mainService.logout();
  }


  showData(action) {
    this.techTitle = action;
    for (var i = 0; i < this.quickRegData.length; i++) {
      if (this.techTitle === this.quickRegData[i].title) {
        this.filterquickRegData = this.quickRegData[i];
      }
    }

  }



  firstSlide = true;
  secondSlide = false;

  decreaseSlider() {
    if (this.sliderValue === 1) {
      return;
    }
    this.sliderValue = this.sliderValue - 1;

    if (this.sliderValue === 1) {
      this.firstSlide = true;
      this.secondSlide = false;
    }
  }
  increaseSlider() {
    if (this.sliderValue === 2) {
      return;
    }
    this.sliderValue = this.sliderValue + 1;

    if (this.sliderValue === 2) {
      this.firstSlide = false;
      this.secondSlide = true;
    }


  }


}
