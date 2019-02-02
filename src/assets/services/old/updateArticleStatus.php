<?php
$response="";
if(isset($_REQUEST['articleId'])){
$articleId=$_REQUEST['articleId'];
$approvalStatus=$_REQUEST['approvalStatus'];
$authCode=$_REQUEST['authCode'];
include("connection.php");
$response.="{";
    $userCheck = mysqli_query($conn,"select t1.authcode from techarticledetails t1 where t1.articleid = $articleId ");
    
    if (($res1=mysqli_fetch_row($userCheck))) {
            if(($res1[0]==$authCode)&&(mysqli_query($conn,"update techarticledetails set articlestatus='$approvalStatus' where articleid = $articleId "))){
                $response.='"verificationStatus":"verified"';
               // echo "alert('Article Verified Successfully')";
            }
            else{
                $response.='"verificationStatus":"unverified"';
              //  echo "alert('Article Verification Failed')";
            }
    }else{
        $response.=' "accountStatus" : "notExists" ';
        //echo "alert('User doesnot exist')";
    }
$response.="}";
}
header('Content-Type: application/json');
echo json_encode($response);
?>