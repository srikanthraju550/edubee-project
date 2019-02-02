<?php
include("connection.php");
echo '[';
$result=mysqli_query($conn, "select * from cityconfig");
$sliderContent=mysqli_query($conn, "select * from slidercontent where imageType='homePageSlider'");
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

//$result=mysqli_query($conn, "select * from cityconfig");
$teamDetails=mysqli_query($conn, "select * from ourteamdetails");

if(mysqli_num_rows($teamDetails)){
    echo ',{"teamDetails":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($teamDetails)){
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

$techarticledetails=mysqli_query($conn, "select
t1.articleid
,t2.emailaddress
,t3.contactnumber
,t1.articletitle
,t1.abstract
,t1.articlepaymentindcd
,t1.cost
,t1.publicationlink
,t1.createdby
,t1.createdon
,t1.updatedby
,t1.updatedon
,t1.articlecontent
,t1.articletype
,getCountValueForArticle(t1.articleid, 'UP') as upCount
,getCountValueForArticle(t1.articleid, 'DOWN') as downCount
,t1.userId
,t2.profilepicture
,t3.name
,t4.technologyname
,t5.subtechname
,t1.authcode
from techarticledetails t1
,logindetails t2
,basicinformation t3
,technologyconfig t4
,subtechnologyconfig t5
where t1.userid = t2.userid
and t2.userid = t3.userid
and t1.technology=t4.technologyid
and t1.subtechnology=t5.subtechid
and t1.articleStatus='pending';");


    echo ',{"techarticledetails":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($techarticledetails)){
        //  cast results to specific data types

        if($first) {
            $first = false;
        } else {
            echo ',';
        }
        echo json_encode($row);
    }
    echo ']}';




$homePageData=mysqli_query($conn, "select * from homepage");

if(mysqli_num_rows($homePageData)){
    echo ',{"homePageData":{';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    //echo mysqli_num_rows($homePageData);
    //$i=1;
    while($row=mysqli_fetch_assoc($homePageData)){
        //  cast results to specific data types
//echo $row['contentname'];
//echo $row['contentvalue'];
        if($first) {
            $first = false;
        } else {
            echo ',';
        }
        echo '"'.$row['contentname'].'":"'.$row['contentvalue'].'"';
  //      echo json_encode($row);
    }
    echo '}}';
} 


$techtalkdetails=mysqli_query($conn, "select 
t1.techtalkid
,t10.techTalkTypeValue as techtalktype
,t1.techtalktopic
,t1.technology
,t1.subtechnology
,t1.speakerid
,t1.originatorid
,t1.venueid
,t1.regdetailid
,t4.name as originatorname
,t8.emailaddress as originatoremail
,t4.contactnumber as originatorcontactnumber
,t2.technologyname
,t3.subtechname
,t6.place
,t6.city
,t6.address
,t6.venuedate
,t6.fromtime
,t6.totime
,t7.webaddress
,t7.maxregcount
,t7.regfee
,t7.posterlink
,t7.eligibility
,t7.seatcapacity
,t5.name as speakername
,t5.company
,t5.speakertype
,t5.workinglocation
,t5.position
,t5.experience
,t1.createdon
,getRegistrationCountForEvents(t1.techtalkid,'techTalk') as registrationCount
,t1.authcode
from 
techtalkdetails t1,
technologyconfig t2,
subtechnologyconfig t3,
basicinformation t4,
panelspeakers t5,
venuedetails t6,
registrationdetails t7,
logindetails t8,
techtalktypeconfig t10
where 
t1.technology=t2.technologyid
and t1.subtechnology=t3.subtechid
and t1.speakerid = t5.speakerid
and t1.originatorid = t4.userid
and t1.venueid = t6.venueid
and t1.regdetailid = t7.regdetailid
and t8.userid =t4.userid
and t1.techtalktype=t10.typeId
and t1.techtalkstatus='pending';");


    echo ',{"techtalkdetails":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($techtalkdetails)){
        //  cast results to specific data types

        if($first) {
            $first = false;
        } else {
            echo ',';
        }
        echo json_encode($row);
    }
    echo ']}';


$techteachdetails=mysqli_query($conn, "select 
t1.techteachid
,t1.topic
,t1.abstract
,t1.technologyarea
,t1.technology
,t1.subtechnology
,t1.expertid
,t1.originatorid
,t1.venueid
,t1.regdetailid
,t4.name as originatorname
,t8.emailaddress as originatoremail
,t4.contactnumber as originatorcontactnumber
,t2.technologyname
,t3.subtechname
,t6.place
,t6.city
,t6.address
,t6.venuedate
,t6.fromtime
,t6.totime
,t7.webaddress
,t7.maxregcount
,t7.regfee
,t7.posterlink
,t7.eligibility
,t7.seatcapacity
,t5.name as speakername
,t5.company
,t5.speakertype
,t5.workinglocation
,t5.position
,t5.experience
,t1.createdon
,getRegistrationCountForEvents(t1.techteachid,'techTeach') as registrationCount
,t1.authcode
from 
techteachdetails t1,
technologyconfig t2,
subtechnologyconfig t3,
basicinformation t4,
panelspeakers t5,
venuedetails t6,
registrationdetails t7,
logindetails t8
where 
t1.technology=t2.technologyid
and t1.subtechnology=t3.subtechid
and t1.expertid = t5.speakerid
and t1.originatorid = t4.userid
and t1.venueid = t6.venueid
and t1.regdetailid = t7.regdetailid
and t8.userid = t4.userid
and t1.techteachstatus='pending';");


    echo ',{"techteachdetails":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($techteachdetails)){
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

if(mysqli_num_rows($technologyconfig)){
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
} 

$subtechnologyconfig=mysqli_query($conn, "select * from subtechnologyconfig ;");

if(mysqli_num_rows($subtechnologyconfig)){
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
} 

$techtalktypeconfig=mysqli_query($conn, "select * from techtalktypeconfig ;");

if(mysqli_num_rows($techtalktypeconfig)){
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
} 

$techarticleregistration=mysqli_query($conn, "select
t1.id,
t1.articleid,
t1.registereduserid,
t3.name as authorname,
t2.articletitle,
t2.abstract
from techarticleregistration t1, 
techarticledetails t2, 
basicinformation t3
where t1.articleid = t2.articleid
and t1.registereduserid=t3.userid;");

if(mysqli_num_rows($techarticleregistration)){
    echo ',{"techarticleregistration":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($techarticleregistration)){
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

$techteachregistration=mysqli_query($conn, "select
t1.id,
t1.eventid,
t1.registereduserid,
t3.name as authorname,
t2.topic,
t2.abstract
from techeventsregistration t1, 
techteachdetails t2, 
basicinformation t3
where t1.eventid = t2.techteachid
and t1.registereduserid=t3.userid
and t1.eventtype='techTeach';");

if(mysqli_num_rows($techteachregistration)){
    echo ',{"techteachregistration":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($techteachregistration)){
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

$techtalkregistration=mysqli_query($conn, "select
t1.id,
t1.eventid,
t1.registereduserid,
t3.name as authorname,
t2.techtalktopic,
t4.techTalkTypeValue
from techeventsregistration t1, 
techtalkdetails t2, 
basicinformation t3,
techtalktypeconfig t4
where t1.eventid = t2.techtalkid
and t1.registereduserid=t3.userid
and t1.eventtype='techTalk'
and t4.typeId=t2.techtalktype;");

if(mysqli_num_rows($techtalkregistration)){
    echo ',{"techtalkregistration":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($techtalkregistration)){
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

$stuvationdetails=mysqli_query($conn, "select 
    t1.projectId as stuvationid,
    t1.projectId	,
    t9.stuvationTypeValue as projectType,
    t1.projectTitle	,
    t1.abstract	,
    t1.projectStatus	,
    t1.technology	,
    t1.subTechnology	,
    t1.idea	,
    t1.ideaDescription	,
    t1.prototypeAvailable	,
    t1.referenceLink	,
    t1.expectedBudget	,
    t1.lookingProfessorGuidance	,
    t1.lookingMentorship	,
    t1.lookingStudentPartner	,
    t1.teamSize	,
    t1.lastDateOfJoining	,
    t1.lookingSponsorship	,
    t1.noOfSponsors	,
    t1.userid,
    t1.authcode
,t4.name as originatorname
,t8.emailaddress as originatoremail
,t4.contactnumber as originatorcontactnumber
,t2.technologyname
,t3.subtechname
,t1.createdon
from 
stuvationdetails t1,
technologyconfig t2,
subtechnologyconfig t3,
basicinformation t4,
logindetails t8,
stuvationtypeconfig t9
where 
t1.technology=t2.technologyid
and t1.subtechnology=t3.subtechid
and t1.userid = t4.userid
and t8.userid =t4.userid
and t1.projectType = t9.typeId
and t1.stuvationstatus='pending';");


    echo ',{"stuvationdetails":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($stuvationdetails)){
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