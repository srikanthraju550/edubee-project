<?php
$post = file_get_contents('php://input');
//echo $post;
$response="";
$request = json_decode($post);
$name = $request->name;
$email = $request->email;
$contact = $request->contact;
//$dob = date("Y-m-d", strtotime($request->dob));
$username = $request->username;
$password = md5($request->password);
/* $confirmpassword = $request->confirmpassword;
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
$workExperience = $request->workExperience; 
*/
$profilePicture = substr($request->profilePicture,11);

if(isset($email)){
include("connection.php");
//echo "select userid from logindetails where emailaddress='$email'";
$response.="{";
$userCheck = mysqli_query($conn,"select userid from logindetails where emailaddress='$email'");

if (!($res1=mysqli_fetch_row($userCheck))) {
	$query1="insert into logindetails (emailaddress, username, password, usertype, profilepicture) values('$email','$username','$password','student','$profilePicture')";
	if(mysqli_query($conn,$query1))
		$response.='"logindetails":"done"';
	else
		$response.='"logindetails":"failed"';
	 $res2=mysqli_fetch_row(mysqli_query($conn,"select userid from logindetails where emailaddress='$email'"));
	$userid = $res2[0];
	//$query2="insert into basicinformation (userid, name, contactnumber, dob, school, college, branch, collegecityid, collegestateid, schoolcityid, schoolstateid) values($userid,'$name',$contact,'$dob','$schoolname','$collegename','$collegebranch','$collegecity','$collegestate','$schoolcity','$schoolstate');";
	$query2="insert into basicinformation (userid, name, contactnumber) values($userid,'$name',$contact);";
	if(mysqli_query($conn,$query2))
		$response.=',"profieCreationStatus":"successful"';
	else
		$response.=',"profieCreationStatus":"failed"';
	/*$query2.="insert into projectinformation (userid, miniprojecttitle, miniprojectdescription, majorprojecttitle, majorprojectdescription) values($userid,'$miniprojecttitle','$miniprojectdescription','$majorprojecttitle','$majorprojectdescription');";
	$query2.="insert into technologyskills (userid, technologylist, skillslist) values($userid,'$technologies','$skills');";
	foreach($workExperience as $key => $value){
		if($value->role!="" && $value->companyName!="" && $value->yearsOfExperience!="")
			$query2.="insert into workingexperience (userid, roleid, companyname, yearsofexperience) values($userid,$value->role,'$value->companyName',$value->yearsOfExperience);";
	}
	//echo $query2;
	if (mysqli_multi_query($conn,$query2) === TRUE) {
		$response.=',"insertQueriesStatus":"done"';
		$response.=',"profieCreationStatus":"successful"';
	} else {
		$response.=',"insertQueriesStatus":"failed"';
		$response.=',"profieCreationStatus":"partiallySuccessful"'; //"Error: " . $query2 . "<br>" . $conn->error;
	} */
	
}else{
	$response.=' "userAlreadyExists" : "true" ';
}
$response.="}";
}
header('Content-Type: application/json');
echo json_encode($response);
?>