<?php
$post = file_get_contents('php://input');
//echo $post;
$response="";
$request = json_decode($post);
$articleid = $request->articleid;
$updateType = $request->updateType;
$userId = $request->userid;

if(isset($userId)){
include("connection.php");
//echo "select userid from logindetails where emailaddress='$email'";
$response.="{";
$counterType="";
$articleUpDownCountUpdateQuery="";
$articleCheck = mysqli_query($conn,"select t1.counterType from articleratingcounter t1 where articleid=$articleid and userid = $userId");
if (($res1=mysqli_fetch_row($articleCheck))) {
    if($updateType===$res1[0]){
        $counterType="";
    }else if($updateType!==$res1[0]){
        $counterType=$updateType;
    }
    $articleUpDownCountUpdateQuery="update articleratingcounter set counterType='$counterType' where articleid=$articleid and userid = $userId";
}else{
    $articleUpDownCountUpdateQuery="insert into articleratingcounter(articleid, userid, counterType) values($articleid, $userId, '$updateType')";
}

if(mysqli_query($conn,$articleUpDownCountUpdateQuery)){
    $response.='"articleUpDownCountQuery":"done"';
}else{
    $response.='"articleUpDownCountQuery":"failed"';
}
$response.="}";
}
header('Content-Type: application/json');
echo json_encode($response);
?>