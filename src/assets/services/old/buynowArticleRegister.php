<?php
$post = file_get_contents('php://input');
//echo $post;
$response="";
$request = json_decode($post);

$userId = $request->userid;
$articleid = $request->articleid;

if(isset($userId)){
include("connection.php");
//echo "select userid from logindetails where emailaddress='$email'";
$response.="{";
    $userCheck = mysqli_query($conn,"select id from techarticleregistration where articleid=$articleid and registereduserid=$userId;");

    if ($res1=mysqli_fetch_row($userCheck)) {
        $response.='"alreadyPurchased" : "true" ';
    }else{
        $query1="insert into techarticleregistration (articleid, registereduserid, createdby, updatedby) values($articleid, $userId, $userId, $userId);";
        //echo $query1;
        if(mysqli_query($conn,$query1))
            $response.='"techarticleregistration":"done"';
        else
            $response.='"techarticleregistration":"failed"'; 
    }
$response.="}";
}
//header('Content-Type: application/json');
echo json_encode($response);
?>