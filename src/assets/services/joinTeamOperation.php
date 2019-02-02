<?php
$post = file_get_contents('php://input');
//echo $post;
$response="";
$request = json_decode($post);
$projectid = $request->projectid;
$registereduserid = $request->registereduserid;
$rolename = $request->rolename;
$comment= $request->comment;

if(isset($registereduserid)){
include("connection.php");
//echo "select userid from logindetails where emailaddress='$email'";
$response.="{";
$alreadyRegisteredCheck = mysqli_query($conn,"select userid from stuvationmemberdetails where projectid=$projectid and userid=$registereduserid and rolename = '$rolename'");
if (!($res1=mysqli_fetch_row($alreadyRegisteredCheck))) {
    $techEventRegistrationQuery="insert into stuvationmemberdetails ( projectid, userid, rolename, comment, createdby, updatedby) values( $projectid,  $registereduserid, '$rolename', '$comment', $registereduserid, $registereduserid);";
    //echo $techEventRegistrationQuery;
    if(mysqli_query($conn,$techEventRegistrationQuery)){
        $response.='"techEventRegistrationQuery":"done"';
    }else{
        $response.='"techEventRegistrationQuery":"failed"';
    }
}else{
    $response.='"alreadyRegistered":"true"';
}
$response.="}";
}
header('Content-Type: application/json');
echo json_encode($response); 
?>