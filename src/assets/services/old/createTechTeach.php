<?php
$post = file_get_contents('php://input');
//echo $post;
$response="";
$request = json_decode($post);
$topic = $request->topic;
$abstract = $request->abstract;
$technologyArea = $request->technologyArea;
//$dob = date("Y-m-d", strtotime($request->dob));
$techteachtype=$request->techteachtype;
$technology = $request->technology;
$subtechnology = $request->subtechnology;
$venueDetails = $request->venueDetails;
$registrationDetails = $request->registrationDetails;
$expertDetails = $request->expertDetails;
$userDetails = $request->userDetails;
$userId = $userDetails->userid;
$speakerId=0;
$venueId=0;
$registrationId=0;
if(isset($userDetails)){
include("connection.php");
//echo "select userid from logindetails where emailaddress='$email'";
$response.="{";
$speakerInsertionQuery="insert into panelspeakers (name, company, speakertype, workinglocation, position, experience, createdby, updatedby) values('$expertDetails->name','$expertDetails->company','$expertDetails->speakerType','$expertDetails->worklocation','$expertDetails->position',$expertDetails->experience, $userId, $userId);";
//echo $speakerInsertionQuery;
if(mysqli_query($conn,$speakerInsertionQuery)){
    $response.='"speakerInsertionQuery":"done"';
    $speakerId = mysqli_insert_id($conn);
}else{
    $response.='"speakerInsertionQuery":"failed"';
}
$venueDate = date('Y-m-d', strtotime($venueDetails->date));
$venueInsertionQuery="insert into venuedetails (place, city, address, venuedate, fromtime, totime, createdby, updatedby) values('$venueDetails->place','$venueDetails->city','$venueDetails->address','$venueDate','$venueDetails->fromTime','$venueDetails->toTime', $userId, $userId);";
//echo $venueInsertionQuery;
if(mysqli_query($conn,$venueInsertionQuery)){
    $response.=',"venueInsertionQuery":"done"';
    $venueId = mysqli_insert_id($conn);
}else{
    $response.=',"venueInsertionQuery":"failed"';
}
$registrationInsertionQuery="insert into registrationdetails (webaddress, maxregcount, regfee, posterlink, eligibility, seatcapacity, createdby, updatedby) values('$registrationDetails->webaddress',$registrationDetails->maxregcount,$registrationDetails->regfee,'','$registrationDetails->eligibility',$registrationDetails->seatcapacity, $userId, $userId);";
//echo $registrationInsertionQuery;
if(mysqli_query($conn,$registrationInsertionQuery)){
    $response.=',"registrationInsertionQuery":"done"';
    $registrationId = mysqli_insert_id($conn);
}else{
    $response.=',"registrationInsertionQuery":"failed"';
}
$authCode = rand();
$techteachdetailsQuery="insert into techteachdetails (technology, subtechnology, expertid, originatorid, venueid, regdetailid, topic, abstract, technologyarea, createdby, updatedby, authcode, techteachtype) values($technology,$subtechnology,$speakerId,$userId,$venueId, $registrationId, '$topic','$abstract', '$technologyArea',$userId,$userId, $authCode, $techteachtype)";
//echo $techteachdetailsQuery;
$techteachId = mysqli_insert_id($conn);
$userDetailQuery= mysqli_query($conn,"select t1.userid, t1.username, t1.emailaddress, t2.name, t2.contactnumber from logindetails t1, basicinformation t2 where t1.userid=$userId and t1.userid = t2.userid");
$userDetailQueryRes=mysqli_fetch_row($userDetailQuery);
$subject="Tech Teach Created. <Approve/Decline>";
  $headers = "MIME-Version: 1.0" . "\r\n";
  $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
  $headers .= 'From: <donotreply@edubee.com>' . "\r\n";
$approveEmailUrl="http://edubee.accrosian.com/assets/services/updateTechteachStatus.php?techteachId=".$techteachId."&approvalStatus=approved&authCode=".$authCode;
$declineEmailUrl="http://edubee.accrosian.com/assets/services/updateTechteachStatus.php?techteachId=".$techteachId."&approvalStatus=declined&authCode=".$authCode;
$techteachdetail='
<span class="cardSubHeading">Originator</span>
          <br/>
          <b>Name</b> : '.$userDetailQueryRes[3].'
          <br/>
          <b>Contact Number</b> : '.$userDetailQueryRes[4].'
            <b>Event on</b> : '.$venueDate.'
          <br/>
          <b>Email</b> : '.$userDetailQueryRes[2].'
          
          <br/>
          <span class="cardSubHeading">Other Details</span>
          <br/>
          <b>Tech Teach Topic</b> : '.$topic.'
          <br/>
          <b>Abstract</b> : '.$abstract.'
          <br/>
          <b>Industrial Expert</b> : '.$expertDetails->name.'
          <br/>
          <b>No. of Years Experience</b> : '.$expertDetails->experience.'
  
  ';

  $emailContent = '<head>
  <meta http-equiv="Content-Type" content="text/html; charset=US-ASCII">
  <meta name="viewport" content="width=device-width">

</head>

<body style="-moz-box-sizing: border-box; -ms-text-size-adjust: 100%; -webkit-box-sizing: border-box; -webkit-text-size-adjust: 100%; box-sizing: border-box; color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 22px; margin: 0; min-width: 100%; padding: 0; text-align: left; width: 100% !important">
  <style type="text/css">
    body {
      width: 100% !important;
      min-width: 100%;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      margin: 0;
      padding: 0;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }

    .ExternalClass {
      width: 100%;
    }

    .ExternalClass {
      line-height: 100%;
    }

    #backgroundTable {
      margin: 0;
      padding: 0;
      width: 100% !important;
      line-height: 100% !important;
    }

    img {
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
      width: auto;
      max-width: 100%;
      clear: both;
      display: block;
    }

    body {
      color: #1C232B;
      font-family: Helvetica, Arial, sans-serif;
      font-weight: normal;
      padding: 0;
      margin: 0;
      text-align: left;
      line-height: 1.3;
    }

    body {
      font-size: 16px;
      line-height: 1.3;
    }

    a:hover {
      color: #1f54ed;
    }

    a:active {
      color: #1f54ed;
    }

    a:visited {
      color: #4E78F1;
    }

    h1 a:visited {
      color: #4E78F1;
    }

    h2 a:visited {
      color: #4E78F1;
    }

    h3 a:visited {
      color: #4E78F1;
    }

    h4 a:visited {
      color: #4E78F1;
    }

    h5 a:visited {
      color: #4E78F1;
    }

    h6 a:visited {
      color: #4E78F1;
    }

    table.button:hover table tr td a {
      color: #FFFFFF;
    }

    table.button:active table tr td a {
      color: #FFFFFF;
    }

    table.button table tr td a:visited {
      color: #FFFFFF;
    }

    table.button.tiny:hover table tr td a {
      color: #FFFFFF;
    }

    table.button.tiny:active table tr td a {
      color: #FFFFFF;
    }

    table.button.tiny table tr td a:visited {
      color: #FFFFFF;
    }

    table.button.small:hover table tr td a {
      color: #FFFFFF;
    }

    table.button.small:active table tr td a {
      color: #FFFFFF;
    }

    table.button.small table tr td a:visited {
      color: #FFFFFF;
    }

    table.button.large:hover table tr td a {
      color: #FFFFFF;
    }

    table.button.large:active table tr td a {
      color: #FFFFFF;
    }

    table.button.large table tr td a:visited {
      color: #FFFFFF;
    }

    table.button:hover table td {
      background: #1f54ed;
      color: #FFFFFF;
    }

    table.button:visited table td {
      background: #1f54ed;
      color: #FFFFFF;
    }

    table.button:active table td {
      background: #1f54ed;
      color: #FFFFFF;
    }

    table.button:hover table a {
      border: 0 solid #1f54ed;
    }

    table.button:visited table a {
      border: 0 solid #1f54ed;
    }

    table.button:active table a {
      border: 0 solid #1f54ed;
    }

    table.button.secondary:hover table td {
      background: #fefefe;
      color: #FFFFFF;
    }

    table.button.secondary:hover table a {
      border: 0 solid #fefefe;
    }

    table.button.secondary:hover table td a {
      color: #FFFFFF;
    }

    table.button.secondary:active table td a {
      color: #FFFFFF;
    }

    table.button.secondary table td a:visited {
      color: #FFFFFF;
    }

    table.button.success:hover table td {
      background: #009482;
    }

    table.button.success:hover table a {
      border: 0 solid #009482;
    }

    table.button.alert:hover table td {
      background: #ff6131;
    }

    table.button.alert:hover table a {
      border: 0 solid #ff6131;
    }

    table.button.warning:hover table td {
      background: #fcae1a;
    }

    table.button.warning:hover table a {
      border: 0px solid #fcae1a;
    }

    .thumbnail:hover {
      box-shadow: 0 0 6px 1px rgba(78, 120, 241, 0.5);
    }

    .thumbnail:focus {
      box-shadow: 0 0 6px 1px rgba(78, 120, 241, 0.5);
    }

    body.outlook p {
      display: inline !important;
    }

    body {
      font-weight: normal;
      font-size: 16px;
      line-height: 22px;
    }

    @media only screen and (max-width: 596px) {
      .small-float-center {
        margin: 0 auto !important;
        float: none !important;
        text-align: center !important;
      }
      .small-text-center {
        text-align: center !important;
      }
      .small-text-left {
        text-align: left !important;
      }
      .small-text-right {
        text-align: right !important;
      }
      .hide-for-large {
        display: block !important;
        width: auto !important;
        overflow: visible !important;
        max-height: none !important;
        font-size: inherit !important;
        line-height: inherit !important;
      }
      table.body table.container .hide-for-large {
        display: table !important;
        width: 100% !important;
      }
      table.body table.container .row.hide-for-large {
        display: table !important;
        width: 100% !important;
      }
      table.body table.container .callout-inner.hide-for-large {
        display: table-cell !important;
        width: 100% !important;
      }
      table.body table.container .show-for-large {
        display: none !important;
        width: 0;
        mso-hide: all;
        overflow: hidden;
      }
      table.body img {
        width: auto;
        height: auto;
      }
      table.body center {
        min-width: 0 !important;
      }
      table.body .container {
        width: 95% !important;
      }
      table.body .columns {
        height: auto !important;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      table.body .column {
        height: auto !important;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      table.body .columns .column {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      table.body .columns .columns {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      table.body .column .column {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      table.body .column .columns {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      table.body .collapse .columns {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      table.body .collapse .column {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      td.small-1 {
        display: inline-block !important;
        width: 8.333333% !important;
      }
      th.small-1 {
        display: inline-block !important;
        width: 8.333333% !important;
      }
      td.small-2 {
        display: inline-block !important;
        width: 16.666666% !important;
      }
      th.small-2 {
        display: inline-block !important;
        width: 16.666666% !important;
      }
      td.small-3 {
        display: inline-block !important;
        width: 25% !important;
      }
      th.small-3 {
        display: inline-block !important;
        width: 25% !important;
      }
      td.small-4 {
        display: inline-block !important;
        width: 33.333333% !important;
      }
      th.small-4 {
        display: inline-block !important;
        width: 33.333333% !important;
      }
      td.small-5 {
        display: inline-block !important;
        width: 41.666666% !important;
      }
      th.small-5 {
        display: inline-block !important;
        width: 41.666666% !important;
      }
      td.small-6 {
        display: inline-block !important;
        width: 50% !important;
      }
      th.small-6 {
        display: inline-block !important;
        width: 50% !important;
      }
      td.small-7 {
        display: inline-block !important;
        width: 58.333333% !important;
      }
      th.small-7 {
        display: inline-block !important;
        width: 58.333333% !important;
      }
      td.small-8 {
        display: inline-block !important;
        width: 66.666666% !important;
      }
      th.small-8 {
        display: inline-block !important;
        width: 66.666666% !important;
      }
      td.small-9 {
        display: inline-block !important;
        width: 75% !important;
      }
      th.small-9 {
        display: inline-block !important;
        width: 75% !important;
      }
      td.small-10 {
        display: inline-block !important;
        width: 83.333333% !important;
      }
      th.small-10 {
        display: inline-block !important;
        width: 83.333333% !important;
      }
      td.small-11 {
        display: inline-block !important;
        width: 91.666666% !important;
      }
      th.small-11 {
        display: inline-block !important;
        width: 91.666666% !important;
      }
      td.small-12 {
        display: inline-block !important;
        width: 100% !important;
      }
      th.small-12 {
        display: inline-block !important;
        width: 100% !important;
      }
      .columns td.small-12 {
        display: block !important;
        width: 100% !important;
      }
      .column td.small-12 {
        display: block !important;
        width: 100% !important;
      }
      .columns th.small-12 {
        display: block !important;
        width: 100% !important;
      }
      .column th.small-12 {
        display: block !important;
        width: 100% !important;
      }
      table.body td.small-offset-1 {
        margin-left: 8.333333% !important;
      }
      table.body th.small-offset-1 {
        margin-left: 8.333333% !important;
      }
      table.body td.small-offset-2 {
        margin-left: 16.666666% !important;
      }
      table.body th.small-offset-2 {
        margin-left: 16.666666% !important;
      }
      table.body td.small-offset-3 {
        margin-left: 25% !important;
      }
      table.body th.small-offset-3 {
        margin-left: 25% !important;
      }
      table.body td.small-offset-4 {
        margin-left: 33.333333% !important;
      }
      table.body th.small-offset-4 {
        margin-left: 33.333333% !important;
      }
      table.body td.small-offset-5 {
        margin-left: 41.666666% !important;
      }
      table.body th.small-offset-5 {
        margin-left: 41.666666% !important;
      }
      table.body td.small-offset-6 {
        margin-left: 50% !important;
      }
      table.body th.small-offset-6 {
        margin-left: 50% !important;
      }
      table.body td.small-offset-7 {
        margin-left: 58.333333% !important;
      }
      table.body th.small-offset-7 {
        margin-left: 58.333333% !important;
      }
      table.body td.small-offset-8 {
        margin-left: 66.666666% !important;
      }
      table.body th.small-offset-8 {
        margin-left: 66.666666% !important;
      }
      table.body td.small-offset-9 {
        margin-left: 75% !important;
      }
      table.body th.small-offset-9 {
        margin-left: 75% !important;
      }
      table.body td.small-offset-10 {
        margin-left: 83.333333% !important;
      }
      table.body th.small-offset-10 {
        margin-left: 83.333333% !important;
      }
      table.body td.small-offset-11 {
        margin-left: 91.666666% !important;
      }
      table.body th.small-offset-11 {
        margin-left: 91.666666% !important;
      }
      table.body table.columns td.expander {
        display: none !important;
      }
      table.body table.columns th.expander {
        display: none !important;
      }
      table.body .right-text-pad {
        padding-left: 10px !important;
      }
      table.body .text-pad-right {
        padding-left: 10px !important;
      }
      table.body .left-text-pad {
        padding-right: 10px !important;
      }
      table.body .text-pad-left {
        padding-right: 10px !important;
      }
      table.menu {
        width: 100% !important;
      }
      table.menu td {
        width: auto !important;
        display: inline-block !important;
      }
      table.menu th {
        width: auto !important;
        display: inline-block !important;
      }
      table.menu.vertical td {
        display: block !important;
      }
      table.menu.vertical th {
        display: block !important;
      }
      table.menu.small-vertical td {
        display: block !important;
      }
      table.menu.small-vertical th {
        display: block !important;
      }
      table.menu[align="center"] {
        width: auto !important;
      }
      table.button.small-expand {
        width: 100% !important;
      }
      table.button.small-expanded {
        width: 100% !important;
      }
      table.button.small-expand table {
        width: 100%;
      }
      table.button.small-expanded table {
        width: 100%;
      }
      table.button.small-expand table a {
        text-align: center !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      table.button.small-expanded table a {
        text-align: center !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      table.button.small-expand center {
        min-width: 0;
      }
      table.button.small-expanded center {
        min-width: 0;
      }
      table.body .container {
        width: 100% !important;
      }
    }

    @media only screen and (min-width: 732px) {
      table.body table.milkyway-email-card {
        width: 525px !important;
      }
      table.body table.emailer-footer {
        width: 525px !important;
      }
    }

    @media only screen and (max-width: 731px) {
      table.body table.milkyway-email-card {
        width: 320px !important;
      }
      table.body table.emailer-footer {
        width: 320px !important;
      }
    }

    @media only screen and (max-width: 320px) {
      table.body table.milkyway-email-card {
        width: 100% !important;
        border-radius: 0;
        box-sizing: none;
      }
      table.body table.emailer-footer {
        width: 100% !important;
        border-radius: 0;
        box-sizing: none;
      }
    }

    @media only screen and (max-width: 280px) {
      table.body table.milkyway-email-card .milkyway-content {
        width: 100% !important;
      }
    }

    @media (min-width: 596px) {
      .milkyway-header {
        width: 11%;
      }
    }

    @media (max-width: 596px) {
      .milkyway-header {
        width: 50%;
      }
      .emailer-footer .emailer-border-bottom {
        border-bottom: 0.5px solid #E2E5E7;
      }
      .emailer-footer .make-you-smile {
        margin-top: 24px;
      }
      .emailer-footer .make-you-smile .email-tag-line {
        width: 80%;
        position: relative;
        left: 10%;
      }
      .emailer-footer .make-you-smile .universe-address {
        margin-bottom: 10px !important;
      }
      .emailer-footer .make-you-smile .email-tag-line {
        margin-bottom: 10px !important;
      }
      .have-questions-text {
        width: 70%;
      }
      .hide-on-small {
        display: none;
      }
      .product-card-stacked-row .thumbnail-image {
        max-width: 32% !important;
      }
      .product-card-stacked-row .thumbnail-content p {
        width: 64%;
      }
      .welcome-subcontent {
        text-align: left;
        margin: 20px 0 10px;
      }
      .milkyway-title {
        padding: 16px;
      }
      .meta-data {
        text-align: center;
      }
      .label {
        text-align: center;
      }
      .welcome-email .wavey-background-subcontent {
        width: calc(100% - 32px);
      }
    }

    @media (min-width: 597px) {
      .emailer-footer .show-on-mobile {
        display: none;
      }
      .emailer-footer .emailer-border-bottom {
        border-bottom: none;
      }
      .have-questions-text {
        border-bottom: none;
      }
      .hide-on-large {
        display: none;
      }
      .milkyway-title {
        padding: 55px 55px 16px;
      }
    }

    @media only screen and (max-width: 290px) {
      table.container.your-tickets .tickets-container {
        width: 100%;
      }
    }
  </style>
  <table class="body" data-made-with-foundation="" style="background: #FAFAFA; border-collapse: collapse; border-spacing: 0; color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; height: 100%; line-height: 1.3; margin: 0; padding: 0; text-align: left; vertical-align: top; width: 100%"
    bgcolor="#FAFAFA">
    <tbody>
      <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
        <td class="center" align="center" valign="top" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 1.3; margin: 0; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word">
          <center style="min-width: 580px; width: 100%">
            <table class=" spacer  float-center" align="center" style="border-collapse: collapse; border-spacing: 0; float: none; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; width: 100%">
              <tbody>
                <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                  <td height="20px" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 20px; font-weight: normal; hyphens: auto; line-height: 20px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word"
                    align="left" valign="top">&nbsp;</td>
                </tr>
              </tbody>
            </table>
            <table class="header-spacer spacer  float-center" align="center" style="border-collapse: collapse; border-spacing: 0; float: none; line-height: 60px; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; width: 100%">
              <tbody>
                <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                  <td height="16px" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 16px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word"
                    align="left" valign="top">&nbsp;</td>
                </tr>
              </tbody>
            </table>
            <div class="milkyway-header float-center" align="center">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ4AAAAWCAYAAAAxZiXOAAAABGdBTUEAALGP&#10;C/xhBQAAEWlJREFUaAWtWw10VcWdn5n7PpJAQD5diogNolbqRytWaz1KjsAL&#10;YPJoCI+trbWIPS7rtvYc97i42z2yR1dPbc+6ddst9qyL7gZqXoDlJYQkGAzW&#10;tipidRW0K9iKAoooEghJ3se9s7//zZv35t43N192znlnZv5fM3fmP//5z3/m&#10;8eZUx8+kZCslY5MYEufyFJO8LbG8ZjXVTam7u7vsRE+6nXE5TzJeQTRcstPg&#10;3b0yvuRWE4+C/U939zm53nSDdFicSTkbnDPBPI5J9iHKxzhnvxfcalxRt+hF&#10;xROUJ1Md29HvGGcsClkO4ywtJT9cYU2dX1s7vy/Z+sz5zLabwT+HMXmO5DyL&#10;dg5xi61J1NbsDZKr4M2p9pWO5I/gu2aAL4T+nUFf90+bULaourp6QNGpfEtq&#10;13zJ7BqMyTWSyXM54+eA7zT69SHKL0vh7ErULnlB0Y8k37nzYPRM9p3VGN8F&#10;krNLwHMhviUDuSch8xO09Sq+p5uNj7Qlqqt7/TKTrR1fYQ5vAM9l+J2PuT0f&#10;34Bh48fRx+Ogfx+yXuAh8Vu2bPFrCc5tv4ygOsb3eunYtfm+nQexU/Nz8Al4&#10;XkMbv+aR8sbE0htO+GXwZKr9CLoxU0dgIvsTy5e4CqXDVTmV6jp3QGahKN4E&#10;pUkn4kvKvNDBWvLAgYg89P4D6NwP8NURE40XxvfzsLg1gcHwwou15PaOUxi8&#10;iUXIYIkLUZWoi/1pa9vu2bls5t0SPOcvJeI11/rhej2V+k3lADtzGJPiLsgC&#10;jrPT0yeUTYHi5RQs2bLrRuY4D6MvX1WwoBxj9KrF+D0r4jXdQTQEl1hBWFjf&#10;g3Ktg9wZQ9ESDnP2BubsckWHeb0YSvkLCKpWsOFytNWDRdYKRW5csaxmF0fF&#10;xEMLzGH2o9Cb6014HUY6Qf2YPiF6n75YBYBYyaNL6Wgua+RwrUIpJtnS+Xko&#10;3V4Mwr0jUzqSIb/IcvaL4F1TKjEP4dKo5ILDAiKtWHbTYZpoPz8m9ZptOzq/&#10;6Ifr9Qw/+50SpRsk2KkrHazifVj1z45E6Ygdk/UlmJTdzanO+/X29DL6J4D/&#10;FWA/HYnSES+seeE7t6Z2fQ2Al0ajdK4MLGJHsm/ZOdaRTHUeIOUnuJ6aUp23&#10;Qel+MxKlIz7Q0W70g4960i8nd/56mpIlgLJUpZBzDPkQKRyNOiY0mEpk7dz5&#10;4gTpyDY0foWJZyiY22nHeby5tX2BkS5A0aF4hcUkudhs4rUd53YTXMEcR65V&#10;ZT23hGhSdVI6TNRDqGMcR55oQh3prIdFu9vEtaWlcz0UbpUJFwSzJP93wiU7&#10;OibnmJME/8Qg2pHBZcRv8WBF66AaG915GZkQjQqGJNO3g9w0AgouR2/xov3l&#10;RsUjgUnpVeTe7KlNUO4vEG4siZRZ2nzztq6uKX5+k6ITTY4Xv6lMclK8kv5C&#10;YW7dt29f2C+T6u7WaegztqJTFVZVO9FsTXXeABkPUrkkcX4WtM/j9ySc5i7s&#10;g5+W0ACACfzx1h1dVTqO3Bgozb06bLgyrPpzDctjL7l0abkGgj9n4kF/PkBf&#10;nqZ+Qak6sEG/a6JzYZw16rjBfrH/NllBtN8HedsYFw8KwR6F/D06ryrju75y&#10;4vTA96gegqNpDW3fFNsI8zffJKvnOqg0OTnp3BzEiQ6Tn/gCOvoplGgePuoa&#10;Ey06PCPXl/s+cPcrPGgFLIaqenNN+ePxxcdAtwv0NR4iyaa+e+zjOsC2euCo&#10;cOncif6UJLglTUuXzk0TwmbOPyMrtXSCbwxH+br6WOwjJaCzs3NcT1reh3H+&#10;e+/EybCdy60H3bcV7QDL1YHOdRUUbKic/HGLh9YpGvQ7rsp6TsoRGhe6rH7h&#10;QnL8C4kWtNNvX+c4mCfJV2Csp2CxHItMiP5rgQiFNMvdi35N0GFUhsK1RJlY&#10;S+Os45Kt7V/Fcm/E4vIsLLSxrrV1389p4Eq2R12AqdwbPlOy9xfoenoK8hzO&#10;VhTgvoIQ4rFyMW0ODiP1K+M1a8jZFxarxgCVnIBcVskSuog9e/aUTnqeQNiQ&#10;oiV4Khu1aqFoO/L2QiVfoInA4Nf74VTnlvMU5e7p1eBYYwFtXlVXc7uudEQf&#10;i8XOJupqfghr8wDV9YS+1dPBS8HwUVersj+H/N8Jy4pVRiZN5BPLKnk4dHk4&#10;yi7VIwD48Av8fG5dshN+pSM4wRpqY62Yhzurzps6AyMXtzhb/PXq6lNKzuDO&#10;IL+r6ipHf16ZNiG6yq90hKfTe8gScfSnX9FTjrGdnGYnF5AvVFAURYCVbVrw&#10;Cj10nk4X5CHC8WUTMVZJ+8q6WIl/s7J2yR74TXeh8aSB72KyHDSJhDsxfbpg&#10;Pe8ZyLCvCsejlJWhOakz2UOf4qs9J1QMSizZuntmovamo0pQttcm62OyOG+r&#10;UIgjZUzR63koHPonve4vT6uMPnyiZwCnVO1UL+U469D7XwNtN9EDdwHl/oQx&#10;O8AmRGMrvSGTN/x0QXXInd20vf37fO75GxLz5mVMdPPnz6dDY4sf96cPP74W&#10;lqvSD8eieVw/qfrx9TfH9qNN+q6lOg7WdXEIfi4mCd0aRapIl4mzrCRk5EoY&#10;31+uTTr/C6Nsyf8zqDlZV7ONtXQOwE/xnFhpi+pzJJ2KXMUL4ie43+LR9ojt&#10;dhNW29/ofPhquBnZ2wB7qAgvXdmEw4HlSUUjmXOdKqscSpzJ5XJz0U4VwYSF&#10;HkvLHVgcrlCS8mSPu0t/APRsxUd5TrJLkXVTGX0smWCCw6l/2qd0BDalQwB6&#10;wmMa0U/ZofcehjIcgWX7CEN6HC0ex+5zQFri+cSyRUZFlrYMssKX4vS7luSj&#10;3xIHhsHvZYI+3i0DFSFnVk9AzQ3hgxBSGV3KlKVFgN6xdHl/UfEkG2eUzB3j&#10;BxItBTCT29sPok+X+Xmz6XCFgo0/HEE0dxQpJJ5gWdujeMQN274amat4FIbI&#10;SbvkIASlsiPMeqrQGseC8g/m4ADvUDQISSAVY7GFoJ8i0HPuLigXgrZCpvmA&#10;xXtLZwkqc8EboSg3BuHRbRrDi5BfpIwCLBC2CYc1be/YD515aFXdkl/p/DiA&#10;Todi6aDBshuTLcJx2MonyBsqcTaNlA7f6k2YjIIIL2awlstEisrlIwifhS4P&#10;k6xQZGAoEveGYSiCMeAoEE0+iZ8Vq+9COgQR3JbOHX68W8cJUPdj8IGeLdvI&#10;Mwog+jVFkWPgjWOvWRBFasw/P2PqU5C3x4gcFoiQh8M2IzC/Ce0V55izzxia&#10;8TUs2WSBlTSsovjYMDR2wY/z4/pCiCTkE3wA4yDaDhvSACh+fx6CY+CHjarO&#10;+RMmeoc5t1O8EebPc4Ap0EpYS0+Sn3iqn7GCLS+sRMC6fKZvJD9tfOScOCbW&#10;Y7WU/JHksDu3IID9Q0WLefxIlf88ObeKWq1L5KxMP2npKCqHZG5EKx56Zx5E&#10;IYp7kF/4EHUEXc3yhuDxoCrEZiyzPg8MFVzyNpzNfPqP+W3Igwb9h1XnTS5s&#10;oYNIXjiMeIjHWOHCKcb5AhbraEQvXXrtaUQKbgmHwxcLxuFG8PdHw5+nvVsF&#10;ezEuR8bAPxTL/4Vgk8hZH69TwcyGQu98cAVgL+twVbZt82mV8NOi0cLEYiVj&#10;sy/VlVAoM4wToFry5kJYBb7e2RnJDnrxqubAk1dlPU8sWtSD6DtZgjU6HOtj&#10;HAT/rQemKrCS+dOegpBj+BY+K14E5Eucr4W576IrO8cSYcsWYZtnETkIWRYO&#10;GLaw0bVwzracLMuKDONwWsp4Or54cXFi8cqgRO4YAfXLFr4N1n+gH11Xcad/&#10;rnQc+Hd8FuJpOIDIG/Ar8WmpOVi9ySf6cnNRfAO3Iq/bhnnEiWtjojZ2B0Jb&#10;kf7+8kivOBWKpkPhtOChqGNLFLGmLTtcbmcrMpnslClTMmosEUBGEFeyC6kx&#10;PdlO7hEo4E3YiQuTTfhkd/d4eTp9v06ryvAtevTjNRav0USFMxGPTMU/XI6+&#10;FCalqr9fvhPAYEmjf+5SC2ZtsJntVbwAOQDTwP2yBC3EFjjjhaCthv8GwkS/&#10;9I+Zhh++iOi1aY6HZxykSLbtupJlZU2Uj/t5PH594fyVfyFCMdLfKVnkx+F6&#10;rhFr4hsKpue415tOdboVwcHjXajjBVRXCfi/bE7t/kli+cI3ARvSb1c8Khf4&#10;yBKHm5DQ+AXY5/cmt3c2bGvrumhLS8e8ZEv7d2TPwGvoMK0EQ5L7PED+51u9&#10;JDebyxUU9o9XXVUoe9pEBfFDo8Ujuob44n2mQ4ZfRr7elqhd9J4fl7g59gqU&#10;6w9+OBq+ARP5WNBVnKKnlyP0+MF/vZjHFxaXoh9pTnMkc/azCPc8PMB6D+LJ&#10;2730DC2I310ggj0biHdYj8Ih6PZfqqxyDHI5rPb2LamuwqsYhdPzZNszlzWl&#10;2tdT/xQ8JCz+tG2bL6ShfFdhGpuz2cA5VnLcnEOWB8DIQpXqQLbcLgV6Gc01&#10;XvQNV8IaJc1UuDKk+EBwwqn536AkTwZTDGKwHTwWRIPY1z22bbf58bAed/3x&#10;yMfXNrV0PBIJhV8RWdmb5bmpWKwXw0m/GsOxEI7AfGwGTLR00HOnB3UZCN6j&#10;72MbHlvKjWAd9L+lPBeCfpTtGVgPBWyFzC1WmXhOv1WhA1Vv5tQ39fZVGS5D&#10;xqngRWemMvpj1pNeDTmzFA3lZIQcnt2L+OUGKHIXen8CO12lI+QcbOdX4ksW&#10;yGzuEqJFfxqw2K6gkJlYcfPiFBzo5wjxWRKsyGuyapZ/VYx59Zr7UlQ8fGTg&#10;7GDQhmy3MlxFF+XDnNT4/hXLa7rM/cAI1i7eGXRydBesI5symcwhereIq7n9&#10;sMFboWvrXKXLC8U+vm5bZ6e7nal20PcxnfjdB5+y9LoNg1SOxZBA+8lsv3Mc&#10;1vYIrM/eplTHK1C6o7SzqbY9OWct5BMrGD0yFYLfaRpbfFMUCng34oGtuMN+&#10;McfkM1j6G9DuXwHuKh3JQXmebNl1G5UpnCKjLLyKLoYJMJaESTwJSfWGqxij&#10;AoRxrT2WdpjvNIy+GycJg2yEqzbdi37BNqi6Mef8USNcA44Lz1mND9mtgUZX&#10;xKEm18++62MyjpmPpqRqhfGSmA0fZIaSzIRVhOWVX4bSeQ6VSigM0RnEWksO&#10;W/Bf23HRtWaoRa9kBOeSHnsMvq6IxxceDwu2FAKLpjWY04PBwB+2hLWMXvx6&#10;EKhgtRkVwHGC44B+GXodj7G88qTM6nhVFlbICFd4Nw9V/Ax991xgKzzgR/iF&#10;5zWqelBOCjyxXMRxQNsURDMsnDtwZzzJ+40eVHBlRU3NB3zurCuhNPdgHkv8&#10;0mBOL2bQiLAYPaL1YgZrq+Kxp2D56l06E8EwMIztJPJthaKrr63534ll/Evo&#10;9C+CJkTRujnnOMXw/xgfmXS5/jpCp8FmaBzEXBjrcwwpN94vjxsVB36Seyk6&#10;VBN0yoPDbLZ6nP/EYL2N4ujRwqr4km8JLuhk+I6RyAx8G37iXfj/xi06GhbJ&#10;OGY6TVCZ+oxXJv/C6mJVCOnAleLPYC5HZEGhsIiC4A49HJ2nHkMEtYPXLNuZ&#10;Fb4cPE9AB4Zf5K4gvh+76lo2bcIl5OOFdOH5lx9/jf8b/N0AO1uPeNWNODLP&#10;xER+Lk93FDbyGJzG58rYuG3x5cXjui5HlcG3CTLwOopXwv5F8p08OLmcfaxo&#10;TDmcU1gQbKPcff9FUTm87WRvLV+w4LROj4F9DNvFMpIP/yGMQe6DA//65Apx&#10;VKcLKpeL8Q/0yd5ZaOsL4MejBJ6B53EAT30eD+IJgq+Mx57GSm4WrZ3L4d/E&#10;0a/rMNAzcW8Ow09/EmInUTqAi3Rc3YXaGuKLXjXJgilotCWfjG85F2MWRsyN&#10;4qJHBQ4qJnoTjCYW8Gb67djx/KS+XP8CXIhcjXG9FP2iPyHRfGDR4h2klH/A&#10;/e7L4cpoq/4UyiRXh+Vf9NyB1z33Myf7deAWYoubDfkVkE9/iupBtOYgHoa+&#10;bllWVz6mWBDx/+48DodV/kOKAAAAAElFTkSuQmCC"
                style="-ms-interpolation-mode: bicubic; clear: both; display: block; max-width: 100%; outline: none; text-decoration: none; width: auto">
            </div>
            <table class="header-spacer-bottom spacer  float-center" align="center" style="border-collapse: collapse; border-spacing: 0; float: none; line-height: 30px; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; width: 100%">
              <tbody>
                <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                  <td height="16px" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 16px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word"
                    align="left" valign="top">&nbsp;</td>
                </tr>
              </tbody>
            </table>

            <table class="milkyway-email-card container float-center" align="center" style="background: #FFFFFF; border-collapse: collapse; border-radius: 6px; border-spacing: 0; box-shadow: 0 1px 8px 0 rgba(28,35,43,0.15); float: none; margin: 0 auto; overflow: hidden; padding: 0; text-align: center; vertical-align: top; width: 580px"
              bgcolor="#FFFFFF">
              <tbody>
                <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                  <td style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 1.3; margin: 0; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word"
                    align="left" valign="top">

                    <table class="milkyway-content confirmation-instructions container" align="center" style="background: #FFFFFF; border-collapse: collapse; border-spacing: 0; hyphens: none; margin: auto; max-width: 100%; padding: 0; text-align: inherit; vertical-align: top; width: 280px !important"
                      bgcolor="#FFFFFF">
                      <tbody>
                        <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                          <td style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 1.3; margin: 0; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word"
                            align="left" valign="top">
                            <table class=" spacer " style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%">
                              <tbody>
                                <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                                  <td height="30px" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 30px; font-weight: normal; hyphens: auto; line-height: 30px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word"
                                    align="left" valign="top">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <table class=" row" style="border-collapse: collapse; border-spacing: 0; display: table; padding: 0; position: relative; text-align: left; vertical-align: top; width: 100%">
                              <tbody>
                                <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                                  <th class=" small-12 large-12 columns first last" style="color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0 auto; padding: 0; text-align: left; width: 564px" align="left">
                                    <table style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%">
                                      <tbody>
                                        <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                                          <th style="color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left" align="left">
                                            <center style="min-width: 0; width: 100%">
                                              <img width="250" src="imageSourceUrl"
                                                align="center" class=" float-center float-center" style="-ms-interpolation-mode: bicubic; clear: both; display: block; float: none; margin: 0 auto; max-width: 100%; outline: none; text-align: center; text-decoration: none; width: auto">
                                            </center>
                                          </th>
                                          <th class="expander" style="color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left; visibility: hidden; width: 0" align="left"></th>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                            <table class=" spacer " style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%">
                              <tbody>
                                <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                                  <td height="30px" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 30px; font-weight: normal; hyphens: auto; line-height: 30px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word"
                                    align="left" valign="top">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <table class=" row" style="border-collapse: collapse; border-spacing: 0; display: table; padding: 0; position: relative; text-align: left; vertical-align: top; width: 100%">
                              <tbody>
                                <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                                  <th class="header-padding small-12 large-12 columns first last" style="color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0 auto; padding: 0; text-align: left; width: 564px" align="left">
                                    <table style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%">
                                      <tbody>
                                        <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                                          <th style="color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left" align="left">
                                            <h1 class="welcome-header" style="color: inherit; font-family: Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 600; hyphens: none; line-height: 30px; margin: 0 0 24px; padding: 0; text-align: left; width: 100%; word-wrap: normal" align="left">
                                              You are ready to go!
                                            </h1>
                                          </th>
                                          <th class="expander" style="color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left; visibility: hidden; width: 0" align="left"></th>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                            <table class=" row" style="border-collapse: collapse; border-spacing: 0; display: table; padding: 0; position: relative; text-align: left; vertical-align: top; width: 100%">
                              <tbody>
                                <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                                  <th class="body-content small-12 large-12 columns first last" style="color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0 auto; padding: 0; text-align: left; width: 564px" align="left">
                                    <table style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%">
                                      <tbody>
                                        <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                                          <th style="color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left" align="left">
                                            <h2 class="welcome-subcontent" style="color: #6F7881; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 300; line-height: 22px; margin: 0; padding: 0; text-align: left; width: 100%; word-wrap: normal" align="left">
                                              Hey Admin,
                                            </h2>
                                          </th>
                                          <th class="expander" style="color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left; visibility: hidden; width: 0" align="left"></th>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                            <table class=" row" style="border-collapse: collapse; border-spacing: 0; display: table; padding: 0; position: relative; text-align: left; vertical-align: top; width: 100%">
                              <tbody>
                                <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                                  <th class="body-content-end small-12 large-12 columns first last" style="color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0 auto; padding: 0; text-align: left; width: 564px" align="left">
                                    <table style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%">
                                      <tbody>
                                        <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                                          <th style="color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left" align="left">
                                            <h2 class="welcome-subcontent" style="color: #6F7881; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 300; line-height: 22px; margin: 0; padding: 0; text-align: left; width: 100%; word-wrap: normal" align="left">
                                            '.$techteachdetail.'
                                            </h2>
                                          </th>
                                          <th class="expander" style="color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left; visibility: hidden; width: 0" align="left"></th>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                            <table class=" spacer " style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%">
                              <tbody>
                                <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                                  <td height="30px" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 30px; font-weight: normal; hyphens: auto; line-height: 30px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word"
                                    align="left" valign="top">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="milkyway-content row" style="border-collapse: collapse; border-spacing: 0; display: table; hyphens: none; margin: auto; max-width: 100%; padding: 0; position: relative; text-align: left; vertical-align: top; width: 280px !important">
                              <tbody>
                                <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                                  <th class="milkyway-padding small-12 large-12 columns first last" valign="middle" style="color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0 auto; padding: 0; text-align: left; width: 564px"
                                    align="left">
                                    <table style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%">
                                      <tbody>
                                        <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                                          <th style="color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left" align="left">
                                            <table class="cta-text primary radius expanded button" style="border-collapse: collapse; border-spacing: 0; font-size: 14px; font-weight: 400; line-height: 0; margin: 0 0 16px; padding: 0; text-align: left; vertical-align: top; width: 100% !important">
                                              <tbody>
                                                <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                                                  <td style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 1.3; margin: 0; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word"
                                                    align="left" valign="top">
                                                    <table style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%">
                                                      <tbody>
                                                        <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                                                          <td style="-moz-hyphens: auto; -webkit-hyphens: auto; background: #4E78F1; border: 2px none #4e78f1; border-collapse: collapse !important; border-radius: 6px; color: #FFFFFF; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 1.3; margin: 0; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word"
                                                            align="left" bgcolor="#4E78F1" valign="top">
                                                            <a href="'.$approveEmailUrl.'" style="border: 0 solid #4e78f1; border-radius: 6px; color: #FFFFFF; display: inline-block; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; line-height: 1.3; margin: 0; padding: 13px 0; text-align: center; text-decoration: none; width: 100%"
                                                              target="_blank">
                                                              <p class="text-center" style="color: white; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 300; letter-spacing: 1px; line-height: 1.3; margin: 0; padding: 0; text-align: center" align="center">
                                                                Approve
                                                              </p>
                                                            </a>
                                                            <a href="'.$declineEmailUrl.'" style="border: 0 solid #4e78f1; border-radius: 6px; color: #FFFFFF; display: inline-block; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; line-height: 1.3; margin: 0; padding: 13px 0; text-align: center; text-decoration: none; width: 100%"
                                                              target="_blank">
                                                              <p class="text-center" style="color: white; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 300; letter-spacing: 1px; line-height: 1.3; margin: 0; padding: 0; text-align: center" align="center">
                                                                Decline
                                                              </p>
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </th>
                                          <th class="expander" style="color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left; visibility: hidden; width: 0" align="left"></th>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </th>
                                </tr>
                              </tbody>
                            </table>

                            <table class=" spacer " style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%">
                              <tbody>
                                <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                                  <td height="10px" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 10px; font-weight: normal; hyphens: auto; line-height: 10px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word"
                                    align="left" valign="top">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                  </td>
                </tr>
              </tbody>
            </table>
            <table class=" spacer  float-center" align="center" style="border-collapse: collapse; border-spacing: 0; float: none; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; width: 100%">
              <tbody>
                <tr style="padding: 0; text-align: left; vertical-align: top" align="left">
                  <td height="20px" style="-moz-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important; color: #1C232B; font-family: Helvetica, Arial, sans-serif; font-size: 20px; font-weight: normal; hyphens: auto; line-height: 20px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word"
                    align="left" valign="top">&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </center>
        </td>
      </tr>
    </tbody>
  </table>

</body>';
if(mysqli_query($conn,$techteachdetailsQuery)){
    $response.=',"techteachdetailsQuery":"done"';
}else{
    $response.=',"techteachdetailsQuery":"failed"';
}
$userCheck = mysqli_query($conn,"select emailaddress from logindetails where usertype='admin'");
if (($res1=mysqli_fetch_row($userCheck))) {

    if(mail("$res1[0]","$subject","$emailContent", $headers)){
        $response.=',"mailSent":"done"';
    }else{
        $response.=',"mailSent":"failed"';
    }
}
$response.="}";
}
header('Content-Type: application/json');
echo json_encode($response);
?>