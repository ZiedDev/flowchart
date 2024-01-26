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
        element.querySelector('[data-flowchart-block-id]').id = this.id
        element.querySelector('[data-flowchart-block-content]').textContent = this.content

        element.querySelector('[data-flowchart-block-id]').classList.add('draggable')
        flowchartBoard.appendChild(element)
        const elementDraggable = new PlainDraggable(document.getElementById(this.id))
        
        /*document.getElementById(this.id).addEventListener('click', () => {
            if (currentTool == 'erase') {
                draggables.splice(draggables.indexOf(elementDraggable), 1)
                elementDraggable.remove()
                document.getElementById(this.id).remove()
            }
        })*/

        return [element, elementDraggable]
    }

    updateFlowBlock(func, whatToUpdate) {
        this.draggable[func] = whatToUpdate
    }
}

let connections = {}
let flowBlocks = {}
let global_index = -1

function addFlowBlock(type, content, pos = [0, 0]) {
    let newBlock = new FlowBlock(global_index + 1, type, content, pos)
    flowBlocks[global_index + 1] = newBlock
    global_index++
}
function remFlowBlock(id) {
    // to implement
}

function addConnection(fromId, toId) {
    let cid = `${fromId}:${toId}`
    let startNode = flowBlocks[fromId]
    let endNode = flowBlocks[toId]

    connections[cid] = createLine(String(fromId), String(toId), startNode, endNode)
    startNode.connections.push(connections[cid])
    endNode.connections.push(connections[cid])
}
function remConnection(fromId, toId) {
    // to implement
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

// tools
const blocksButton = document.getElementById('blocks-button')
const wiresButton = document.getElementById('wires-button')
const moveButton = document.getElementById('move-button')
const eraseButton = document.getElementById('erase-button')

blocksButton.addEventListener('click', () => {
    toggleSwitch([blocksButton, wiresButton, moveButton, eraseButton], 0, 'active', () => {
        toggleDraggables(false)
        currentTool = 'blocks'
    })
})
wiresButton.addEventListener('click', () => {
    toggleSwitch([blocksButton, wiresButton, moveButton, eraseButton], 1, 'active', () => {
        toggleDraggables(false)
        currentTool = 'wires'
    })
})
moveButton.addEventListener('click', () => {
    toggleSwitch([blocksButton, wiresButton, moveButton, eraseButton], 2, 'active', () => {
        toggleDraggables(true)
        currentTool = 'move'
    })
})
eraseButton.addEventListener('click', () => {
    toggleSwitch([blocksButton, wiresButton, moveButton, eraseButton], 3, 'active', () => {
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
    if (!enable) {
        for (let i = 0; i < draggables.length; i++) {
            draggables[i].disabled = true
        }
    }
    else {
        for (let i = 0; i < draggables.length; i++) {
            draggables[i].disabled = false
        }
    }
}*/

//HARD R CODED
addFlowBlock('terminal', 'start')
addFlowBlock('inputOutput', 'INPUT X')
addFlowBlock('decision', 'X > 5')
addFlowBlock('terminal', 'end')

addConnection(0, 1)
addConnection(1, 2)
addConnection(2, 3)