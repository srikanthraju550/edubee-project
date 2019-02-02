<?php
$post = file_get_contents('php://input');
//echo $post;
$response="";
$request = json_decode($post);
$mentorId = $request->mentorId;
$menteeId = $request->menteeId;
$engshipId = $request->engshipId;
$authCode = rand();
$registereduserid = $request->registereduserid;

include("connection.php");
//echo "select userid from logindetails where emailaddress='$email'";
$response.="{";
$alreadyRegisteredCheck = mysqli_fetch_row(mysqli_query($conn,"select count(*) from engshipregistration where mentorId=$mentorId and menteeId=$menteeId and engshipId = $engshipId"));
if ($alreadyRegisteredCheck[0]==0) {
    $engshipRegistrationQuery="insert into engshipregistration ( mentorId, menteeId, engshipId, authCode, createdby, updatedby) values( $mentorId,  $menteeId, $engshipId, $authCode, $registereduserid, $registereduserid);";
    //echo $techEventRegistrationQuery;
    if(mysqli_query($conn,$engshipRegistrationQuery)){
        $response.='"engshipRegistrationQuery":"done"';
    }else{
        $response.='"engshipRegistrationQuery":"failed"';
    }
}else{
    $response.='"alreadyRegistered":"true"';
}
$response.="}";
header('Content-Type: application/json');
echo json_encode($response); 
?>