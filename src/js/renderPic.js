import person1 from '../assets/img/person1.png';
import person2 from '../assets/img/person2.png';
import person3 from '../assets/img/person3.png';
import person4 from '../assets/img/person4.png';
import person5 from '../assets/img/person5.png';
import person6 from '../assets/img/person6.png';
import person7 from '../assets/img/person7.png';
import person8 from '../assets/img/person8.png';
function renderHeadPic(uid) {
    // uid 用户id
    var rankNum = uid % 8 + 1;
    var headPic = '';
    switch (rankNum) {
        case 1:
            headPic = person1;
            break;
        case 2:
            headPic = person2;
            break;
        case 3:
            headPic = person3;
            break;
        case 4:
            headPic = person4;
            break;
        case 5:
            headPic = person5;
            break;
        case 6:
            headPic = person6;
            break;
        case 7:
            headPic = person7;
            break;
        case 8:
            headPic = person8;
            break;
        default:
            break;
    }
    return headPic;
}

export default renderHeadPic;
    // renderHeadPic(item) {
    //     if (item) {
    //         var info = JSON.parse(localStorage.getItem('staffInfo-'+item.respondentId)) || JSON.parse(localStorage.getItem('staffInfo-'+item.employeeNameId));
    //         var headPic = '';
    //         if (info) {
    //             if (!info.name) {
    //                 localStorage.setItem('staffInfo-'+item.respondentId,JSON.stringify({id:item.respondentId,name:item.respondent,headPic: info.headPic})) || localStorage.setItem('staffInfo-'+item.employeeNameId,JSON.stringify({id:item.employeeNameId,name:item.employeeName,headPic: info.headPic}));
    //                 return info.headPic;
    //             } else {
    //                 return info.headPic;
    //             }
    //         } else {
    //             var rankNum = Math.floor(Math.random()*8+1)
    //             switch (rankNum) {
    //                 case 1:
    //                     headPic = person1;
    //                     break;
    //                 case 2:
    //                     headPic = person2;
    //                     break;
    //                 case 3:
    //                     headPic = person3;
    //                     break;
    //                 case 4:
    //                     headPic = person4;
    //                     break;
    //                 case 5:
    //                     headPic = person5;
    //                     break;
    //                 case 6:
    //                     headPic = person6;
    //                     break;
    //                 case 7:
    //                     headPic = person7;
    //                     break;
    //                 case 8:
    //                     headPic = person8;
    //                     break;
    //                 default:
    //                     break;
    //             }
    //             localStorage.setItem('staffInfo-'+item.respondentId,JSON.stringify({id:item.respondentId,name:item.respondent,headPic:headPic})) || localStorage.setItem('staffInfo-'+item.employeeNameId,JSON.stringify({id:item.employeeNameId,name:item.employeeName,headPic:headPic}));
    //             return headPic
    //         }
    //     }
    // }


