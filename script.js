// GLOBAL VARIABLES
let materialCost = 0
let hardwareCost = 0

// ================================
// CUT LIST GENERATOR
// ================================

function generateCutList(){

let h = parseFloat(document.getElementById("height").value)
let w = parseFloat(document.getElementById("width").value)
let d = parseFloat(document.getElementById("depth").value)

let t = parseFloat(document.getElementById("thickness").value)

let shelves = parseInt(document.getElementById("shelves").value) || 0
let drawers = parseInt(document.getElementById("drawers").value) || 0

let sidePanel = `${h} x ${d}`
let topBottom = `${w - (t*2)} x ${d}`
let shelfSize = `${w - (t*2)} x ${d}`

let result = `
========= CUT LIST =========

Side Panels (2)
${sidePanel}

Top Panel (1)
${topBottom}

Bottom Panel (1)
${topBottom}

Shelves (${shelves})
${shelfSize}
`

// DRAWER PARTS
if(drawers > 0){

let drawerWidth = w - (t*2) - 50
let drawerDepth = d - 50

result += `

========= DRAWERS =========

Drawer Quantity: ${drawers}

Drawer Front
${drawerWidth} x 150

Drawer Back
${drawerWidth} x 150

Drawer Side
${drawerDepth} x 150
`
}

document.getElementById("cutlist").textContent = result

saveDesign()

}



// ================================
// MATERIAL COST CALCULATOR
// ================================

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
========= MATERIAL COST =========

Area Used: ${area.toFixed(2)} sq ft

Plywood Cost: ₹ ${plywoodCost.toFixed(2)}

Mica Cost: ₹ ${micaCost.toFixed(2)}

Total Material Cost: ₹ ${materialCost.toFixed(2)}
`

document.getElementById("cost").textContent = result

}



// ================================
// HARDWARE COST CALCULATOR
// ================================

function calculateHardware(){

let hingePrice = parseFloat(document.getElementById("hingePrice").value) || 0
let handlePrice = parseFloat(document.getElementById("handlePrice").value) || 0
let channelPrice = parseFloat(document.getElementById("channelPrice").value) || 0

let hinges = 2
let handles = 1
let channels = 1

let hingeCost = hingePrice * hinges
let handleCost = handlePrice * handles
let channelCost = channelPrice * channels

hardwareCost = hingeCost + handleCost + channelCost

let result = `
========= HARDWARE COST =========

Hinges (${hinges}) : ₹ ${hingeCost}

Handles (${handles}) : ₹ ${handleCost}

Channels (${channels}) : ₹ ${channelCost}

Total Hardware Cost : ₹ ${hardwareCost}
`

document.getElementById("hardware").textContent = result

}



// ================================
// QUOTATION GENERATOR
// ================================

function generateQuotation(){

let total = materialCost + hardwareCost

let labour = total * 0.25
let transport = 500

let finalPrice = total + labour + transport

let quotation = `

========= CLIENT QUOTATION =========

Material Cost : ₹ ${materialCost.toFixed(2)}

Hardware Cost : ₹ ${hardwareCost.toFixed(2)}

Labour (25%) : ₹ ${labour.toFixed(2)}

Transport : ₹ ${transport}

------------------------------------

TOTAL PRICE : ₹ ${finalPrice.toFixed(2)}

`

document.getElementById("quotation").textContent = quotation

}



// ================================
// SAVE DESIGN
// ================================

function saveDesign(){

let design = {

height:document.getElementById("height").value,
width:document.getElementById("width").value,
depth:document.getElementById("depth").value,
thickness:document.getElementById("thickness").value,
shelves:document.getElementById("shelves").value,
drawers:document.getElementById("drawers").value

}

localStorage.setItem("furnitureDesign", JSON.stringify(design))

}



// ================================
// LOAD SAVED DESIGN
// ================================

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



// ================================
// AUTO LOAD WHEN PAGE OPENS
// ================================

window.onload = function(){

loadDesign()

}