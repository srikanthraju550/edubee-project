<?php
$post = file_get_contents('php://input');
//echo $post;
$response="";
$request = json_decode($post);
$eventid = $request->eventid;
$eventtype = $request->eventtype;
$registereduserid = $request->registereduserid;


if(isset($registereduserid)){
include("connection.php");
//echo "select userid from logindetails where emailaddress='$email'";
$response.="{";
$alreadyRegisteredCheck = mysqli_query($conn,"select registereduserid from techeventsregistration where eventid=$eventid and registereduserid=$registereduserid");
if (!($res1=mysqli_fetch_row($alreadyRegisteredCheck))) {
    $techEventRegistrationQuery="insert into techeventsregistration (eventid, eventtype, registereduserid, createdby, updatedby) values( $eventid, '$eventtype', $registereduserid, $registereduserid, $registereduserid);";
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