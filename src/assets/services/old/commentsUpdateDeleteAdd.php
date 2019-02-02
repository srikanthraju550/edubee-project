<?php
$post = file_get_contents('php://input');
//echo $post;
$response="";
$request = json_decode($post);
$articleComment = $request->articleComment;
$userId = $request->userid;
$operationType = $request->operationType;
$commentid = $request->commentid;
$articleid = $request->articleid;

if(isset($userId)){
include("connection.php");
//echo "select userid from logindetails where emailaddress='$email'";
$response.="{";
$counterType="";
$commentUpdateDeleteAddQuery="";
if($operationType=='U')
    $commentUpdateDeleteAddQuery="update articlecomments set comment='$articleComment', updatedOn = current_date() where id=$commentid;";
else if($operationType=='D')
    $commentUpdateDeleteAddQuery="delete from articlecomments where id=$commentid;";
else if($operationType=='A')
    $commentUpdateDeleteAddQuery="insert into articlecomments (articleid, userid, comment, createdBy, updatedBy) values($articleid, $userId, '$articleComment', $userId, $userId);";
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