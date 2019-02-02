<?php
$post = file_get_contents('php://input');
//echo $post;
$response="";
$request = json_decode($post);
$stuvationid = $request->stuvationid;
$updateType = $request->updateType;
$userId = $request->userid;

if(isset($userId)){
include("connection.php");
//echo "select userid from logindetails where emailaddress='$email'";
$response.="{";
$counterType="";
$stuvationUpDownCountUpdateQuery="";
$stuvationCheck = mysqli_query($conn,"select t1.counterType from stuvationratingcounter t1 where stuvationid=$stuvationid and userid = $userId");
if (($res1=mysqli_fetch_row($stuvationCheck))) {
    if($updateType===$res1[0]){
        $counterType="";
    }else if($updateType!==$res1[0]){
        $counterType=$updateType;
    }
    $stuvationUpDownCountUpdateQuery="update stuvationratingcounter set counterType='$counterType' where stuvationid=$stuvationid and userid = $userId";
}else{
    $stuvationUpDownCountUpdateQuery="insert into stuvationratingcounter(stuvationid, userid, counterType) values($stuvationid, $userId, '$updateType')";
}

if(mysqli_query($conn,$stuvationUpDownCountUpdateQuery)){
    $response.='"stuvationUpDownCountQuery":"done"';
}else{
    $response.='"stuvationUpDownCountQuery":"failed"';
}
$response.="}";
}
header('Content-Type: application/json');
echo json_encode($response);
?>