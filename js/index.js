'use strict'

// globals
var bootstrapBreakpoint = "col-sm";
var masterData = null;
var flightCrewScale = d3.scaleOrdinal()
    .domain(["Unscheduled", "Unschedulable", "Scheduled"])
    .range([
        d3.rgb("#9c27b0"), // unscheduled: not working
        d3.rgb("#ffc107"), // unschedulable: "not able to work"
        d3.rgb("#4caf50") // scheduled: "working"
    ]);
var flightCrewSvg = d3.select("#flightCrewBSRow");

// uses underlying fetch() API
d3.json("data/alnw_crew_data.json")
    .then(json => {
        masterData = json;
    }
);

// function to draw D3 visualization
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
        .attr("name", function(d){return d.name.first + " " + d.name.last})
        .attr("crewType", function(d){return d.crewType})
        .attr("base", function(d){return d.base})
        .attr("phone", function(d){return d.phone})
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
    let thisCrewPhone = crewSquare.attr("phone");
    // let phoneNode = document.createElement("a").setAttribute("href", "tel:" + thisCrewPhone);
    let phoneNode = crewSquare.attr("phone");
    let crewSquareId = crewSquare.attr("id");
    let squareId = crewSquareId.slice(7); // shorten to last character of string: the id
    
    // Refinement
    // Possibility to use this.parentNode
    // See: https://stackoverflow.com/questions/22634656/d3-equivalent-of-jquery-parent
    d3.select("#svg-id"+squareId).append("title") // display tooltip
        .text("Name: " + thisCrewName + "\nStatus: " + thisCrewStatus
        + "\nRole: " + thisCrewRole + "\nBase: " + thisCrewBase
        + "\nPhone: " + phoneNode);
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

        $("#baseSelect,#crewTypeSelect").change(function(){
            filterCrewAvail();
        });

        // crew availability visualization filter function
        function filterCrewAvail(){

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
