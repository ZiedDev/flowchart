import PlainDraggable from 'plain-draggable'
import LeaderLine from 'leader-line-new'
import PointerTracker from 'pointer-tracker'

import '../css/index.css'
import '../css/main.css'
import '../css/mainMobile.css';

import flowchart from '../json/flowchart.json'

const flowchartBoard = document.getElementById('flowchart-board')

// templates
const terminalTemplate = document.getElementById('terminal-template')
const processTemplate = document.getElementById('process-template')
const decisionTemplate = document.getElementById('decision-template')
const inputOutputTemplate = document.getElementById('input-output-template')

// un-needed
const flowchartSymbols = ['terminal', 'process', 'decision', 'inputOutput']
const allTools = ['hand', 'edit', 'connect', 'erase']

// flowBlock
function createLine(start, end, label = undefined, lineColor = undefined) {
    const labelObj = {
        text: label,
        color: 'aliceblue',
        outlineColor: '',
        fontWeight: 'bold',
    }
    return new LeaderLine(document.getElementById(start), document.getElementById(end),
        {
            startPlug: 'disc',
            size: 4, startPlugSize: 1.5, startPlugOutlineSize: 2.5,
            color: lineColor == undefined ? '#f0f8ff' : lineColor, path: 'fluid',
            dropShadow: true,
            middleLabel: LeaderLine.captionLabel(labelObj),
        })
}
class FlowBlock {
    constructor(id, type, content, pos) {
        this.id = id;
        this.type = type;
        this.content = content;
        [this.posx, this.posy] = pos;
        [this.element, this.draggable] = this.createFlowBlock(type, id, content);
        this.connections = [];
        this.draggable['onMove'] = () => { this.connections.forEach((c) => { c.position() }) };
    }

    createFlowBlock() {
        let element

        if (this.type == 'terminal') {
            element = terminalTemplate.content.cloneNode(true)
        } else if (this.type == 'process') {
            element = processTemplate.content.cloneNode(true)

        } else if (this.type == 'decision') {
            element = decisionTemplate.content.cloneNode(true)

        } else if (this.type == 'inputOutput') {
            element = inputOutputTemplate.content.cloneNode(true)
        }
        const elementId = element.querySelector('[data-flowchart-block-id]')
        const elementContent = element.querySelector('[data-flowchart-block-content]')
        const elementEdit = element.querySelector('[data-flowchart-block-edit]')

        elementId.id = `block-${this.id}`
        elementContent.textContent = this.content

        elementId.classList.add('draggable')
        elementId.style.transform = `translate(${this.posx}px,${this.posy}px)`
        if (elementEdit != undefined) {
            elementEdit.value = this.content
            elementEdit.oninput = () => {
                elementContent.textContent = elementEdit.value
            }
        }

        flowchartBoard.appendChild(element)

        const elementDraggable = new PlainDraggable(document.getElementById(`block-${this.id}`))

        document.getElementById(`block-${this.id}`).addEventListener('click', () => {
            if (currentTool == 'erase') {
                remFlowBlock(this.id)
            }
        })

        return [element, elementDraggable]
    }

    updateFlowBlock(func, whatToUpdate) {
        this.draggable[func] = whatToUpdate
    }
}

// chart
let connections = {}
let flowBlocks = {}
let connectionAttrs = {}
let global_index = -1

function addFlowBlock(type, content, pos = [0, 0]) {
    let newBlock = new FlowBlock(global_index + 1, type, content, pos)
    flowBlocks[String(global_index + 1)] = newBlock
    global_index++
}
function remFlowBlock(id) {
    // remove attached connections to flowblock
    let currConnections =
        Object.keys(connections).map(str => str.split(':'))
            .filter(key => {
                return key[0] == id || key[1] == id
            })
    currConnections.forEach(k => { remConnection(k[0], k[1]) })

    // remove flowblock
    flowBlocks[String(id)].draggable.remove()
    document.getElementById(`block-${id}`).remove()
    delete flowBlocks[String(id)]

    // decrement ids
    let gids = Object.keys(flowBlocks).map(str => Number(str))
        .filter(key => {
            return key > Number(id)
        })
    gids.forEach(k => {
        flowBlocks[String(k - 1)] = flowBlocks[String(k)]
        flowBlocks[String(k - 1)].id--
        document.getElementById(`block-${k}`).id = `block-${k - 1}`
    })
    delete flowBlocks[String(Math.max(...gids))]

    Object.keys(connections).forEach(key => {
        let parts = key.split(':').map(str => Number(str))
        if (parts[0] > Number(id)) parts[0]--
        if (parts[1] > Number(id)) parts[1]--
        let tmp = connections[key]
        delete connections[key]
        connections[parts.join(':')] = tmp
    })

    global_index--
}

function addConnection(fromId, toId, attr = null) {
    let cid = `${fromId}:${toId}`
    let startNode = flowBlocks[fromId]
    let endNode = flowBlocks[toId]

    if (attr) connectionAttrs[cid] = attr
    if (attr == 'y') {
        connections[cid] = createLine(`block-${fromId}`, `block-${toId}`, 'Yes', '#29964a')
    } else if (attr == 'n') {
        connections[cid] = createLine(`block-${fromId}`, `block-${toId}`, 'No', '#ba2b2b')
    } else {
        connections[cid] = createLine(`block-${fromId}`, `block-${toId}`)
    }
    startNode.connections.push(connections[cid])
    endNode.connections.push(connections[cid])
}
function remConnection(fromId, toId) {
    let cid = `${fromId}:${toId}`

    flowBlocks[fromId].connections.splice(flowBlocks[fromId].connections.indexOf(connections[cid]), 1)
    flowBlocks[toId].connections.splice(flowBlocks[toId].connections.indexOf(connections[cid]), 1)

    connections[cid].remove()

    delete connections[cid]
    delete connectionAttrs[cid]
}

function objectifyChart() {
    let res = { 'wires': {}, 'nodes': {} }
    // add nodes
    Object.keys(flowBlocks).forEach(key => {
        let f = flowBlocks[key]
        res['nodes'][key] = {
            "posx": f.posx,
            "posy": f.posy,
            "type": f.type,
            "content": f.content
        }
    })

    // add connections
    Object.keys(connections).forEach(key => {
        let parts = key.split(':')
        if (key in connectionAttrs) {
            if (parts[0] in res['wires']) {

                if (connectionAttrs[key] == 'y') res['wires'][parts[0]][0] = parts[1]
                else if (connectionAttrs[key] == 'n') res['wires'][parts[0]][1] = parts[1]

            } else if (connectionAttrs[key] == 'y') res['wires'][parts[0]] = [parts[1], -1]
            else if (connectionAttrs[key] == 'n') res['wires'][parts[0]] = [-1, parts[1]]
        } else {
            res['wires'][parts[0]] = parts[1]
        }
    })
    return res
}
function personifyChart(object) {
    let n = Object.keys(flowBlocks).length
    for (let i = 0; i < n; i++) remFlowBlock(0)

    Object.keys(object['nodes']).forEach(key => {
        addFlowBlock(object['nodes'][key]['type'],
            object['nodes'][key]['content'],
            [object['nodes'][key]['posx'], object['nodes'][key]['posy']])
    })
    Object.keys(object['wires']).forEach(key => {
        if (typeof (object['wires'][key]) == 'string') {
            addConnection(key, object['wires'][key])
        } else {
            addConnection(key, object['wires'][key][0], 'y')
            addConnection(key, object['wires'][key][1], 'n')
        }
    })
}

//#region tools
let currentTool
const editButton = document.getElementById('edit-button')
const connectButton = document.getElementById('connect-button')
const moveButton = document.getElementById('move-button')
const eraseButton = document.getElementById('erase-button')

editButton.addEventListener('click', () => {
    toggleSwitch([editButton, connectButton, moveButton, eraseButton], 0, 'active', () => {
        toggleDraggables(false)
        enableEdit(true)
        currentTool = 'edit'
        document.querySelectorAll('[data-flowchart-block-content').forEach(element => {
            element.classList.remove('active')
        })
    })
})
connectButton.addEventListener('click', () => {
    toggleSwitch([editButton, connectButton, moveButton, eraseButton], 1, 'active', () => {
        toggleDraggables(false)
        enableEdit(false)
        currentTool = 'connect'
        document.querySelectorAll('[data-flowchart-block-content').forEach(element => {
            element.classList.add('active')
        })
    })
})
moveButton.addEventListener('click', () => {
    toggleSwitch([editButton, connectButton, moveButton, eraseButton], 2, 'active', () => {
        toggleDraggables(true)
        enableEdit(false)
        currentTool = 'move'
        document.querySelectorAll('[data-flowchart-block-content').forEach(element => {
            element.classList.remove('active')
        })
    })
})
eraseButton.addEventListener('click', () => {
    toggleSwitch([editButton, connectButton, moveButton, eraseButton], 3, 'active', () => {
        toggleDraggables(false)
        enableEdit(false)
        currentTool = 'erase'
        document.querySelectorAll('[data-flowchart-block-content').forEach(element => {
            element.classList.remove('active')
        })
    })
})

function toggleSwitch(toggleSwitches = [], index, activeClass, onActivateFunc = () => { }) {
    for (let i = 0; i < toggleSwitches.length; i++) {
        toggleSwitches[i].classList.remove(activeClass)
    }

    toggleSwitches[index].classList.add(activeClass)
    onActivateFunc()
}

function toggleDraggables(enable) {
    if (enable) {
        Object.keys(flowBlocks).forEach(key => {
            flowBlocks[key].draggable.disabled = false
        })
    }
    else {
        Object.keys(flowBlocks).forEach(key => {
            flowBlocks[key].draggable.disabled = true
        })
    }
}

function enableEdit(enable) {
    if (enable) {
        document.querySelectorAll('[data-flowchart-block-content]').forEach(key => {
            if (!key.parentElement.classList.contains('terminal')) {
                key.classList.add('hide')
            }
        })

        document.querySelectorAll('[data-flowchart-block-edit]').forEach(key => {
            key.classList.remove('hide')
        })
    }
    else {
        document.querySelectorAll('[data-flowchart-block-content]').forEach(key => {
            if (!key.classList.contains('terminal')) {
                key.classList.remove('hide')
            }
        })

        document.querySelectorAll('[data-flowchart-block-edit]').forEach(key => {
            key.classList.add('hide')
        })
    }
}

//#endregion

//#region side Panel 
document.getElementById('start').addEventListener('click', () => {
    initAddBlock('terminal', 'start')
})
document.getElementById('end').addEventListener('click', () => {
    initAddBlock('terminal', 'end')
})
document.getElementById('process').addEventListener('click', () => {
    initAddBlock('process', 'process')
})
document.getElementById('decision').addEventListener('click', () => {
    initAddBlock('decision', 'decision')
})
document.getElementById('input').addEventListener('click', () => {
    initAddBlock('inputOutput', 'input')
})
document.getElementById('output').addEventListener('click', () => {
    initAddBlock('inputOutput', 'output')
})

function initAddBlock(flowChartSymbol, content) {
    addFlowBlock(flowChartSymbol, content, [0, 0])

    if (currentTool == 'hand') {
        toggleDraggables(true)
        enableEdit(false)
        document.querySelectorAll('[data-flowchart-block-content').forEach(element => {
            element.classList.add('active')
        })
    } else if (currentTool == 'edit') {
        toggleDraggables(false)
        enableEdit(true)
        document.querySelectorAll('[data-flowchart-block-content').forEach(element => {
            element.classList.remove('active')
        })
    } else if (currentTool == 'connect') {
        toggleDraggables(false)
        enableEdit(false)
        document.querySelectorAll('[data-flowchart-block-content').forEach(element => {
            element.classList.add('active')
        })
    } else if (currentTool == 'erase') {
        toggleDraggables(false)
        enableEdit(false)
        document.querySelectorAll('[data-flowchart-block-content').forEach(element => {
            element.classList.add('active')
        })
    }
}
//#endregion

let isDraggingBlock = false
let draggingBlock
let line

// connections tool
const pointerTracker = new PointerTracker(flowchartBoard, {
    start(pointer, event) {
        if (currentTool != 'connect') return false
        let temp = event.target

        if (temp.classList.contains('flowchart-block')) {
            draggingBlock = temp.parentElement
            isDraggingBlock = true

            document.getElementById('tracker').style.transform = `translate(${pointer.clientX}px,calc(${pointer.clientY}px - 5rem))`
            line = createLine(draggingBlock.id, 'tracker')
            return true
        }
    },
    move(previousPointers, changedPointers, event) {
        let temp = event.target

        document.getElementById('tracker').style.transform = `translate(${changedPointers[0].clientX}px,calc(${changedPointers[0].clientY}px - 5rem))`
        line.position()
    },
    end(pointer, event, cancelled) {
        let temp = document.elementFromPoint(pointer.clientX, pointer.clientY)

        if (draggingBlock != temp.parentElement) {
            if (temp.classList.contains('flowchart-block')) {
                let startId = draggingBlock.id.replace('block-', '')
                let endId = temp.parentElement.id.replace('block-', '')

                if ((flowBlocks[startId].type == 'terminal' && flowBlocks[startId].content == 'end') || (flowBlocks[endId].type == 'terminal' && flowBlocks[endId].content == 'start')) {

                } else {
                    Object.keys(connections)
                        .filter(key => {
                            return key.split(':')[0] == startId
                        })
                        .forEach(key => {
                            remConnection(startId, key.split(':')[1])
                        })
                    addConnection(startId, endId)
                }

            }
        }

        line.remove()
        isDraggingBlock = false
    },
    avoidPointerEvents: true,
    rawUpdates: false,
})

//HARD R CODED
addFlowBlock('terminal', 'start', [500, 0])
addFlowBlock('inputOutput', 'input X', [100, 100])
addFlowBlock('decision', 'X > 5', [500, 200])
addFlowBlock('inputOutput', 'output X', [800, 400])
addFlowBlock('terminal', 'end', [500, 400])

addConnection(0, 1)
addConnection(1, 2)
addConnection(2, 3, 'y')
addConnection(2, 4, 'n')
addConnection(3, 4)

//remFlowBlock(2)
let x = objectifyChart()
//console.log(x)
personifyChart(x)
//console.log(connections, flowBlocks)

// manually connect decision ❌
// label orientation ✅
// flowBlock shapes ✅
// initial drag state on current tool ✅
// fix edit block behavior ❌