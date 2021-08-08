let request = require("request");
let cheerio = require("cheerio");
// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
let fs = require("fs");
function processSinglematch(url) {

    request(url, cb);
}
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
    let $ = cheerio.load(html);
    let bestPlayer = $(".best-player-name"); 
    bestPlayer = bestPlayer.text();
    
    let descElem = $(".event .description");
    let stringArr = descElem.text().split(",");
    let venue = stringArr[1].trim();
    let date = stringArr[2].trim();
    let result = $(".event .status-text");
    result = result.text();
    
    let innings = $(".card.content-block.match-scorecard-table>.Collapsible");
    
    console.log("--------------------------");
    console.log("Venue: ",venue);
    console.log("Date: ",date);
    
    for(let i = 0; i < innings.length; i++){
        let teamName = $(innings[i]).find("h5").text();
        teamName = teamName.split("INNINGS")[0].trim();
        console.log(teamName);      
              
        let allRows = $(innings[i]).find(".table.batsman tbody tr");
        for(let j = 0; j < allRows.length; j++){
            let allCols = $(allRows[j]).find("td");
            if (allCols.length == 8) {
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let sr = $(allCols[7]).text().trim();
                console.log(playerName + "||" + "Runs:",runs + "||" + "Balls Played:",balls + "||" + "Fours:",fours + "||" + "Sixes:",sixes + "||" + "SR:",sr + " ");
                
            }            
        }  
    }
    console.log("Result: ",result);
    console.log("Player of the Match: ",bestPlayer);
    console.log("--------------------------");
    
} 

module.exports = {
    processSinglematch
}