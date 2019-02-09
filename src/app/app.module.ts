import { BotDetectCaptchaModule } from 'angular-captcha';
import { FullCalendarModule } from 'ng-fullcalendar';import { FilterPipeModule } from 'ngx-filter-pipe'; 
 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { zip } from 'rxjs';
import { HomeComponent } from './home/home.component';
import { TechBankComponent } from './tech-bank/tech-bank.component';
import { TechArticleComponent } from './tech-article/tech-article.component';
import { FilterPipe } from './filter.pipe';
import { FileUploadModule } from 'ng2-file-upload';
import { AdminComponent } from './admin/admin.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { StuvationComponent } from './stuvation/stuvation.component';
import { EngshipComponent } from './engship/engship.component';
import { CityChapterComponent } from './city-chapter/city-chapter.component';
import { CollegeChapterComponent } from './college-chapter/college-chapter.component';
import { MembershipComponent } from './membership/membership.component';
import { CertificationsComponent } from './certifications/certifications.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CareersComponent } from './careers/careers.component';
import { FaqsComponent } from './faqs/faqs.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { EngshipRequestComponent } from './engship-request/engship-request.component';
//import { Ng2UploaderModule } from 'ng2-uploader';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'techevent', component: TechBankComponent },
  { path: 'techbank', component: TechArticleComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'myprofile', component: MyprofileComponent },
  { path: 'stuvation', component: StuvationComponent },
  { path: 'engship', component: EngshipComponent },
  { path: 'cityChapter', component: CityChapterComponent },
  { path: 'engshipRequest', component: EngshipRequestComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    TechBankComponent,
    TechArticleComponent,
    FilterPipe,
    AdminComponent,
    MyprofileComponent,
    StuvationComponent,
    EngshipComponent,
    CityChapterComponent,
    CollegeChapterComponent,
    MembershipComponent,
    CertificationsComponent,
    ContactUsComponent,
    CareersComponent,
    FaqsComponent,
    PrivacyPolicyComponent,
    EngshipRequestComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    CommonModule,
    FormsModule,
    FilterPipeModule,
    NgbModalModule.forRoot(),
    NgbModule.forRoot(),
    CalendarModule.forRoot(),
    RouterModule.forRoot(appRoutes, {useHash: true, enableTracing: true }),
    HttpClientModule,
    FullCalendarModule,
    ReactiveFormsModule,
    HttpModule,
    FileUploadModule
  //  DemoUtilsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
