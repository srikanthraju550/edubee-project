import { Component, OnInit } from '@angular/core';
import { NgbModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { MainServiceService } from '../main-service.service';
import { Validators, FormBuilder, FormArray, FormControl } from '../../../node_modules/@angular/forms';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent implements OnInit {
  studentRegistrationForm = this.fb.group({
    name: ['asd', Validators.required],
    email: ['asd1', Validators.required],
    contact: ['4325', Validators.required],
    dob: ['07/13/1994', Validators.required],
    username: ['asda', Validators.required],
    password: ['qwe', Validators.required],
    confirmpassword: ['qwe', Validators.required],
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

  });;
  techarticledetails: any = [];
  techtalkdetails: any;
  techteachdetails: any;
  profileInformation:any;
  cityconfig: any = [];
  stateconfig: any = [];
  profilePageCounterValues;
  
  endpoint: string="../assets/services/"
  constructor(private modal: NgbModal, private http: HttpClient, private mainService: MainServiceService, private fb: FormBuilder) { }
  userDetails:any;
  ngOnInit() {
    this.userDetails = this.getLoggedInUserObject();
    var url = this.endpoint+'getProfilePageContent.php'+"/random="+new Date().getTime();
    if(!this.checkLoginStatus())
        url+="?userid="+this.userDetails['userid'];
        console.log(url);
    this.http.get(url).subscribe(data => {
      console.log(data);
      this.profileInformation= data['1'].profileInformation[0];
      this.stateconfig= data['2'].stateconfig;
      this.cityconfig= data['3'].cityconfig;
      this.profilePageCounterValues= data['4'].profilePageCounterValues[0];
      console.log(this.profileInformation);
      console.log(this.stateconfig);
      console.log(this.profilePageCounterValues);
      
      this.profilePageCounterValues['totalScore']=
      (this.profilePageCounterValues['@researchPaperCount']*20)
      +(this.profilePageCounterValues['@whitePaperCount']*10)
      +(this.profilePageCounterValues['@articleCount']*5)
      +(this.profilePageCounterValues['@techTalkCount']*10)
      +(this.profilePageCounterValues['@techMeetCount']*10)
      +(this.profilePageCounterValues['@workshopCount']*20)
      +(this.profilePageCounterValues['@trainingsCount']*20)
      +(this.profilePageCounterValues['@miniProjectCount']*20)
      +(this.profilePageCounterValues['@majorProjectCount']*50)
      +(this.profilePageCounterValues['@stuvationCount']*100)
      +(this.profilePageCounterValues['@projectsCount']*20)
      +(this.profilePageCounterValues['@internshipCount']*20)
      +(this.profilePageCounterValues['@scholarshipCount']*20)
      +(this.profilePageCounterValues['@mentorshipCount']*20)
      ;
      
      console.log(this.userDetails);
      console.log(this.getCityName(this.profileInformation.schoolcityid));
      if(this.userDetails['usertype']=='student'){
        this.studentRegistrationForm = this.fb.group({
          name: [ this.profileInformation.name,Validators.required],
          email: [this.profileInformation.emailaddress, Validators.required],
          contact: [this.profileInformation.contactnumber, Validators.required],
          dob: [this.profileInformation.dob, Validators.required],
          schoolname: [this.profileInformation.school, Validators.required],
          schoolcity: [this.profileInformation.schoolcityid, Validators.required],
          schoolstate: [this.profileInformation.schoolstateid, Validators.required],
          college: [this.profileInformation.college, Validators.required],
          collegecity: [this.profileInformation.collegecityid, Validators.required],
          collegestate: [this.profileInformation.collegestateid, Validators.required],
          collegebranch: [this.profileInformation.branch, Validators.required],
          miniprojecttitle: [this.profileInformation.miniprojecttitle, Validators.required],
          miniprojectdescription: [this.profileInformation.miniprojectdescription, Validators.required],
          majorprojecttitle: [this.profileInformation.majorprojecttitle, Validators.required],
          majorprojectdescription: [this.profileInformation.majorprojectdescription, Validators.required],
          technologies: [this.profileInformation.technologylist, Validators.required],
          skills: [this.profileInformation.skillslist, Validators.required],
          userId: [this.userDetails['userid']]
      
        });
        this.updateCityList(this.studentRegistrationForm.value.collegestate, 'college');
        this.updateCityList(this.studentRegistrationForm.value.schoolstate, 'school');
        console.log(this.studentRegistrationForm);
      }else{
        this.engineerRegistrationForm = this.fb.group({
          name: [ this.profileInformation.name,Validators.required],
          email: [this.profileInformation.emailaddress, Validators.required],
          contact: [this.profileInformation.contactnumber, Validators.required],
          dob: [this.profileInformation.dob, Validators.required],
          schoolname: [this.profileInformation.school, Validators.required],
          schoolcity: [this.profileInformation.schoolcityid, Validators.required],
          schoolstate: [this.profileInformation.schoolstateid, Validators.required],
          college: [this.profileInformation.college, Validators.required],
          collegecity: [this.profileInformation.collegecityid, Validators.required],
          collegestate: [this.profileInformation.collegestateid, Validators.required],
          collegebranch: [this.profileInformation.branch, Validators.required],
          miniprojecttitle: [this.profileInformation.miniprojecttitle, Validators.required],
          miniprojectdescription: [this.profileInformation.miniprojectdescription, Validators.required],
          majorprojecttitle: [this.profileInformation.majorprojecttitle, Validators.required],
          majorprojectdescription: [this.profileInformation.majorprojectdescription, Validators.required],
          technologies: [this.profileInformation.technologylist, Validators.required],
          skills: [this.profileInformation.skillslist, Validators.required],
          userId: [this.userDetails['userid']]
      
        });
        this.updateCityList(this.engineerRegistrationForm.value.collegestate, 'college');
        this.updateCityList(this.engineerRegistrationForm.value.schoolstate, 'school');
        console.log(this.engineerRegistrationForm);
      }
      
    });  
  }

  onEngineerRegistrationFormSubmi(){
    console.warn(this.engineerRegistrationForm.value);
    let headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    
    this.http.post(this.endpoint + 'engineerUpdateRegistration.php', this.engineerRegistrationForm.value, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //  this.http.post('http://localhost:8080/edubee/engineerRegistration.php', this.engineerRegistrationForm.value,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
        console.log(data);
        let parsedData: JSON = JSON.parse('' + data);
        console.log(parsedData);
        if (parsedData['profieUpdationStatus'] == 'successful') {
          
          alert('Profile Updated Successfully');
          
        } else if (parsedData['profieUpdationStatus'] == 'partiallySuccessful') {
          alert('Partially Profile Updated');
        }
      
    });
  }

  onStudentRegistrationFormUpdate() {
    console.warn(this.studentRegistrationForm.value);
    
    let headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    this.http.post(this.endpoint + 'studentUpdateRegistration.php', this.studentRegistrationForm.value, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'json' }).subscribe(data => {
      //  this.http.post('http://localhost:8080/edubee/studentRegistration.php', this.studentRegistrationForm.value,{headers:{'Content-Type': 'multipart/form-data'}, responseType: 'json'}).subscribe(data => {
      console.log(data);
      let parsedData: JSON = JSON.parse('' + data);
      console.log(parsedData);
      if (parsedData['profieUpdationStatus'] == 'successful') {
        
        alert('Profile Updated Successfully');
        
      } else if (parsedData['profieUpdationStatus'] == 'partiallySuccessful') {
        alert('Partially Profile Updated');
      }
      
    });

  }
  collegecitylist: any = [];
  schoolcitylist: any = [];
  updateCityList(stateid, listname) {
    console.log(stateid);
    if(listname=='college')
    this.collegecitylist = this.cityconfig.filter(obj => {
      console.log(obj.stateid);
      return obj.stateid === stateid;
    })

    if(listname=='school')
    this.schoolcitylist = this.cityconfig.filter(obj => {
      console.log(obj.stateid);
      return obj.stateid === stateid;
    })
  }

  getStateName(id){
    Array.prototype.forEach.call(this.stateconfig, child => {
      if(child.id==id){
        console.log(child);
        return child.statename;
      }
        
    });
  }

  getCityName(id){
    Array.prototype.forEach.call(this.cityconfig, child => {
      if(child.id==id){
        console.log(child.cityname);
        return child.cityname;
      }
    });
  }


  engineerRegistrationForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    contact: ['', Validators.required],
    dob: ['', Validators.required],
    username: ['', Validators.required],
    password: ['qwe', Validators.required],
    confirmpassword: ['qwe', Validators.required],
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

  checkLoginStatus(): boolean {
    return this.mainService.checkLoginStatus();
  }

  getLoggedInUserObject(): JSON {
    //console.log(this.mainService.getLoggedInUserObject());
    return this.mainService.getLoggedInUserObject();
  }

  logout(): void {
    this.mainService.logout();
  }

}
