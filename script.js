let materialCost = 0
let hardwareCost = 0
let panels = []

// CUT LIST GENERATOR

function generateCutList(){

panels = []

let h = parseFloat(document.getElementById("height").value)
let w = parseFloat(document.getElementById("width").value)
let d = parseFloat(document.getElementById("depth").value)

let t = parseFloat(document.getElementById("thickness").value)

let shelves = parseInt(document.getElementById("shelves").value) || 0
let drawers = parseInt(document.getElementById("drawers").value) || 0

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

Side Panel (2)
${sidePanel}

Top Panel
${topBottom}

Bottom Panel
${topBottom}

Shelves (${shelves})
${topBottom}
`

document.getElementById("cutlist").textContent = result

saveDesign()

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

let result = `

Material Area: ${area.toFixed(2)} sq ft

Plywood Cost: ₹${plywoodCost.toFixed(2)}

Mica Cost: ₹${micaCost.toFixed(2)}

Total Material Cost: ₹${materialCost.toFixed(2)}
`

document.getElementById("cost").textContent = result

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

let result = `

Hinges (2) : ₹${hingeCost}

Handles (1) : ₹${handleCost}

Channels (1) : ₹${channelCost}

Total Hardware Cost : ₹${hardwareCost}
`

document.getElementById("hardware").textContent = result

}



// SHEET CUTTING LAYOUT

function generateLayout(){

let canvas = document.getElementById("sheetCanvas")
let ctx = canvas.getContext("2d")

ctx.clearRect(0,0,canvas.width,canvas.height)

let sheetW = 2440
let sheetH = 1220

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



// QUOTATION

function generateQuotation(){

let labour = materialCost * 0.25
let transport = 500

let total = materialCost + hardwareCost + labour + transport

let quotation = `

------ CLIENT QUOTATION ------

Material Cost : ₹${materialCost.toFixed(2)}

Hardware Cost : ₹${hardwareCost.toFixed(2)}

Labour : ₹${labour.toFixed(2)}

Transport : ₹${transport}

-----------------------------

TOTAL PRICE : ₹${total.toFixed(2)}

`

document.getElementById("quotation").textContent = quotation

}



// SAVE DESIGN

function saveDesign(){

let design = {

height:document.getElementById("height").value,
width:document.getElementById("width").value,
depth:document.getElementById("depth").value,
thickness:document.getElementById("thickness").value,
shelves:document.getElementById("shelves").value,
drawers:document.getElementById("drawers").value

}

localStorage.setItem("furnitureDesign",JSON.stringify(design))

}



// LOAD DESIGN

function loadDesign(){

let saved = localStorage.getItem("furnitureDesign")

if(!saved) return

let design = JSON.parse(saved)

document.getElementById("height").value = design.height
document.getElementById("width").value = design.width
document.getElementById("depth").value = design.depth
document.getElementById("thickness").value = design.thickness
document.getElementById("shelves").value = design.shelves
document.getElementById("drawers").value = design.drawers

}



window.onload = function(){

loadDesign()

}