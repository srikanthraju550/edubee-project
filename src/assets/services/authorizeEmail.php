<?php
if(isset($_REQUEST['authCode'])){
$authCode=$_REQUEST['authCode'];
$userId=$_REQUEST['userId'];
include("connection.php");
//$response.="{";

    $userCheck = mysqli_query($conn,"select t1.verificationCode from logindetails t1 where t1.userid = $userId ");
    
    if (($res1=mysqli_fetch_row($userCheck))) {
            if(($res1[0]==$authCode)&&(mysqli_query($conn,"update logindetails set emailVerified='Y' where userid = $userId "))){
              //  $response.='"verificationStatus":"verified"';
                echo "Account Verified Successfully. You will be redirected to our website in 3 seconds";
            }
            else{
                $response.='"verificationStatus":"unverified"';
                echo "Account Verification Failed. You will be redirected to our website in 3 seconds";
            }
                    
    }else{
        //$response.=' "accountStatus" : "notExists" ';
        echo "User doesnot exist";
    }
    //$response.="}";
		
		$newURL="http://edubee.accrosian.com/#/home";
		header( "refresh:3;url=$newURL" );
}

?>