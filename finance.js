
var chart ;
var propertiesToDisplayOpening = [];
propertiesToDisplayDate=[];
var dataPointsOpen = [];
var dataPointsClose = []
// var dataPointsHigh = [];
// var dataPointsLow = [];

var companies = [];


async function mostSucesfullCompany(){

    
    var max = 0 ;
    var relevantCompanies =[];
    var relevantFinanceInfo = [];
    var mostSucesfull = "";

    console.log(companies);

    for ( let i = 0 ; i < 10 ; i++){
        relevantCompanies.push(companies[i].simbol);
    }

    for ( let j = 0 ; j < 10 ; j++){
        const financeInfo = await getDataSimbol(relevantCompanies[j]);
        relevantFinanceInfo.push({ 
            name: relevantCompanies[j],
            data: financeInfo
         } );
    }
    console.log(relevantFinanceInfo);

    let allAverages = [];
    for ( let i = 0 ; i < relevantFinanceInfo.length; i++){
        const stock = relevantFinanceInfo[i];
        let sum = 0 ;
        for ( let j = 0 ; j < stock.data.length ; j++){
            const dayPerformance = stock.data[j];
            const delta = dayPerformance.close - dayPerformance.open;
            sum += delta;
        }
        const average = sum / 5;
        allAverages.push({
            name: stock.name,
            average: average
         } )

    
    }


    const sortedAverages = allAverages.sort((a,b)=> {
        return b.average - a.average

    });
    console.log(sortedAverages);

    let elemenHTML = document.getElementById("resultParagraphID");
    console.log( elemenHTML
    );
    elemenHTML.classList.add("fontAwesome");
    elemenHTML.innerHTML = " The company who's shares have increased the most is " + sortedAverages[0].name + " , and the company who's shares have decreased the most is " + sortedAverages[9].name;
    elemenHTML.classList.add("resultContainer");
       
}

function addData(results) {


    chart = new CanvasJS.Chart("chartContainer", {
        axisXIndex: 1,
        backgroundColor : null,
        axisY: {
            title: "Share's value",
            suffix: " $ "},

        data: [
        {
            type: "spline",
            dataPoints:dataPointsOpen
        }, 

        {
            type: "spline",
            datapoints: dataPointsClose,
        },
        // {
        //     type: "spline",
        //     datapoints: dataPointsHigh,
        // },

        // {
        //     type: "spline",
        //     datapoints: dataPointsLow,
        // }
        
        ]
    });

    chart.render();
console.log(results); // results = first five companies
dataPointsOpen = [];
var dataPointsClose = []



for ( let i = 0 ; i < 5; i++){
    dataPointsOpen.push({ y: results[i].open, label:results[i].date,});
    dataPointsClose.push({y: results[i].close, label:results[i].date, })
} 

chart.options.data[0].dataPoints = dataPointsOpen;
chart.options.data[1].dataPoints = dataPointsClose;
// chart.options.data[2].dataPoints = dataPointsHigh;
// chart.options.data[3].dataPoints = dataPointsLow;

chart.render();
}

async function getDataSimbol(simbol) {
    let file = "https://teaching.lavbic.net/api/finance/delnice/cene/" + simbol + "?zacetek=2020-01-10&konec=2020-01-16";
    const response = await fetch(file).then(x => x.text());
    return JSON.parse(response);
}

async function onClick(value){

    var results = await getDataSimbol(value.innerHTML);
    const resultsTable = document.querySelectorAll("#resultTable tbody")[0];
    resultsTable.innerHTML = "";

    for ( let result of results){
        fillingCells(resultsTable,result);
    }
    
    addData(results);
}


function fillingCells(parentElement,rowData){

    const  rowLine= parentElement.insertRow();
    for ( let key in rowData){
        const dataCell = rowLine.insertCell();
        const newText = document.createTextNode(rowData[key]);
        dataCell.appendChild(newText);
    }
    
}

function dropDown (value){

    console.log("start");
let relevantCompanies=[];
let relevantCompanesBySetor=[];
let counter = 0 ;
const parentDiv = document.getElementById(value);


// for( ) {
//     console.log(parentDiv.firstChild);
//     //parentDiv.removeChild(parentDiv.firstChild);
// }


const allchildNodes = parentDiv.querySelectorAll(".dropDown");
// console.log(allchildNodes);

for ( let i = 0 ; i < allchildNodes.length ; i++){
   const childNodes = allchildNodes[i];
   console.log(childNodes);
   childNodes.remove();
}
    for ( let i = 0 ; i < 10 ; i++){
        relevantCompanies.push(companies[i]);
    }


    for ( let company in relevantCompanies){ 
        const specifiCompanies = relevantCompanies[company];
        if ( specifiCompanies.sektor === value){
            counter++;
            relevantCompanesBySetor.push(specifiCompanies.simbol);
        }
    }
    
    
    for ( let i = 0 ; i < counter ; i++){
        const dropDownFields = document.createElement("div");
        dropDownFields.classList.add("dropDown");
        dropDownFields.innerHTML = relevantCompanesBySetor[i];
        parentDiv.appendChild(dropDownFields);
        console.log(dropDownFields);
        
        dropDownFields.addEventListener('click',()=>{
            onClick(dropDownFields);
        });    
    } 

}
function preparePage(){

let file = "https://teaching.lavbic.net/api/finance/delnice/seznam";
fetch (file)
.then(x => x.text())
.then(response =>{

companies= JSON.parse(response);
console.log(companies);
// const simbol = companies[0].podjetje;
const kompanies = companies.slice(0,10);
const groupByCategory =kompanies.reduce((group, company) => {
  const{sektor} = company;
  group[sektor] = group[sektor] ?? [];
  group[sektor].push(company);
  return group;
}, {});



console.log(groupByCategory);
const companyFields= document.querySelectorAll(".fields");

const numberOfSectors = Object.keys(groupByCategory);
console.log(numberOfSectors);
const numberOfSectorsLength = numberOfSectors.length;
const companyTables = document.querySelector("#seznamPodjetji");


for ( let i = 0 ; i < numberOfSectorsLength ; i++){
    const sectors = document.createElement("div");
    sectors.classList.add("headers");
    sectors.classList.add("fontAwesome");
    sectors.innerHTML = numberOfSectors[i];
    sectors.setAttribute('id', numberOfSectors[i])
    sectors.classList.add("sectors")
    companyTables.appendChild(sectors);
    sectors.addEventListener('click', () =>{
        console.log(numberOfSectors[i]);
        dropDown(numberOfSectors[i]);
    });

}


});
}


document.addEventListener("DOMContentLoaded", () => {
    preparePage();

   
});