<?php
include("connection.php");
if(isset($_REQUEST['userid'])){
    $userId = $_REQUEST['userid'];
}
$result=mysqli_query($conn, "select * from cityconfig");
$sliderContent=mysqli_query($conn, "select * from slidercontent where imageType='homePageSlider'");
echo '[';
if(mysqli_num_rows($sliderContent)){
    echo '{"sliderContent":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($sliderContent)){
        //  cast results to specific data types

        if($first) {
            $first = false;
        } else {
            echo ',';
        }
        echo json_encode($row);
    }
    echo ']}';
} 

$profileInformationQuery="select t1.name, t2.emailaddress, t1.contactnumber, t1.dob, t1.school, t1.schoolcityid, t1.schoolstateid, t1. college, t1.collegecityid, t1.collegestateid, t1.branch from basicinformation t1, logindetails t2 where t1.userid = t2.userid and t1.userid=".$userId;

//echo $techarticledetailsQuery;
$profileInformation=mysqli_query($conn, $profileInformationQuery);


if(mysqli_num_rows($profileInformation)){
    echo ',{"profileInformation":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($profileInformation)){
        //  cast results to specific data types

        if($first) {
            $first = false;
        } else {
            echo ',';
        }
        echo json_encode($row);
    }
    echo ']}';
} 




$stateconfig=mysqli_query($conn, "select * from stateconfig;");


    echo ',{"stateconfig":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($stateconfig)){
        //  cast results to specific data types

        if($first) {
            $first = false;
        } else {
            echo ',';
        }
        echo json_encode($row);
    }
    echo ']}';


$cityconfig=mysqli_query($conn, "select * from cityconfig;");


    echo ',{"cityconfig":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($cityconfig)){
        //  cast results to specific data types

        if($first) {
            $first = false;
        } else {
            echo ',';
        }
        echo json_encode($row);
    }
    echo ']}';


    $qr = "CALL getProfilePageCounterValues(".$userId.",@researchPaperCount, 
@whitePaperCount, 
@articleCount, 
@techTalkCount, 
@techMeetCount, 
@workshopCount, 
@trainingsCount, 
@miniProjectCount, 
@majorProjectCount, 
@stuvationCount, 
@projectsCount, 
@internshipCount, 
@scholarshipCount, 
@mentorshipCount); ";
//echo $qr;
mysqli_query($conn, $qr);
$profilePageCounterValues=mysqli_query($conn, "select @researchPaperCount, 
@whitePaperCount, 
@articleCount, 
@techTalkCount, 
@techMeetCount, 
@workshopCount, 
@trainingsCount, 
@miniProjectCount, 
@majorProjectCount, 
@stuvationCount, 
@projectsCount, 
@internshipCount, 
@scholarshipCount, 
@mentorshipCount;");

    echo ',{"profilePageCounterValues":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($profilePageCounterValues)){
        //  cast results to specific data types

        if($first) {
            $first = false;
        } else {
            echo ',';
        }
        echo json_encode($row);
    }
    echo ']}';


$technologyconfig=mysqli_query($conn, "select * from technologyconfig ;");


    echo ',{"technologyconfig":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($technologyconfig)){
        //  cast results to specific data types

        if($first) {
            $first = false;
        } else {
            echo ',';
        }
        echo json_encode($row);
    }
    echo ']}';


$subtechnologyconfig=mysqli_query($conn, "select * from subtechnologyconfig ;");


    echo ',{"subtechnologyconfig":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($subtechnologyconfig)){
        //  cast results to specific data types

        if($first) {
            $first = false;
        } else {
            echo ',';
        }
        echo json_encode($row);
    }
    echo ']}';


$techtalktypeconfig=mysqli_query($conn, "select * from techtalktypeconfig ;");


    echo ',{"techtalktypeconfig":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($techtalktypeconfig)){
        //  cast results to specific data types

        if($first) {
            $first = false;
        } else {
            echo ',';
        }
        echo json_encode($row);
    }
    echo ']}';



echo ']';
//mysqli_close($db);
?>