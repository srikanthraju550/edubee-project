import { Component, OnInit } from '@angular/core';
import { NgbModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { MainServiceService } from '../main-service.service';
import { Validators, FormBuilder, FormArray, FormControl } from '../../../node_modules/@angular/forms';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
import { ExcelService } from '../export-excel';
import * as jspdf from 'jspdf';
import * as jsPDF from 'jspdf';
import { Router, ActivatedRoute, Params } from '@angular/router';




@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent implements OnInit {

  techarticledetails: any = [];
  techtalkdetails: any;
  techteachdetails: any;
  profileInformation: any;
  cityconfig: any = [];
  stateconfig: any = [];
  profilePageCounterValues;
  hidediv: boolean;
  editButton: boolean;
  user_id;
  endpoint: string = "../assets/services/";
  url: string = "http://theengineersfactory.com/dashboard/";
  public pdfurl;
  public userData = {
    stuvation: {
      mini_project_count: '',
      major_project_count: '',
      stuation_count: ''
    },
    tech_bank: {
      research_paper_count: '',
      white_paper_count: '',
      article_count: ''
    },
    tech_talk: {
      tech_talk_count: '',
      tech_teach_count: '',
      work_shop_count: '',
      trainings_count: ''
    }
  };
  public profileData;
  public userImage;
  excelData = [];
  imagePath;
  grade;
  userDetails: any;
  userImagePath;
  filePAth;
  turl = '';
  iurl = '';
  public strImage;
  showEdit: boolean;
  imageUrl = '';
  internshipDetails: boolean;

  public engineerRegistrationForm;

  constructor(private httpnew: Http, private route: ActivatedRoute, private router: Router, private excelService: ExcelService, private modal: NgbModal, private http: HttpClient, private mainService: MainServiceService, private fb: FormBuilder) {
    this.userDetails = this.getLoggedInUserObject();
    this.engineerRegistrationForm = this.fb.group({
      name: [''],
      email: [''],
      contact: [''],
      dob: [''],
      school: [''],
      college: [''],
      branch: [''],
      miniProjectTitle: [''],
      miniProjectDescription: [''],
      majorProjecTtitle: [''],
      majorProjectDescription: [''],
      internRole: [''],
      internCompany: [''],
      internDurationFrom: [''],
      internDurationTo: [''],
      internCerftification: [''],
      skills: [''],
      skillDescription: [''],
      trainingRole: [''],
      trainingCompany: [''],
      trainingDurationFrom: [''],
      trainingDurationTo: [''],
      trainingCertification: [''],
    });
    this.profileData = {
      intern_certificate: '',
      certificate2: '',
      image: '',
      name: ''
    };
    this.route.params.subscribe((params: Params) => {
      this.user_id = params['id'];
      if (this.user_id == this.userDetails['user_id']) {
        this.editButton = true;
      } else {
        this.editButton = false;
      }
      if (document.getElementById("closeCommentsModal").click() != null) {
        document.getElementById("closeCommentsModal").click();
      };
    });

    if (this.userDetails != undefined) {
      this.userImagePath = sessionStorage.getItem('userImagePath');
      this.getUserData();
    } else {
      this.router.navigate(['/home'])
    }
  }

  readUrl(event: any, action) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.strImage = (<FileReader>event.target).result;
        if (action === 'training') {
          this.turl = this.strImage.split(',')[1];
        } else if (action === 'image') {
          this.imageUrl = this.strImage.split(',')[1];
          this.profileData.image = this.strImage;
          this.userImage = this.strImage;
        } else {
          this.iurl = this.strImage.split(',')[1];
        }
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }


  // editProfile() {
  //   this.editButton = true;
  //   this.showEdit = true;
  // }

  showinternship() {
    this.internshipDetails = true;
  }
  nointernship() {
    this.internshipDetails = false;
  }

  ngOnInit() {
    this.pdfurl = this.url + 'get_profile_pdf/' + this.user_id;
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.excelData, 'Profile-data');
  }
  public techteachlength;

  getUserData() {
    this.httpnew.get(this.url + 'user-profile' + '?user_id=' + this.user_id).subscribe(data => {
      this.excelData = data.json().data;
      this.userData = data.json();
      this.techteachlength = this.userData['tech_teach'].length
      this.profileData.intern_certificate = data.json().data[0].intern_certificate;
      this.profileData.certificate2 = data.json().data[0].certificate2;

      var sessionUserImage = sessionStorage.getItem('userProfileImage');
      this.userImage = sessionUserImage !== '' ? sessionUserImage : data.json().data[0].image;
      this.profileData.image = this.userImage != '' ? this.userImage : data.json().image_path + data.json().data[0].image;
      this.profileData.name = data.json().data[0].name;

      this.filePAth = data.json().file_path;
      this.imagePath = data.json().image_path;
      this.strImage = this.profileData.image;
      this.grade = parseInt(data.json().data[0].join_event_score) + parseInt(data.json().data[0].stuvation_score) + parseInt(data.json().data[0].tech_talk_score) + parseInt(data.json().data[0].tech_teach_score)
      // sessionStorage.setItem("userImagePath", this.imagePath + this.profileData.image);

      console.log(this.profileData);
      this.engineerRegistrationForm = this.fb.group({
        name: [data.json().data[0].name],
        email: [data.json().data[0].email],
        contact: [data.json().data[0].mobile],
        dob: [data.json().data[0].dob],
        school: [data.json().data[0].school],
        college: [data.json().data[0].college],
        branch: [data.json().data[0].branch],
        miniProjectTitle: [data.json().data[0].mini_project_title],
        miniProjectDescription: [data.json().data[0].mini_project_desc],
        majorProjecTtitle: [data.json().data[0].major_project_title],
        majorProjectDescription: [data.json().data[0].major_project_desc],
        internRole: [data.json().data[0].intern_role],
        internCompany: [data.json().data[0].intern_company],
        internDurationFrom: [data.json().data[0].intern_from],
        internDurationTo: [data.json().data[0].intern_to],
        internCerftification: [data.json().data[0].intern_certificate],
        skills: [data.json().data[0].skills],
        skillDescription: [data.json().data[0].skill_desc],
        trainingRole: [data.json().data[0].training_role],
        trainingCompany: [data.json().data[0].training_company],
        trainingDurationFrom: [data.json().data[0].training_from],
        trainingDurationTo: [data.json().data[0].training_to],
        trainingCertification: [data.json().data[0].certificate2],

      });
    });
    console.log(this.engineerRegistrationForm);
  }



  editProfileChanges() {

    // stop here if form is invalid
    if (this.engineerRegistrationForm.invalid) {
      alert('Required fields Missing, Please fill * marks fields');
      return;
    }

    let userDetails = this.getLoggedInUserObject();
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });


    var params =
      'user_id=' + userDetails['user_id'] +
      '&email=' + this.engineerRegistrationForm.value.email +
      '&name=' + this.engineerRegistrationForm.value.name +
      '&profile_image=' + (this.imageUrl === undefined ? '' : this.imageUrl) +
      '&mobile=' + this.engineerRegistrationForm.value.contact +
      '&dob=' + this.engineerRegistrationForm.value.dob +
      '&school=' + this.engineerRegistrationForm.value.school +
      '&college=' + this.engineerRegistrationForm.value.college +
      '&branch=' + this.engineerRegistrationForm.value.branch +
      '&mini_project_title=' + this.engineerRegistrationForm.value.miniProjectTitle +
      '&mini_project_desc=' + this.engineerRegistrationForm.value.miniProjectDescription +
      '&major_project_title=' + this.engineerRegistrationForm.value.majorProjecTtitle +
      '&major_project_desc=' + this.engineerRegistrationForm.value.majorProjectDescription +
      '&intern_role=' + this.engineerRegistrationForm.value.internRole +
      '&intern_company=' + this.engineerRegistrationForm.value.internCompany +
      '&intern_from=' + this.engineerRegistrationForm.value.internDurationFrom +
      '&intern_to=' + this.engineerRegistrationForm.value.internDurationTo +
      '&intern_certificate=' + (this.iurl === undefined ? '' : this.iurl) +
      '&skills=' + this.engineerRegistrationForm.value.skills +
      '&skill_desc=' + this.engineerRegistrationForm.value.skillDescription +
      '&training_role=' + this.engineerRegistrationForm.value.trainingRole +
      '&training_company=' + this.engineerRegistrationForm.value.trainingCompany +
      '&training_from=' + this.engineerRegistrationForm.value.trainingDurationFrom +
      '&training_to=' + this.engineerRegistrationForm.value.trainingDurationTo +
      '&certificate2=' + (this.turl === undefined ? '' : this.turl)




    this.httpnew.post(this.url + 'edit-profile', params, { headers: headers }).subscribe(res => {
      if (res.json().status === true) {
        console.log('userimagepath', sessionStorage.getItem('userImagePath'));
        sessionStorage.setItem("userProfileImage", this.profileData.image);
        // alert(res.json().message);
        document.getElementById("closeCreateTechTeachModal").click();
        this.getUserData();
        window.location.reload();


        // this.showEdit = false;
      } else {
        alert(res.json().message.error);
      }
    }, (err) => {
      alert(err.json().message.error);
    })
  }



  html2text(html) {
    var tag = document.createElement('div');
    tag.innerHTML = html;

    return tag.innerText;
  }




  collegecitylist: any = [];
  schoolcitylist: any = [];
  updateCityList(stateid, listname) {
    console.log(stateid);
    if (listname == 'college')
      this.collegecitylist = this.cityconfig.filter(obj => {
        console.log(obj.stateid);
        return obj.stateid === stateid;
      })

    if (listname == 'school')
      this.schoolcitylist = this.cityconfig.filter(obj => {
        console.log(obj.stateid);
        return obj.stateid === stateid;
      })
  }

  getStateName(id) {
    Array.prototype.forEach.call(this.stateconfig, child => {
      if (child.id == id) {
        console.log(child);
        return child.statename;
      }

    });
  }

  getCityName(id) {
    Array.prototype.forEach.call(this.cityconfig, child => {
      if (child.id == id) {
        console.log(child.cityname);
        return child.cityname;
      }
    });
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
