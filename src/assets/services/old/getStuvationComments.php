<?php
$post = file_get_contents('php://input');
//echo $post;
$response="";
$request = json_decode($post);
$stuvationid = $request->stuvationid;

if(isset($stuvationid)){
include("connection.php");
//echo "select stuvationid from logindetails where emailaddress='$email'";
$response.="{";
$stuvationcomments = mysqli_query($conn,"select t1.id, stuvationid, t1.userid, comment, t1.createdon, t1.updatedon, t2.name from stuvationcomments t1, basicinformation t2 where t1.stuvationid = $stuvationid and t1.userid=t2.userid");

if(mysqli_num_rows($stuvationcomments)){
        $response.= '"stuvationcomments":[';
    
        $first = true;
        while($row=mysqli_fetch_assoc($stuvationcomments)){
            if($first) {
                $first = false;
            } else {
                $response.= ',';
            }
            $response.= json_encode($row);
        }
        $response.= ']';
} 
$response.="}";
}
header('Content-Type: application/json');
echo json_encode($response);
?>