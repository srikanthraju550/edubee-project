<?php
header('Content-Type: application/json');
$post = file_get_contents('php://input');
//echo $post;
$response="";
$request = json_decode($post);
$username = $request->username;
$password = md5($request->password);

if(isset($username)){
include("connection.php");
//echo "select userid from logindetails where emailaddress='$email'";
$response.="{";
//$query = "select t1.userid, t1.username, t1.emailaddress, t2.name, t1.usertype, t1.emailverified, t1.profilepicture, getTotalFollowerCount(t1.userid) from logindetails t1, basicinformation t2 where (t1.emailaddress='$username' OR t1.username='$username') and t1.userid = t2.userid and t1.password='$password'";
$query = "select t1.userid, t1.username, t1.emailaddress, t2.name, t1.usertype, t1.emailverified, t1.profilepicture, getTotalFollowerCount(t1.userid) from logindetails t1, basicinformation t2 where (t1.emailaddress='$username' OR t1.username='$username') and t1.userid = t2.userid ";
//echo $query;
$userCheck = mysqli_query($conn,$query);
//$userCheck = mysqli_query($conn,"select t1.userid, t1.username, t1.emailaddress, t2.name, t1.usertype, t1.emailverified, t1.profilepicture, getTotalFollowerCount(t1.userid) from logindetails t1, basicinformation t2 where (t1.emailaddress='$username' OR t1.username='$username') and t1.userid = t2.userid ");
//echo "select t1.userid, t1.username, t1.emailaddress, t2.name, t1.usertype, t1.emailverified, t1.profilepicture, getTotalFollowerCount(t1.userid) from logindetails t1, basicinformation t2 where (t1.emailaddress='$username' OR t1.username='$username') and t1.userid = t2.userid and t1.password='$password'";
if (($res1=mysqli_fetch_row($userCheck))) {
        if($res1[5]=='Y')
                $response.='"loginStatus":"successful"';
        else
                $response.='"loginStatus":"unverified"';
        $response.=',"userid":"'.$res1[0].'"';
        $response.=',"username":"'.$res1[1].'"';
        $response.=',"emailaddress":"'.$res1[2].'"';
        $response.=',"name":"'.$res1[3].'"';
        $response.=',"usertype":"'.$res1[4].'"';
        $response.=',"profilepicture":"'.$res1[6].'"';
        $response.=',"followerCount":"'.$res1[7].'"';
}else{
	$response.=' "loginStatus" : "failed" ';
}
$response.="}";
}
echo json_encode($response);
?>