// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
let xlsx = require("xlsx");
function processSinglematch(url) {

    request(url, cb);
}
function cb(error, response, html) {

    if (error) {
        console.log(error); // Print the error if one occurred
    } else if (response.statusCode == 404) {
        console.log("Page Not Found")
    }
    else {
        // console.log(html); // Print the HTML for the request made 
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
    console.log("--------------------------");
    console.log("Venue: ",venue);
    console.log("Date: ",date);
    let innings = $(".Collapsible");
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
                processPlayer(playerName, teamName, runs, balls, fours, sixes, sr, venue, date, result);
            }            
        }  
    }
    console.log("Result: ",result);
    console.log("Player of the Match: ",bestPlayer);
    console.log("--------------------------");
    
} 
function processPlayer(playerName, teamName, runs, balls, fours, sixes, sr, venue, date, result) {
    let obj = {
        playerName,
        teamName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        venue,
        date,
        result
    }
    let dirPath = path.join(__dirname, teamName);
    //    folder 
    if (fs.existsSync(dirPath) == false) {
        fs.mkdirSync(dirPath)
    }
    // playerfile 
    //let playerFilePath = path.join(dirPath, playerName + ".json");
    let playerFilePath = path.join(dirPath, playerName + ".xlsx");
    let playerArray = [];
    if (fs.existsSync(playerFilePath) == false) {
        playerArray.push(obj);
    } else {
        // append
        //playerArray = getContent(playerFilePath);
        playerArray = excelReader(playerFilePath, playerName);
        playerArray.push(obj);
    }
    // write in the files
    // writeContent(playerFilePath, playerArray);
    excelWriter(playerFilePath, playerArray, playerName);
}
// function getContent(playerFilePath) {
//     let content = fs.readFileSync(playerFilePath);
//     return JSON.parse(content);
// }
/*
function writeContent(playerFilePath, content) {
    let jsonData = JSON.stringify(content)
    fs.writeFileSync(playerFilePath, jsonData);
}*/
module.exports = {
    processSinglematch
}

function excelWriter(filePath, json, sheetName) {
    // workbook create
    let newWB = xlsx.utils.book_new();
    // worksheet
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    // excel file create 
    xlsx.writeFile(newWB, filePath);
}

function excelReader(filePath, sheetName) {
    // player workbook
    let wb = xlsx.readFile(filePath);
    // get data from a particular sheet in that wb
    let excelData = wb.Sheets[sheetName];
    // sheet to json 
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}
