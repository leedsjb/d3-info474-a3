'use strict'

console.log("Testing js/index.js");

// data is globally available
var masterData = [
    {name: "Brenda", status: "unscheduled", crewType: "Flight Nurse", base: "BFI"},
    {name: "Benjamin", status: "scheduled", crewType: "Pilot", base: "PWT"},
    {name: "Tiffany", status: "unschedulable", crewType: "Pilot", base: "YKM"},
    {name: "Jessica", status: "scheduled", crewType: "Flight Nurse", base: "BFI"},
    {name: "Anushree", status: "scheduled", crewType: "Flight Nurse", base: "AJN"},
    {name: "Lee", status: "unschedulable", crewType: "Flight Nurse", base: "YKM"},
    {name: "Ishan", status: "unscheduled", crewType: "Flight Nurse", base: "OLM"},
    {name: "Evan", status: "scheduled", crewType: "Flight Nurse", base: "BFI"},
    {name: "Greg", status: "unscheduled", crewType: "Flight Nurse", base: "BFI"},
    {name: "Samantha", status: "unschedulable", crewType: "Pilot", base: "PWT"},
    {name: "Daniel", status: "scheduled", crewType: "Pilot", base: "YKM"},
    {name: "Gary", status: "unscheduled", crewType: "Flight Nurse", base: "BFI"},
    {name: "Debra", status: "scheduled", crewType: "Flight Nurse", base: "AJN"},
    {name: "Robin", status: "unschedulable", crewType: "Flight Nurse", base: "YKM"},
    {name: "Chris", status: "scheduled", crewType: "Flight Nurse", base: "OLM"},
    {name: "David", status: "unscheduled", crewType: "Flight Nurse", base: "AWO"}
];

// crew availability section

var flightCrewScale = d3.scaleOrdinal()
    // unscheduled: not working
    // unschedulable: "not able to work"
    // scheduled: "working"
    .domain(["unscheduled", "unschedulable", "scheduled"])
    .range([
        d3.rgb("#9c27b0"), 
        d3.rgb("#f44336"), 
        d3.rgb("#4caf50")
    ]);

var flightCrewWidth = 600, flightCrewHeight = 100;
var flightCrewSvg = d3.select("#flightCrew")
    .attr("width", flightCrewWidth)
    .attr("height", flightCrewHeight)
    .append("g");

function drawVis(filteredData){

    var selection = flightCrewSvg
        .selectAll("rect")
        .data(filteredData);

    console.log("****");
    console.log(filteredData);

    selection.enter()
        .append("rect")
        .attr("rx","5").attr("ry","5").attr("width", "50").attr("height", "50")
        .attr("status", function(d){return d.status})
        .attr("style", function(d){return "fill:" + flightCrewScale(d.status)}) // status color
        .attr("x", function(d,i){ // square position
            return 70*i
        })
        .attr("name", function(d){return d.name})
        .attr("crewType", function(d){return d.crewType})
        .attr("base", function(d){return d.base})
        .on("mouseover", handleMouseOver)
        .on("mouseout",handleMouseOut);

    selection.exit().remove(); // remove DOM elements that are no longer in dataset
}
 
function handleMouseOver(){
    let crewSquare = d3.select(this);
    crewSquare.attr("stroke", "black").attr("stroke-width", 1);
    
    let thisCrewName = crewSquare.attr("name");
    let thisCrewStatus = crewSquare.attr("status");
    let thisCrewRole = crewSquare.attr("crewType")
    
    d3.select("#flightCrew").append("title") // display tooltip
        .text("Name: " + thisCrewName + "\nStatus: " + thisCrewStatus + "\nRole: " + thisCrewRole);
}

function handleMouseOut(){
    let crewSquare = d3.select(this);
    crewSquare.attr("stroke", null).attr("stroke-width", null);

    d3.select("#flightCrew").select("title").remove();
}

$(document).ready(function(){
    drawVis(masterData);
    $("#baseSelect").change(function() { // TODO consider use of => function
         filterBases(this.value);
    })
})

// base filter function

function filterBases(selectedBase){

    console.log(selectedBase);
   
    let regex = new RegExp("All");
    let res = regex.test(selectedBase);

    if(res){
        drawVis(masterData);
    } else{
        console.log("filtering: ");
        let filteredData = masterData.filter(function(d){
            console.log(d);
            return d.base===selectedBase;
        });
        console.log("the filtered data is: ");
        console.log(filteredData);
        drawVis(filteredData);
    }
}


// make D3 responsive

function resize(){
    console.log("window resized");
    let width = d3.select("#flightCrew").style("width");
    console.log(width);
}
d3.select(window).on('resize', resize);
// resize(); disable for now

