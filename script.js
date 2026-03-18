let panels = []
let sheets = []
let currentPage = 0

let materialCost = 0
let hardwareCost = 0

let project = {
client:"",
name:"",
cabinets:[]
}

// =======================
// MAIN BUTTON
// =======================

function calculateAll(){

generateCutList()
calculateMaterialFullSheet()
calculateHardware()
generateLayout()

}



// =======================
// CREATE PROJECT
// =======================

function createProject(){

project.client = document.getElementById("clientName").value
project.name = document.getElementById("projectName").value
project.cabinets = []

alert("Project Created")

}



// =======================
// CUT LIST + PANELS
// =======================

function generateCutList(){

panels = []

let h = +document.getElementById("height").value
let w = +document.getElementById("width").value
let d = +document.getElementById("depth").value
let t = +document.getElementById("thickness").value
let shelves = +document.getElementById("shelves").value || 0
let qty = +document.getElementById("qty").value || 1

let innerW = w - (t*2)

// repeat for quantity
for(let q=0;q<qty;q++){

panels.push({name:"Side",w:d,h:h})
panels.push({name:"Side",w:d,h:h})

panels.push({name:"Top",w:d,h:innerW})
panels.push({name:"Bottom",w:d,h:innerW})

for(let i=0;i<shelves;i++){
panels.push({name:"Shelf",w:d,h:innerW})
}

}

// UI Output
document.getElementById("cutlist").textContent = `
Total Panels: ${panels.length}

Cabinet Qty: ${qty}

Each Cabinet:
2 Side, 1 Top, 1 Bottom, ${shelves} Shelves
`

}



// =======================
// MATERIAL (FULL SHEET)
// =======================

function calculateMaterialFullSheet(){

let sheetArea = 32 // 8x4 sheet

let plyPrice = +document.getElementById("plyPrice").value || 0
let micaPrice = +document.getElementById("micaPrice").value || 0

let totalArea = 0

panels.forEach(p=>{
totalArea += (p.w * p.h)/92900
})

let sheetsRequired = Math.ceil(totalArea / sheetArea)

// FULL SHEET COST
let plywoodCost = sheetsRequired * plyPrice
let micaCost = sheetsRequired * micaPrice

materialCost = plywoodCost + micaCost

document.getElementById("cost").textContent = `

Total Area Used: ${totalArea.toFixed(2)} sq ft

Sheets Required (8x4): ${sheetsRequired}

Plywood Cost: ₹${plywoodCost}

Mica Cost: ₹${micaCost}

Total Material Cost: ₹${materialCost}

`

}



// =======================
// HARDWARE
// =======================

function calculateHardware(){

let hingePrice = +document.getElementById("hingePrice").value || 0
let handlePrice = +document.getElementById("handlePrice").value || 0
let channelPrice = +document.getElementById("channelPrice").value || 0

let qty = +document.getElementById("qty").value || 1

let hinges = 2 * qty
let handles = 1 * qty
let channels = 1 * qty

hardwareCost =
(hinges * hingePrice) +
(handles * handlePrice) +
(channels * channelPrice)

document.getElementById("hardware").textContent = `

Hinges (${hinges}) ₹${hingePrice}
Handles (${handles}) ₹${handlePrice}
Channels (${channels}) ₹${channelPrice}

Total Hardware Cost: ₹${hardwareCost}

`

}



// =======================
// MULTI SHEET LAYOUT
// =======================

function generateLayout(){

let canvas = document.getElementById("sheetCanvas")
let ctx = canvas.getContext("2d")

ctx.clearRect(0,0,canvas.width,canvas.height)

let sheetW = 2440
let sheetH = 1220
let scale = 0.2

sheets = []
let currentSheet = []
let x=0,y=0,rowH=0

panels.forEach(panel=>{

let pw = panel.w * scale
let ph = panel.h * scale

// new sheet if overflow height
if(y + ph > sheetH*scale){

sheets.push(currentSheet)
currentSheet = []
x=0
y=0
rowH=0

}

// new row
if(x + pw > sheetW*scale){

x = 0
y += rowH
rowH = 0

}

currentSheet.push({x,y,pw,ph,name:panel.name})

x += pw

if(ph > rowH) rowH = ph

})

sheets.push(currentSheet)

drawSheet(0)

}



// =======================
// DRAW SHEET
// =======================

function drawSheet(page){

currentPage = page

let canvas = document.getElementById("sheetCanvas")
let ctx = canvas.getContext("2d")

ctx.clearRect(0,0,canvas.width,canvas.height)

let sheet = sheets[page]

sheet.forEach(p=>{
ctx.strokeRect(p.x,p.y,p.pw,p.ph)
ctx.fillText(p.name,p.x+5,p.y+15)
})

// page info
ctx.fillText(
`Sheet ${page+1} / ${sheets.length}`,
10,
canvas.height - 10
)

}



// =======================
// PAGINATION
// =======================

function nextSheet(){

if(currentPage < sheets.length-1){
drawSheet(currentPage+1)
}

}

function prevSheet(){

if(currentPage > 0){
drawSheet(currentPage-1)
}

}



// =======================
// ADD CABINET TO PROJECT
// =======================

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



// =======================
// DISPLAY PROJECT
// =======================

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



// =======================
// PROJECT QUOTATION
// =======================

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