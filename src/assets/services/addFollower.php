<?php
$post = file_get_contents('php://input');
//echo $post;
$response="";
$request = json_decode($post);

$userId = $request->userid;
$followerId = $request->followerId;
$operationType = $request->operationType;

if(isset($userId)){
include("connection.php");
//echo "select userid from logindetails where emailaddress='$email'";
$response.="{";
$counterType="";
$followerUpdateQuery="";
if($operationType=='U')
    $followerUpdateQuery="delete from followers where userid=$userId and followeruserid=$followerId;";
else if($operationType=='F')
    $followerUpdateQuery="insert into followers (userid, followeruserid, createdBy, updatedBy) values($userId, $followerId, $userId, $userId);";
if(mysqli_query($conn,$followerUpdateQuery)){
    $response.='"followerUpdateQuery":"done"';
}else{
    $response.='"followerUpdateQuery":"failed"';
}
$response.="}";
}
header('Content-Type: application/json');
echo json_encode($response);
?>