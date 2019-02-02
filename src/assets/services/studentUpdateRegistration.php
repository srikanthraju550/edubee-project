<?php
$post = file_get_contents('php://input');
//echo $post;
$response="";
$request = json_decode($post);
$name = $request->name;
$email = $request->email;
$contact = $request->contact;
$dob = date("Y-m-d", strtotime($request->dob));
//$username = $request->username;
/* $password = md5($request->password);
$confirmpassword = $request->confirmpassword; */
$schoolname = $request->schoolname;
$schoolcity = $request->schoolcity;
$schoolstate = $request->schoolstate;
$collegename = $request->college;
$collegecity = $request->collegecity;
$collegestate = $request->collegestate;
$collegebranch = $request->collegebranch;

$miniprojecttitle = $request->miniprojecttitle;
$miniprojectdescription = $request->miniprojectdescription;
$majorprojecttitle = $request->majorprojecttitle;
$majorprojectdescription = $request->majorprojectdescription;


$technologies = $request->technologies;
$skills = $request->skills;

//$workExperience = $request->workExperience; 

$userid = $request->userId;
include("connection.php");
$response.="{";
$projectCheck=mysqli_fetch_row(mysqli_query($conn,"select count(*) from projectinformation where userid=$userid"));
if($projectCheck[0]==0)
    $projectInformationQuery="insert into projectinformation (userid, miniprojecttitle, miniprojectdescription, majorprojecttitle, majorprojectdescription) values($userid,'$miniprojecttitle','$miniprojectdescription','$majorprojecttitle','$majorprojectdescription');";
else
    $projectInformationQuery="update projectinformation set miniprojecttitle = '$miniprojecttitle', miniprojectdescription = '$miniprojectdescription', majorprojecttitle = '$majorprojecttitle', majorprojectdescription = '$majorprojectdescription' where userid = $userid;";
$techskillCheck=mysqli_fetch_row(mysqli_query($conn,"select count(*) from technologyskills where userid=$userid")); 
    if($techskillCheck[0]==0)
        $techskillQuery="insert into technologyskills (userid, technologylist, skillslist) values($userid,'$technologies','$skills');";
    else
        $techskillQuery="update technologyskills set technologylist = '$technologies', skillslist = '$skills' where userid = $userid;";
    
$updateBasicInformationQuery="update basicinformation set name='$name', contactnumber=$contact, dob='$dob', school='$schoolname', schoolcityid = $schoolcity, schoolstateid=$schoolstate, college='$collegename', collegecityid=$collegecity, collegestateid=$collegestate, branch ='$collegebranch' where userid=$userid;";
$updateLoginDetails="update logindetails set emailaddress='$email' where userid=$userid;";
//echo $projectInformationQuery.$updateBasicInformationQuery.$techskillQuery;
if (mysqli_multi_query($conn,$projectInformationQuery.$updateBasicInformationQuery.$techskillQuery.$updateLoginDetails) === TRUE) {
    $response.='"insertQueriesStatus":"done"';
    $response.=',"profieUpdationStatus":"successful"';
} else {
    $response.='"insertQueriesStatus":"failed"';
    $response.=',"profieUpdationStatus":"partiallySuccessful"'; //"Error: " . $query2 . "<br>" . $conn->error;
}
$response.="}";
header('Content-Type: application/json');
echo json_encode($response);
?>