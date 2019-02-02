<?php
$response="";
if(isset($_REQUEST['stuvationId'])){
$stuvationId=$_REQUEST['stuvationId'];
$approvalStatus=$_REQUEST['approvalStatus'];
$authCode=$_REQUEST['authCode'];
include("connection.php");
$response.="{";
    $userCheck = mysqli_query($conn,"select t1.authcode from stuvationdetails t1 where t1.projectId = $stuvationId ");
    
    if (($res1=mysqli_fetch_row($userCheck))) {
            if(($res1[0]==$authCode)&&(mysqli_query($conn,"update stuvationdetails set stuvationstatus='$approvalStatus' where projectId = $stuvationId "))){
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