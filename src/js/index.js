import PlainDraggable from 'plain-draggable'
import LeaderLine from 'leader-line-new'

import '../css/index.css'
import '../css/flowchartSymbols.css'

import flowchart from '../json/flowchart.json'

const flowchartBoard = document.getElementById('flowchart-board')

// templates
const terminalTemplate = document.getElementById('terminal-template')
const processTemplate = document.getElementById('process-template')
const decisionTemplate = document.getElementById('decision-template')
const inputOutputTemplate = document.getElementById('input-output-template')

// variables
let currentTool

// Un-needed
const flowchartSymbols = ['terminal', 'process', 'decision', 'inputOutput']
const allTools = ['hand', 'edit', 'connect', 'erase']

function createLine(start, end, startNode, endNode) {
    const line = new LeaderLine(document.getElementById(start), document.getElementById(end), { startPlug: 'disc', size: 4, startPlugSize: 1.5, startPlugOutlineSize: 2.5, color: '#f0f8ff', path: 'fluid' })
    return line
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
        element.querySelector('[data-flowchart-block-id]').id = `block-${this.id}`
        element.querySelector('[data-flowchart-block-content]').textContent = this.content

        element.querySelector('[data-flowchart-block-id]').classList.add('draggable')
        element.querySelector('[data-flowchart-block-id]').style.transform = `translate(${this.posx}px,${this.posy}px)`
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

// Chart
let connections = {}
let flowBlocks = {}
let global_index = -1

function addFlowBlock(type, content, pos = [0, 0]) {
    let newBlock = new FlowBlock(global_index + 1, type, content, pos)
    flowBlocks[global_index + 1] = newBlock
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
        flowBlocks[k - 1] = flowBlocks[k]
        flowBlocks[k - 1].id--
        document.getElementById(`block-${k}`).id = `block-${k - 1}`
    })
    delete flowBlocks[Math.max(...gids)]

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

function addConnection(fromId, toId) {
    let cid = `${fromId}:${toId}`
    let startNode = flowBlocks[fromId]
    let endNode = flowBlocks[toId]

    connections[cid] = createLine(`block-${fromId}`, `block-${toId}`, startNode, endNode)
    startNode.connections.push(connections[cid])
    endNode.connections.push(connections[cid])
}
function remConnection(fromId, toId) {
    let cid = `${fromId}:${toId}`

    flowBlocks[fromId].connections.splice(flowBlocks[fromId].connections.indexOf(connections[cid]), 1)
    flowBlocks[toId].connections.splice(flowBlocks[toId].connections.indexOf(connections[cid]), 1)

    connections[cid].remove()

    delete connections[cid]
}

/*
// addBlockPanel
const addBlocksPanel = document.getElementById('add-blocks-panel')
const addPanelBlocks = [['start', 'terminal'], ['end', 'terminal'], ['input', 'inputOutput'], ['output', 'inputOutput'], ['condition', 'decision']]
const addPanelElements = createBlocksPanel(addPanelBlocks)

for (let i = 0; i < addPanelElements.length; i++) {
    const ele = addPanelElements[i]
    addBlocksPanel.appendChild(ele[0])
    document.getElementById(ele[1]).addEventListener('click', () => createFlowBlock(ele[2], `${Math.floor(Math.random() * 99999)}`, '...', true))
    // The Id part is placeholder and will be changed later
}

function createBlocksPanel(panelBlocks = []) {
    const allBlocks = []

    for (let i = 0; i < panelBlocks.length; i++) {
        const element = createFlowBlock(panelBlocks[i][1], panelBlocks[i][0], panelBlocks[i][0], false)
        allBlocks.push([element, panelBlocks[i][0], panelBlocks[i][1]])
    }

    return allBlocks
}
*/

// tools
const editButton = document.getElementById('edit-button')
const connectButton = document.getElementById('connect-button')
const moveButton = document.getElementById('move-button')
const eraseButton = document.getElementById('erase-button')

editButton.addEventListener('click', () => {
    toggleSwitch([editButton, connectButton, moveButton, eraseButton], 0, 'active', () => {
        toggleDraggables(false)
        currentTool = 'edit'
    })
})
connectButton.addEventListener('click', () => {
    toggleSwitch([editButton, connectButton, moveButton, eraseButton], 1, 'active', () => {
        toggleDraggables(false)
        currentTool = 'connect'
    })
})
moveButton.addEventListener('click', () => {
    toggleSwitch([editButton, connectButton, moveButton, eraseButton], 2, 'active', () => {
        toggleDraggables(true)
        currentTool = 'move'
    })
})
eraseButton.addEventListener('click', () => {
    toggleSwitch([editButton, connectButton, moveButton, eraseButton], 3, 'active', () => {
        toggleDraggables(false)
        currentTool = 'erase'
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

// Side Panel
document.getElementById('start').addEventListener('click', () => addFlowBlock('terminal', 'start', [0, 0]))
document.getElementById('end').addEventListener('click', () => addFlowBlock('terminal', 'end', [0, 0]))
document.getElementById('process').addEventListener('click', () => addFlowBlock('terminal', 'process', [0, 0]))
document.getElementById('decision').addEventListener('click', () => addFlowBlock('terminal', 'decision', [0, 0]))
document.getElementById('input').addEventListener('click', () => addFlowBlock('terminal', 'input', [0, 0]))
document.getElementById('output').addEventListener('click', () => addFlowBlock('terminal', 'output', [0, 0]))

//HARD R CODED
addFlowBlock('terminal', 'start', [0, 0])
addFlowBlock('inputOutput', 'INPUT X', [100, 100])
addFlowBlock('decision', 'X > 5', [200, 300])
addFlowBlock('terminal', 'end', [500, 300])

addConnection(0, 1)
addConnection(1, 2)
addConnection(2, 3)

// remFlowBlock(2)