<?php
$post = file_get_contents('php://input');
//echo $post;
$response="";
$request = json_decode($post);
$articleid = $request->articleid;

if(isset($articleid)){
include("connection.php");
//echo "select articleid from logindetails where emailaddress='$email'";
$response.="{";
$articlecomments = mysqli_query($conn,"select t1.id, articleid, t1.userid, comment, t1.createdon, t1.updatedon, t2.name from articlecomments t1, basicinformation t2 where t1.articleid = $articleid and t1.userid=t2.userid");

if(mysqli_num_rows($articlecomments)){
        $response.= '"articlecomments":[';
    
        $first = true;
        while($row=mysqli_fetch_assoc($articlecomments)){
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