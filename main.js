let request = require("request");
let cheerio = require("cheerio");
let scoreCardObj = require("./scorecard");

let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
request(url, cb);

function cb(error,response,html){
    if(error){
        console.log(error); 
    }else if(response.statusCode == 404){
        console.log("Page Not Found");
    }else{
        //console.log(html); 
        dataExtracter(html);
    }
}


function dataExtracter(html){
    let searchTool = cheerio.load(html);
    let anchorrep = searchTool('a[data-hover="View All Results"]');
    let link = anchorrep.attr("href");
    let fullLink = `https://www.espncricinfo.com${link}`;
    request(fullLink, allMatchPageCb);
        
}

function allMatchPageCb(error,response,html){
    if(error){
        console.log(error);
    }else if(response.statusCode == 404){
        console.log("Page Not Found");
    }else{
        //console.log(html);
        getAllScorecardLink(html);
    }
} 


function getAllScorecardLink(html){
    let $ = cheerio.load(html);
    let scorecardArr = $("a[data-hover='Scorecard']");
   for (let i = 0; i < scorecardArr.length; i++) {
        let link = $(scorecardArr[i]).attr("href");
        let fullPath= `https://www.espncricinfo.com${link}`;
        //console.log(fullPath);
        scoreCardObj.processSinglematch(fullPath)
    }
    //console.log("************************");
}
 
