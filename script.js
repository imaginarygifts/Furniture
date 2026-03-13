let materialCost = 0
let hardwareCost = 0
let panels = []

let project = {
client:"",
name:"",
cabinets:[]
}

// CREATE PROJECT

function createProject(){

project.client = document.getElementById("clientName").value
project.name = document.getElementById("projectName").value
project.cabinets = []

alert("Project Created")

}



// CUT LIST GENERATOR

function generateCutList(){

panels = []

let h = parseFloat(document.getElementById("height").value)
let w = parseFloat(document.getElementById("width").value)
let d = parseFloat(document.getElementById("depth").value)

let t = parseFloat(document.getElementById("thickness").value)

let shelves = parseInt(document.getElementById("shelves").value) || 0

let sidePanel = `${h} x ${d}`
let topBottom = `${w-(t*2)} x ${d}`

panels.push({name:"Side",w:d,h:h})
panels.push({name:"Side",w:d,h:h})
panels.push({name:"Top",w:d,h:w-(t*2)})
panels.push({name:"Bottom",w:d,h:w-(t*2)})

for(let i=0;i<shelves;i++){

panels.push({
name:"Shelf",
w:d,
h:w-(t*2)
})

}

let result = `
----- CUT LIST -----

Side Panels (2)
${sidePanel}

Top Panel
${topBottom}

Bottom Panel
${topBottom}

Shelves (${shelves})
${topBottom}
`

document.getElementById("cutlist").textContent = result

}



// MATERIAL COST

function calculateCost(){

let plyPrice = parseFloat(document.getElementById("plyPrice").value) || 0
let micaPrice = parseFloat(document.getElementById("micaPrice").value) || 0

let width = parseFloat(document.getElementById("width").value)
let height = parseFloat(document.getElementById("height").value)

let area = (width * height)/92900

let plywoodCost = area * plyPrice
let micaCost = area * micaPrice

materialCost = plywoodCost + micaCost

document.getElementById("cost").textContent = `
Material Area : ${area.toFixed(2)} sq ft

Plywood Cost : ₹${plywoodCost.toFixed(2)}

Mica Cost : ₹${micaCost.toFixed(2)}

Total Material Cost : ₹${materialCost.toFixed(2)}
`

}



// HARDWARE COST

function calculateHardware(){

let hingePrice = parseFloat(document.getElementById("hingePrice").value) || 0
let handlePrice = parseFloat(document.getElementById("handlePrice").value) || 0
let channelPrice = parseFloat(document.getElementById("channelPrice").value) || 0

let hingeCost = hingePrice * 2
let handleCost = handlePrice * 1
let channelCost = channelPrice * 1

hardwareCost = hingeCost + handleCost + channelCost

document.getElementById("hardware").textContent = `
Hinges : ₹${hingeCost}

Handles : ₹${handleCost}

Channels : ₹${channelCost}

Total Hardware Cost : ₹${hardwareCost}
`

}



// ADD CABINET TO PROJECT

function addCabinet(){

let cabinet = {

width:document.getElementById("width").value,
height:document.getElementById("height").value,
depth:document.getElementById("depth").value,
material:materialCost,
hardware:hardwareCost

}

project.cabinets.push(cabinet)

displayProject()

}



// DISPLAY PROJECT

function displayProject(){

let output = ""

project.cabinets.forEach((cab,i)=>{

output += `
Cabinet ${i+1}

Size : ${cab.width} x ${cab.height} x ${cab.depth}

Material : ₹${cab.material}

Hardware : ₹${cab.hardware}

`

})

document.getElementById("projectList").textContent = output

}



// PROJECT QUOTATION

function generateProjectQuotation(){

let totalMaterial = 0
let totalHardware = 0

project.cabinets.forEach(c=>{

totalMaterial += c.material
totalHardware += c.hardware

})

let labour = totalMaterial * 0.25
let transport = 1000

let total = totalMaterial + totalHardware + labour + transport

document.getElementById("projectQuotation").textContent = `

------ PROJECT QUOTATION ------

Client : ${project.client}

Project : ${project.name}

Material Cost : ₹${totalMaterial}

Hardware Cost : ₹${totalHardware}

Labour : ₹${labour}

Transport : ₹${transport}

-----------------------------

TOTAL : ₹${total}

`

}



// SHEET CUTTING LAYOUT

function generateLayout(){

let canvas = document.getElementById("sheetCanvas")
let ctx = canvas.getContext("2d")

ctx.clearRect(0,0,canvas.width,canvas.height)

let sheetW = 2440
let scale = 0.2

let x = 0
let y = 0
let rowHeight = 0

panels.forEach(panel=>{

let pw = panel.w * scale
let ph = panel.h * scale

if(x + pw > sheetW*scale){

x = 0
y += rowHeight
rowHeight = 0

}

ctx.strokeRect(x,y,pw,ph)
ctx.fillText(panel.name,x+5,y+15)

x += pw

if(ph > rowHeight){

rowHeight = ph

}

})

}