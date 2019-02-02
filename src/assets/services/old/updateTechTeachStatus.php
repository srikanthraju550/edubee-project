<?php
$response="";
if(isset($_REQUEST['techteachId'])){
$techteachId=$_REQUEST['techteachId'];
$approvalStatus=$_REQUEST['approvalStatus'];
$authCode=$_REQUEST['authCode'];
include("connection.php");
$response="{";
    $userCheck = mysqli_query($conn,"select t1.authcode from techteachdetails t1 where t1.techteachid = $techteachId ");
    
    if (($res1=mysqli_fetch_row($userCheck))) {
            if(($res1[0]==$authCode)&&(mysqli_query($conn,"update techteachdetails set techteachstatus='$approvalStatus' where techteachid = $techteachId "))){
               $response.='"verificationStatus":"verified"';
               // echo "alert('Techteach Verified Successfully')";
            }
            else{
                $response.='"verificationStatus":"unverified"';
                //echo "alert('Techteach Verification Failed')";
            }
    }else{
        $response.=' "accountStatus" : "notExists" ';
       // echo "alert('User doesnot exist')";
    }
    $response.="}";
}
header('Content-Type: application/json');
echo json_encode($response);
?>