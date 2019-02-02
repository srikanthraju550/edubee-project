<?php
include("connection.php");
if(isset($_REQUEST['userid'])){
    $followerId = $_REQUEST['userid'];
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
$techarticledetailsQuery="select
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
,t1.userId as userid
,t2.profilepicture
,t3.name
,t4.technologyname
,t5.subtechname
,getTotalFollowerCount(t1.userId) as followerCount";
if(isset($followerId)){
    $techarticledetailsQuery.=",isUserFollowed(t1.userId, $followerId) as isFollowed ";
}

$techarticledetailsQuery.=" from techarticledetails t1
,logindetails t2
,basicinformation t3
,technologyconfig t4
,subtechnologyconfig t5
where t1.userid = t2.userid
and t2.userid = t3.userid
and t1.technology=t4.technologyid
and t1.subtechnology=t5.subtechid
and t1.articlestatus='approved' order by t1.createdon desc";

//echo $techarticledetailsQuery;
$techarticledetails=mysqli_query($conn, $techarticledetailsQuery);



    echo ',{"techarticledetails":[';
if(mysqli_num_rows($techarticledetails)){
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
    } 
    echo ']}';




$homePageData=mysqli_query($conn, "select *from homepage");

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
and t1.techtalkstatus='approved' order by t1.createdon desc;");


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
,t10.techTeachTypeValue as techteachtype
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
from 
techteachdetails t1,
technologyconfig t2,
subtechnologyconfig t3,
basicinformation t4,
panelspeakers t5,
venuedetails t6,
registrationdetails t7,
logindetails t8,
techteachtypeconfig t10
where 
t1.technology=t2.technologyid
and t1.subtechnology=t3.subtechid
and t1.expertid = t5.speakerid
and t1.originatorid = t4.userid
and t1.venueid = t6.venueid
and t1.regdetailid = t7.regdetailid
and t8.userid = t4.userid
and t1.techteachtype=t10.typeId
and t1.techteachstatus='approved'  order by t1.createdon desc;");


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


$technologyconfig=mysqli_query($conn, "select * from technologyconfig order by technologyname asc;");


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


$subtechnologyconfig=mysqli_query($conn, "select * from subtechnologyconfig order by subtechname asc;");


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

    $techteachtypeconfig=mysqli_query($conn, "select * from techteachtypeconfig ;");


    echo ',{"techteachtypeconfig":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($techteachtypeconfig)){
        //  cast results to specific data types

        if($first) {
            $first = false;
        } else {
            echo ',';
        }
        echo json_encode($row);
    }
    echo ']}';

    $stuvationdetailsQuery="select 
    t1.projectId as stuvationid,
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
	t8.profilepicture,
    t1.authcode
    ,t4.name as originatorname
    ,t8.emailaddress as originatoremail
    ,t4.contactnumber as originatorcontactnumber
    ,t2.technologyname
    ,t3.subtechname
    ,t1.createdon
    ,t1.userId,
    getCountValueForStuvation(t1.projectId, 'UP') as upCount
    ,getCountValueForStuvation(t1.projectId, 'DOWN') as downCount
    ,getTotalFollowerCount(t1.userId) as followerCount ";
    if(isset($followerId)){
        $stuvationdetailsQuery.=",isUserFollowed(t1.userId, $followerId) as isFollowed ";
    }
    $stuvationdetailsQuery.=" from 
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
    and t1.stuvationstatus='approved' order by t1.createdon desc;";
$stuvationdetails=mysqli_query($conn, $stuvationdetailsQuery);
//echo $stuvationdetailsQuery;
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

    $stuvationtypeconfig=mysqli_query($conn, "select * from stuvationtypeconfig where typeId!=5 ;");


    echo ',{"stuvationtypeconfig":[';

    $first = true;
    //$row=mysqli_fetch_assoc($result);
    //mysqli_fetch_field($result)
    while($row=mysqli_fetch_assoc($stuvationtypeconfig)){
        //  cast results to specific data types

        if($first) {
            $first = false;
        } else {
            echo ',';
        }
        echo json_encode($row);
    }
    echo ']}';
    $qr = "CALL getHomePageCounterValues(
        @techTalkCount, 
        @techMeetCount,
        @studentCount,
        @engineerCount,
        @stuvationCount,
        @projectMeCount); ";
        //echo $qr;
        mysqli_query($conn, $qr);

        $getHomePageCounterValues=mysqli_query($conn, "select 
        @techTalkCount, 
        @techMeetCount,
        @studentCount,
        @engineerCount,
        @stuvationCount,
        @projectMeCount;");
        
            echo ',{"getHomePageCounterValues":[';
        
            $first = true;
            //$row=mysqli_fetch_assoc($result);
            //mysqli_fetch_field($result)
            while($row=mysqli_fetch_assoc($getHomePageCounterValues)){
                //  cast results to specific data types
        
                if($first) {
                    $first = false;
                } else {
                    echo ',';
                }
                echo json_encode($row);
            }
            echo ']}';


            $engshipdetailsQuery="select 
            t1.engshipId,
            t1.engshipType,
            t1.organization,
            t1.position	,
            t1.workLocation	,
            t1.country	,
            t1.technology	,
            t1.subTechnology	,
            t1.timeSpend	,
            t1.numberOfHours	,
            t1.membershipChargeFlag	,
            t1.membershipCharge	,
            t1.willingToTravelFlag	,
            t1.usedServicesBeforeFlag	,
            t1.lookingForEFSupportFlag	,
            t1.tncAcceptFlag	,
            t1.lookingFor	,
            t1.mentorId	,
            t1.menteeId
        ,t4.name as originatorname
        ,t8.emailaddress as originatoremail
        ,t4.contactnumber as originatorcontactnumber
        ,t2.technologyname
        ,t3.subtechname
        ,t1.createdon,
        t1.branch,
        t1.college,
        t1.tenthPercent,
	t1.plustwoPercent,
	t1.graduationPercent,
	t1.postgradPercent,
    t1.learningGoals,
    t1.createdBy ";
        
        $engshipdetailsQuery.=" from 
        engshipdetails t1,
        technologyconfig t2,
        subtechnologyconfig t3,
        basicinformation t4,
        logindetails t8
        where 
        t1.technology=t2.technologyid
        and t1.subtechnology=t3.subtechid ";
        $engshipMentorQuery =  $engshipdetailsQuery." and t1.mentorId is not null and t1.mentorId = t4.userid
        and t8.userid =t4.userid ";
        $engshipMenteeQuery = $engshipdetailsQuery." and t1.menteeId is not null and t1.menteeId = t4.userid
        and t8.userid =t4.userid ";
        $engshipMentorQuery.="order by t1.createdon desc;";
        $engshipMenteeQuery.="order by t1.createdon desc;";
        //echo $engshipMentorQuery;
        //echo $engshipMenteeQuery;
        $engshipMentordetails=mysqli_query($conn, $engshipMentorQuery);
        
            echo ',{"engshipMentordetails":[';
        
            $first = true;
            //$row=mysqli_fetch_assoc($result);
            //mysqli_fetch_field($result)
            while($row=mysqli_fetch_assoc($engshipMentordetails)){
                //  cast results to specific data types
        
                if($first) {
                    $first = false;
                } else {
                    echo ',';
                }
                echo json_encode($row);
            }
            echo ']}';

            $engshipMenteedetails=mysqli_query($conn, $engshipMenteeQuery);
        
            echo ',{"engshipMenteedetails":[';
        
            $first = true;
            //$row=mysqli_fetch_assoc($result);
            //mysqli_fetch_field($result)
            while($row=mysqli_fetch_assoc($engshipMenteedetails)){
                //  cast results to specific data types
        
                if($first) {
                    $first = false;
                } else {
                    echo ',';
                }
                echo json_encode($row);
            }
            echo ']}';


            if(isset($_REQUEST['userid'])){
            $engshipdetailsQuery="select 
            t1.engshipId,
            t1.engshipType,
            t1.organization,
            t1.position	,
            t1.workLocation	,
            t1.country	,
            t1.technology	,
            t1.subTechnology	,
            t1.timeSpend	,
            t1.numberOfHours	,
            t1.membershipChargeFlag	,
            t1.membershipCharge	,
            t1.willingToTravelFlag	,
            t1.usedServicesBeforeFlag	,
            t1.lookingForEFSupportFlag	,
            t1.tncAcceptFlag	,
            t1.lookingFor	,
            t1.mentorId	,
            t1.menteeId
        ,t4.name as originatorname
        ,t8.emailaddress as originatoremail
        ,t4.contactnumber as originatorcontactnumber
        ,t2.technologyname
        ,t3.subtechname
        ,t1.createdon,
        t1.branch,
        t1.college,
        t1.tenthPercent,
	t1.plustwoPercent,
	t1.graduationPercent,
	t1.postgradPercent,
    t1.learningGoals,
    t1.createdBy ";
        
        $engshipdetailsQuery.=" from 
        engshipdetails t1,
        technologyconfig t2,
        subtechnologyconfig t3,
        basicinformation t4,
        logindetails t8,
        engshipregistration t9
        where 
        t1.technology=t2.technologyid
        and t1.subtechnology=t3.subtechid ";
        $engshipMentorQuery =  $engshipdetailsQuery." and t9.mentorId = $followerId and t1.engshipId=t9.engshipId and t8.userid =t9.menteeId and t8.userid =t4.userid   ";
        $engshipMenteeQuery = $engshipdetailsQuery." and t9.menteeId = $followerId and t1.engshipId=t9.engshipId and t8.userid =t9.mentorId and t8.userid =t4.userid  ";
        $engshipMentorQuery.="order by t1.createdon desc;";
        $engshipMenteeQuery.="order by t1.createdon desc;";
        //echo $engshipMentorQuery;
        //echo $engshipMenteeQuery;
        $engshipMentordetails=mysqli_query($conn, $engshipMentorQuery);
        
            echo ',{"engshipMentorRequestdetails":[';
        
            $first = true;
            //$row=mysqli_fetch_assoc($result);
            //mysqli_fetch_field($result)
            while($row=mysqli_fetch_assoc($engshipMentordetails)){
                //  cast results to specific data types
        
                if($first) {
                    $first = false;
                } else {
                    echo ',';
                }
                echo json_encode($row);
            }
            echo ']}';

            $engshipMenteedetails=mysqli_query($conn, $engshipMenteeQuery);
        
            echo ',{"engshipMenteeRequestdetails":[';
        
            $first = true;
            //$row=mysqli_fetch_assoc($result);
            //mysqli_fetch_field($result)
            while($row=mysqli_fetch_assoc($engshipMenteedetails)){
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
echo ']';
//mysqli_close($db);
?>