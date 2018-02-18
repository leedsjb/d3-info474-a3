'use strict'

console.log("Testing js/index.js");

// globals
var bootstrapBreakpoint = "col-xs";

// data is globally available
var masterData = [
    {name: "Brenda", status: "unscheduled", crewType: "Flight Nurse", base: "BFI"},
    {name: "Benjamin", status: "scheduled", crewType: "Pilot", base: "PWT"},
    {name: "Tiffany", status: "unschedulable", crewType: "Pilot", base: "YKM"},
    {name: "Jessica", status: "scheduled", crewType: "Flight Nurse", base: "BFI"},
    {name: "Anushree", status: "scheduled", crewType: "Flight Nurse", base: "AJN"},
    {name: "Lee", status: "unschedulable", crewType: "Pilot", base: "YKM"},
    {name: "Ishan", status: "unscheduled", crewType: "Flight Nurse", base: "OLM"},
    {name: "Evan", status: "scheduled", crewType: "Pilot", base: "BFI"},
    {name: "Greg", status: "unscheduled", crewType: "Flight Nurse", base: "BFI"},
    {name: "Samantha", status: "unschedulable", crewType: "Pilot", base: "PWT"},
    {name: "Daniel", status: "scheduled", crewType: "Pilot", base: "YKM"},
    {name: "Gary", status: "unscheduled", crewType: "Flight Nurse", base: "BFI"},
    {name: "Debra", status: "scheduled", crewType: "Pilot", base: "AJN"},
    {name: "Robin", status: "unschedulable", crewType: "Pilot", base: "YKM"},
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
var flightCrewSvg = d3.select("#flightCrewBSRow");
    // .attr("width", flightCrewWidth)
    // .attr("height", flightCrewHeight)
    // .append("g")
    // .append("div").attr("class", "row");

function drawVis(filteredData){

    // clear old Bootstrap DOM elements from previous selections
    d3.select("#flightCrewBSRow").selectAll("."+bootstrapBreakpoint).remove();

    var selection = flightCrewSvg
        .selectAll("rect")
        .data(filteredData);

    selection.enter()
        .append("div").attr("class", bootstrapBreakpoint)
        .append("svg").attr("width","50").attr("height","50")
        .attr("id", function(d,i){return "svg-id" + i})
        .append("rect")
        .attr("rx","5").attr("ry","5").attr("width", "50").attr("height", "50")
        .attr("status", function(d){return d.status})
        .attr("style", function(d){return "fill:" + flightCrewScale(d.status)}) // status color
        // .attr("x", function(d,i){ // square position
        //     return 70*i
        // })
        .attr("name", function(d){return d.name})
        .attr("crewType", function(d){return d.crewType})
        .attr("base", function(d){return d.base})
        .attr("id", function(d,i){return "rect-id" + i})
        .on("mouseover", handleMouseOver)
        .on("mouseout",handleMouseOut);

    selection.exit()
        .remove() // remove DOM elements that are no longer in dataset
        
}
 
function handleMouseOver(){
    let crewSquare = d3.select(this); // select square mouse interacted with
    crewSquare.attr("stroke", "black").attr("stroke-width", 1); // highlight it
    
    let thisCrewName = crewSquare.attr("name");
    let thisCrewStatus = crewSquare.attr("status");
    let thisCrewRole = crewSquare.attr("crewType");
    let thisCrewBase = crewSquare.attr("base");
    let crewSquareId = crewSquare.attr("id");

    let squareId = crewSquareId.slice(7);
    
    // Refinement
    // Possibility to use this.parentNode
    // See: https://stackoverflow.com/questions/22634656/d3-equivalent-of-jquery-parent
    d3.select("#svg-id"+squareId).append("title") // display tooltip
        .text("Name: " + thisCrewName + "\nStatus: " + thisCrewStatus
        + "\nRole: " + thisCrewRole + "\nBase: " + thisCrewBase);
}

function handleMouseOut(){
    let crewSquare = d3.select(this);
    crewSquare.attr("stroke", null).attr("stroke-width", null);
    let crewSquareId = crewSquare.attr("id");
    let squareId = crewSquareId.slice(7);

    d3.select("#svg-id"+squareId).select("title").remove();
}

$(document).ready(
    function(){

        drawVis(masterData);

        $("#baseSelect,#crewTypeSelect").change(function(){ // TODO consider use of => function
            console.log("dropdown change fired");
            filterCrewAvail(/*this.id, this.value*/);
        });

        // crew availability visualization filter function
        function filterCrewAvail(/*selectType, selection*/){

            // get current selected parameters from DOM <select> elements
            let baseSelection = $("#baseSelect option:selected").text();
            let crewSelection = $("#crewTypeSelect option:selected").text();
        
            // case: all bases and all crew types
            if(baseSelection === "All" && crewSelection === "All"){ 
                drawVis(masterData); // draw visualization with all data
                return;
            } 

            // case: specific bases and all crew types
            else if(baseSelection !== "All" && crewSelection === "All"){ 
                let filteredData = masterData.filter(function(d){
                    return d.base===baseSelection;
                });
                drawVis(filteredData);
                return;
            } 

            // case: all bases and specific crew types
            else if(crewSelection !== "All" && baseSelection === "All"){ 
                let filteredData = masterData.filter(function(d){
                    return d.crewType === crewSelection;
                });
                drawVis(filteredData);
                return;
            } 

            // case: specific bases and specific crew types
            else { 
                let filteredData = masterData.filter(function(d){
                    return d.crewType === crewSelection && d.base === baseSelection;
                });
                drawVis(filteredData);
                return;
            }
        };  
    })

// make D3 responsive
// follows this tutorial, perhaps not ideal solution
// https://www.safaribooksonline.com/blog/2014/02/17/building-responsible-visualizations-d3-js/

function resize(){
    console.log("window resized");
    // let width = d3.select("#flightCrew").style("width");
    // console.log(width);
}
d3.select(window).on('resize', resize);
// resize(); disable for now

