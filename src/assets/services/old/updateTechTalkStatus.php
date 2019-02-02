<?php
$response="";
if(isset($_REQUEST['techtalkId'])){
$techtalkId=$_REQUEST['techtalkId'];
$approvalStatus=$_REQUEST['approvalStatus'];
$authCode=$_REQUEST['authCode'];
include("connection.php");
$response.="{";
    $userCheck = mysqli_query($conn,"select t1.authcode from techtalkdetails t1 where t1.techtalkid = $techtalkId ");
    
    if (($res1=mysqli_fetch_row($userCheck))) {
            if(($res1[0]==$authCode)&&(mysqli_query($conn,"update techtalkdetails set techtalkstatus='$approvalStatus' where techtalkid = $techtalkId "))){
               $response.='"verificationStatus":"verified"';
               // echo "alert('Techtalk Verified Successfully')";
            }
            else{
                $response.='"verificationStatus":"unverified"';
              //  echo "alert('Techtalk Verification Failed')";
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