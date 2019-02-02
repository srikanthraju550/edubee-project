import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {

    transform(inputArray: any, filterValue: any, keywordFilter: any, articleTypeFilter: any, techFilter: any, subTechFilter: any, authorFilter: any, freeFilter: any, filterType: any): any {
        console.log(filterValue);
        console.log((!keywordFilter && !articleTypeFilter && !techFilter && !subTechFilter && !authorFilter && !freeFilter));
        //check if search term is undefined
        if ((!keywordFilter && !articleTypeFilter && !techFilter && !subTechFilter && !authorFilter && !freeFilter)) return inputArray;
        //return updates people array
        if (filterValue === undefined)
            return inputArray;
        else
            return inputArray.filter(function (subElement) {

                if (filterType == 'articleFilter') {
                    if (keywordFilter && (subElement.articletitle.toLowerCase().includes(filterValue.toLowerCase()) || subElement.abstract.toLowerCase().includes(filterValue.toLowerCase()))) {
                        return subElement;
                    }
                    if (articleTypeFilter && subElement.articletype.toLowerCase().includes(filterValue.toLowerCase())) {
                        return subElement;
                    }
                    if (techFilter && subElement.technologyname.toLowerCase().includes(filterValue.toLowerCase())) {
                        return subElement;
                    }
                    if (subTechFilter && subElement.subtechname.toLowerCase().includes(filterValue.toLowerCase())) {
                        return subElement;
                    }
                    if (authorFilter && subElement.name.toLowerCase().includes(filterValue.toLowerCase())) {
                        return subElement;
                    }
                    if (freeFilter && subElement.name.toLowerCase().includes('N')) {
                        return subElement;
                    }
                } else if (filterType == 'techEventFilter') {
                    if (keywordFilter && (subElement.topic.toLowerCase().includes(filterValue.toLowerCase()) || subElement.abstract.toLowerCase().includes(filterValue.toLowerCase()))) {
                        return subElement;
                    }
                    if (techFilter && subElement.technologyname.toLowerCase().includes(filterValue.toLowerCase())) {
                        return subElement;
                    }
                    if (subTechFilter && subElement.subtechname.toLowerCase().includes(filterValue.toLowerCase())) {
                        return subElement;
                    }
                    if (authorFilter && subElement.name.toLowerCase().includes(filterValue.toLowerCase())) {
                        return subElement;
                    }
                    if (freeFilter && subElement.name.toLowerCase().includes('N')) {
                        return subElement;
                    }
                } else if (filterType == 'techTalkFilter') {
                    if (keywordFilter && (subElement.topic.toLowerCase().includes(filterValue.toLowerCase()))) {
                        return subElement;
                    }
                    if (techFilter && subElement.technologyname.toLowerCase().includes(filterValue.toLowerCase())) {
                        return subElement;
                    }
                    if (subTechFilter && subElement.subtechname.toLowerCase().includes(filterValue.toLowerCase())) {
                        return subElement;
                    }
                    if (authorFilter && subElement.name.toLowerCase().includes(filterValue.toLowerCase())) {
                        return subElement;
                    }
                    if (freeFilter && subElement.name.toLowerCase().includes('N')) {
                        return subElement;
                    }
                } else if (filterType == 'stuvationFilter') {
                    if (keywordFilter && (subElement.originatorname.toLowerCase().includes(filterValue.toLowerCase()) || subElement.projectTitle.toLowerCase().includes(filterValue.toLowerCase()) || subElement.abstract.toLowerCase().includes(filterValue.toLowerCase()) || subElement.idea.toLowerCase().includes(filterValue.toLowerCase()) || subElement.ideaDescription.toLowerCase().includes(filterValue.toLowerCase()))) {
                        return subElement;
                    }
                    if (techFilter && subElement.technologyname.toLowerCase().includes(filterValue.toLowerCase())) {
                        return subElement;
                    }
                    if (subTechFilter && subElement.subtechname.toLowerCase().includes(filterValue.toLowerCase())) {
                        return subElement;
                    }
                    if (articleTypeFilter && subElement.projectType.toLowerCase().includes(filterValue.toLowerCase())) {
                        return subElement;
                    }
                    
                } else if (filterType == 'mentorFilter') {
                    /* if (keywordFilter && (subElement.originatorname.toLowerCase().includes(filterValue.toLowerCase()) || subElement.projectTitle.toLowerCase().includes(filterValue.toLowerCase()) || subElement.abstract.toLowerCase().includes(filterValue.toLowerCase()) || subElement.idea.toLowerCase().includes(filterValue.toLowerCase()) || subElement.ideaDescription.toLowerCase().includes(filterValue.toLowerCase()))) {
                        return subElement;
                    } */
                    /* if (techFilter && subElement.technologyname.toLowerCase().includes(filterValue.toLowerCase())) {
                        return subElement;
                    }
                    if (subTechFilter && subElement.subtechname.toLowerCase().includes(filterValue.toLowerCase())) {
                        return subElement;
                    }
                    if (articleTypeFilter && subElement.timeSpend.toLowerCase().includes(filterValue.toLowerCase())) {
                        return subElement;
                    } */
                    
                }


                /* //Tech Teach Section
                if (subElement.techtalktopic == undefined && subElement.publicationlink == undefined) {
                    if (subElement.abstract.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.technologyarea.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.address.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.city.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.company.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.eligibility.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.experience.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.fromtime.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.maxregcount.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.originatorcontactnumber.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.originatoremail.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.originatorname.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.place.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.position.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.regfee.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.seatcapacity.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.speakername.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.speakertype.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.subtechname.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.technologyname.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.totime.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.venuedate.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.webaddress.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.workinglocation.toLowerCase().includes(filterValue.toLowerCase())
                    )
                        return subElement;
                } else if (subElement.techtalktopic != undefined) {
                    //Tech Talk section
                    if (subElement.address.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.city.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.company.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.eligibility.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.experience.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.fromtime.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.maxregcount.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.originatorcontactnumber.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.originatoremail.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.originatorname.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.place.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.position.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.regfee.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.seatcapacity.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.speakername.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.speakertype.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.subtechname.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.technologyname.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.techtalktopic.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.techtalktype.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.totime.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.venuedate.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.webaddress.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.workinglocation.toLowerCase().includes(filterValue.toLowerCase())
                    )
                        return subElement;
                } else if (subElement.publicationlink != undefined) {
                    //tech article section
                    if (subElement.abstract.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.articletitle.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.contactnumber.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.cost.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.downCount.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.emailaddress.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.name.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.publicationlink.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.publishedMonth.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.publishedYear.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.subtechname.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.technologyname.toLowerCase().includes(filterValue.toLowerCase())
                        || subElement.upCount.toLowerCase().includes(filterValue.toLowerCase())
                    )
                        return subElement;
                } */

            });

    }

}