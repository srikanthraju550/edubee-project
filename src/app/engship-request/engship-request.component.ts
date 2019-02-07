import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { MainServiceService } from '../main-service.service';

@Component({
  selector: 'app-engship-request',
  templateUrl: './engship-request.component.html',
  styleUrls: ['./engship-request.component.css']
})
export class EngshipRequestComponent implements OnInit {

  endpoint: string="http://localhost/services/"
  selectedEngship: any;
  constructor(private modal: NgbModal, private http: HttpClient, private mainService : MainServiceService) {}
  sliderContent:any=[];
  //homePageDataFromService=[];
  homePageContent:any=[];
  teamDetails:any=[];
  engshipMentordetails:any=[];
  engshipMenteedetails:any=[];
  engshipMentorRequestdetails:any=[];
  engshipMenteeRequestdetails:any=[];
  ngOnInit() : void {
    //this.http.get('http://localhost/services/getHomePageContent.php'+"/random="+new Date().getTime()).subscribe(data => {
      let url=this.endpoint+'getHomePageContent.php'+"/random="+new Date().getTime();
      let userDetails = this.getLoggedInUserObject();
      if(!this.checkLoginStatus())
        url+="?userid="+userDetails['userid'];
      
     this.http.get(url).subscribe(data => {
      console.log(data);
      this.sliderContent = data['0'].sliderContent;
      this.teamDetails=data['1'].teamDetails;
      this.homePageContent=data['3'].homePageData;
      this.engshipMentordetails=data['13'].engshipMentordetails;
      this.engshipMenteedetails=data['14'].engshipMenteedetails;
      this.engshipMentorRequestdetails=data['15'].engshipMentorRequestdetails;
      this.engshipMenteeRequestdetails=data['16'].engshipMenteeRequestdetails;
      console.log(this.sliderContent);
      console.log(this.homePageContent);
      console.log(this.teamDetails);
      console.log(this.engshipMentordetails);
      console.log(this.engshipMenteedetails);
      console.log(this.engshipMentorRequestdetails);
      console.log(this.engshipMenteeRequestdetails);
    });    
  }
  engshipTechnologyFilter="";
  spendTypeFilter="";
  techFilter="";
  subTechFilter="";
  articleTypeFilter="";
  freeFilter="";
  authorFilter="";

  comments=[];
  selectMentorPopup(engshipMentorObj){
    console.log(engshipMentorObj);
    let requestObject={
      "menteeId" : this.getLoggedInUserObject()['userid'],
      "mentorId" : engshipMentorObj.mentorId,
      "engshipId" : engshipMentorObj.engshipId,
      "registereduserid" : this.getLoggedInUserObject()['userid']
    };
    console.log(requestObject);
    
    this.http.post(this.endpoint+'engshipMentorMenteeRegistration.php', requestObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
    //this.http.post('http://localhost:8080/edubee/articleUpDownCount.php', requestObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
    console.log(data);
    let parsedData:JSON=JSON.parse(''+data);
    console.log(parsedData);
    if(parsedData['engshipRegistrationQuery']=='done'){
      alert('Mentee Request Sent. Please wait for approval');
      this.ngOnInit();
    }else if(parsedData['engshipRegistrationQuery']=='failed'){
      alert('Failed Request');
    }else if(parsedData['alreadyRegistered']=='true'){
      alert('Already Joined');
    }
    
    }); 
  }

  selectMenteePopup(engshipMentorObj){
    console.log(engshipMentorObj);
    let requestObject={
      "menteeId" : engshipMentorObj.menteeId,
      "mentorId" : this.getLoggedInUserObject()['userid'],
      "engshipId" : engshipMentorObj.engshipId,
      "registereduserid" : this.getLoggedInUserObject()['userid']
    };
    console.log(requestObject);
    
    this.http.post(this.endpoint+'engshipMentorMenteeRegistration.php', requestObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
    //this.http.post('http://localhost:8080/edubee/articleUpDownCount.php', requestObject,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
    console.log(data);
    let parsedData:JSON=JSON.parse(''+data);
    console.log(parsedData);
    if(parsedData['engshipRegistrationQuery']=='done'){
      alert('Mentor Request Sent. Please wait for approval');
      this.ngOnInit();
    }else if(parsedData['engshipRegistrationQuery']=='failed'){
      alert('Failed Request');
    }else if(parsedData['alreadyRegistered']=='true'){
      alert('Already Joined');
    }
    }); 
  }

  showViewDetailsPopup(engshipMentorObj):void{
    
    this.selectedEngship = engshipMentorObj;
    console.log(this.selectedEngship);
  }

  

  checkLoginStatus(): boolean {
    return this.mainService.checkLoginStatus();
  }

  getLoggedInUserObject(): JSON {
    return this.mainService.getLoggedInUserObject();
  }

  logout():void{
    this.mainService.logout();
  }
}
