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
// CUT LIST
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

for(let q=0;q<qty;q++){

panels.push({name:"Side",w:d,h:h})
panels.push({name:"Side",w:d,h:h})

panels.push({name:"Top",w:d,h:innerW})
panels.push({name:"Bottom",w:d,h:innerW})

for(let i=0;i<shelves;i++){
panels.push({name:"Shelf",w:d,h:innerW})
}

}

document.getElementById("cutlist").textContent = `
Total Panels: ${panels.length}
Cabinet Qty: ${qty}
`

}



// =======================
// MATERIAL (FULL SHEET)
// =======================

function calculateMaterialFullSheet(){

let sheetArea = 32

let plyPrice = +document.getElementById("plyPrice").value || 0
let micaPrice = +document.getElementById("micaPrice").value || 0

let totalArea = 0

panels.forEach(p=>{
totalArea += (p.w * p.h)/92900
})

let sheetsRequired = Math.ceil(totalArea / sheetArea)

let plywoodCost = sheetsRequired * plyPrice
let micaCost = sheetsRequired * micaPrice

materialCost = plywoodCost + micaCost

document.getElementById("cost").textContent = `
Total Area: ${totalArea.toFixed(2)} sq ft
Sheets Required: ${sheetsRequired}

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
// AUTO OPTIMIZED LAYOUT
// =======================

function generateLayout(){

let canvas = document.getElementById("sheetCanvas")
let ctx = canvas.getContext("2d")

ctx.clearRect(0,0,canvas.width,canvas.height)

let sheetW = 2440
let sheetH = 1220

sheets = []
let currentSheet = []

let x=0, y=0, rowH=0

// SORT panels (big → small for better packing)
panels.sort((a,b)=>(b.w*b.h)-(a.w*a.h))

panels.forEach(panel=>{

let placed = false

// try both orientations
let options = [
{w:panel.w, h:panel.h},
{w:panel.h, h:panel.w}
]

for(let opt of options){

let pw = opt.w
let ph = opt.h

if(pw > sheetW || ph > sheetH) continue

let tempX = x
let tempY = y
let tempRowH = rowH

// new row if needed
if(tempX + pw > sheetW){
tempX = 0
tempY += tempRowH
tempRowH = 0
}

// new sheet if needed
if(tempY + ph > sheetH){
continue
}

// place panel
currentSheet.push({
x:tempX,
y:tempY,
w:pw,
h:ph,
name:panel.name
})

// update
x = tempX + pw
y = tempY
rowH = Math.max(tempRowH, ph)

placed = true
break

}

// if not placed → new sheet
if(!placed){

sheets.push(currentSheet)

currentSheet = []

x = 0
y = 0
rowH = 0

currentSheet.push({
x:0,
y:0,
w:panel.w,
h:panel.h,
name:panel.name
})

x = panel.w
rowH = panel.h

}

})

if(currentSheet.length) sheets.push(currentSheet)

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

let sheetW = 2440
let sheetH = 1220

let scale = Math.min(
canvas.width / sheetW,
canvas.height / sheetH
)

ctx.strokeRect(0,0,sheetW*scale,sheetH*scale)

sheet.forEach(p=>{

let x = p.x * scale
let y = p.y * scale
let w = p.w * scale
let h = p.h * scale

ctx.strokeRect(x,y,w,h)
ctx.fillText(p.name,x+5,y+15)

})

ctx.fillText(`Sheet ${page+1}/${sheets.length}`,10,sheetH*scale-10)

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
// PROJECT
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

function displayProject(){

let output = ""

project.cabinets.forEach((cab,i)=>{

output += `
Cabinet ${i+1}
Size: ${cab.width} x ${cab.height} x ${cab.depth}
Material: ₹${cab.material}
Hardware: ₹${cab.hardware}
`

})

document.getElementById("projectList").textContent = output

}

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
Client: ${project.client}
Project: ${project.name}

Material: ₹${totalMaterial}
Hardware: ₹${totalHardware}
Labour: ₹${labour}
Transport: ₹${transport}

TOTAL: ₹${total}
`

}