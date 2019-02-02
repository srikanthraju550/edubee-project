<?php
$post = file_get_contents('php://input');
//echo $post;
$response="";
$request = json_decode($post);
$stuvationcomment = $request->stuvationcomment;
$userId = $request->userid;
$operationType = $request->operationType;
$commentid = $request->commentid;
$stuvationid = $request->stuvationid;

if(isset($userId)){
include("connection.php");
//echo "select userid from logindetails where emailaddress='$email'";
$response.="{";
$counterType="";
$commentUpdateDeleteAddQuery="";
if($operationType=='U')
    $commentUpdateDeleteAddQuery="update stuvationcomments set comment='$stuvationcomment', updatedOn = current_date() where id=$commentid;";
else if($operationType=='D')
    $commentUpdateDeleteAddQuery="delete from stuvationcomments where id=$commentid;";
else if($operationType=='A')
    $commentUpdateDeleteAddQuery="insert into stuvationcomments (stuvationid, userid, comment, createdBy, updatedBy) values($stuvationid, $userId, '$stuvationcomment', $userId, $userId);";
if(mysqli_query($conn,$commentUpdateDeleteAddQuery)){
    $response.='"commentUpdateDeleteAddQuery":"done"';
}else{
    $response.='"commentUpdateDeleteAddQuery":"failed"';
}
$response.="}";
}
//header('Content-Type: application/json');
echo json_encode($response);
?>