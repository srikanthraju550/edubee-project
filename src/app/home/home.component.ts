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
    primary: '#07567F',
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
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  calendarOptions: Options;
  displayEvent: any;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

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

  constructor(private modal: NgbModal, private http: HttpClient, private fb: FormBuilder, private _http: Http, private mainService: MainServiceService) { }
  sliderContent: any = [];
  //homePageDataFromService=[];
  homePageContent: any = [];
  teamDetails: any = [];
  url;
  getHomePageCounterValues;

  endpoint: string = "http://localhost/services/";

  loadMe;
  calenderData = [];
  data = [];
  ngOnInit(): void {

    this.loadMe = true;
    //document.getElementById('signupDropdown2').click();document.getElementById('signupDropdown2').click();
    //this.http.get('http://localhost/services/getHomePageContent.php'+"/random="+new Date().getTime()).subscribe(data => {
    this.http.get(this.endpoint + 'getHomePageContent.php' + "/random=" + new Date().getTime()).subscribe(data => {

      this.sliderContent = data['0'].sliderContent;
      this.teamDetails = data['1'].teamDetails;
      this.homePageContent = data['3'].homePageData;
      this.getHomePageCounterValues = data['12'].getHomePageCounterValues[0];
      var techtalkdetails = data['4'].techtalkdetails;
      var techteachdetails = data['5'].techteachdetails;
      for (let techTalk of techtalkdetails) {
        var eventObject = {
          start: new Date(techTalk.venuedate),
          end: new Date(techTalk.venuedate),
          title: 'Tech Talk Topic : ' + techTalk.techtalktopic,
          color: colors.lightblue
        };
        // console.log(eventObject);
        this.events.push(eventObject);
      }

      for (let techTeach of techteachdetails) {
        var eventObject = {
          start: new Date(techTeach.venuedate),
          end: new Date(techTeach.venuedate),
          title: 'Tech Teach Topic : ' + techTeach.topic,
          color: colors.blue
        };
        this.events.push(eventObject);
      }


      // console.log(this.getHomePageCounterValues);

      this.refresh.next();



      //dummy service...................................
      const dateObj = new Date();
      const yearMonth = dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1);
      this.data.push({
        title: 'All Day Event',
        start: yearMonth + '-01'
      },
        {
          title: 'Long Event',
          start: yearMonth + '-07',
          end: yearMonth + '-10'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: yearMonth + '-09T16:00:00'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: yearMonth + '-16T16:00:00'
        },
        {
          title: 'Conference',
          start: yearMonth + '-11',
          end: yearMonth + '-13'
        },
        {
          title: 'Meeting',
          start: yearMonth + '-12T10:30:00',
          end: yearMonth + '-12T12:30:00'
        },
        {
          title: 'Lunch',
          start: yearMonth + '-12T12:00:00'
        },
        {
          title: 'Meeting',
          start: yearMonth + '-12T14:30:00'
        },
        {
          title: 'Happy Hour',
          start: yearMonth + '-12T17:30:00'
        },
        {
          title: 'Dinner',
          start: yearMonth + '-12T20:00:00'
        },
        {
          title: 'Birthday Party',
          start: yearMonth + '-13T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: yearMonth + '-28'
        });


      console.log(this.calenderData);

      this.calendarOptions = {
        editable: true,
        eventLimit: false,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,listMonth'
        },
        events: this.data
      };
    });




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
  techTitle = 'Tech Teach';
  showTechTeach = true;
  showTechTalk = false;
  showAcadamicProz = false;
  showStuation = false;
  showProzMe = false;
  showEngship = false;

  showData(action) {
    this.techTitle = action;
    if (action === 'Tech Teach') {
      this.showTechTeach = true;
      this.showTechTalk = false;
      this.showAcadamicProz = false;
      this.showStuation = false;
      this.showProzMe = false;
      this.showEngship = false;
    } else if (action === 'Tech Talk') {
      this.showTechTeach = false;
      this.showTechTalk = true;
      this.showAcadamicProz = false;
      this.showStuation = false;
      this.showProzMe = false;
      this.showEngship = false;
    } else if (action === 'Academic Proz') {
      this.showTechTeach = false;
      this.showTechTalk = false;
      this.showAcadamicProz = true;
      this.showStuation = false;
      this.showProzMe = false;
      this.showEngship = false;
    } else if (action === 'Stuvation') {
      this.showTechTeach = false;
      this.showTechTalk = false;
      this.showAcadamicProz = false;
      this.showStuation = true;
      this.showProzMe = false;
      this.showEngship = false;
    } else if (action === 'Eng-Ship') {
      this.showTechTeach = false;
      this.showTechTalk = false;
      this.showAcadamicProz = false;
      this.showStuation = false;
      this.showProzMe = false;
      this.showEngship = true;
    } else if (action === 'Prozect Me') {
      this.showTechTeach = false;
      this.showTechTalk = false;
      this.showAcadamicProz = false;
      this.showStuation = false;
      this.showProzMe = true;
      this.showEngship = false;
    }
  }
}
