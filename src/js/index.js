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
const draggables = []

// hard coded
const start = createFlowBlock('terminal', '0', 'start', flowchartBoard, true)[1]
const input = createFlowBlock('inputOutput', '1', 'INPUT X', flowchartBoard, true)[1]
const condition = createFlowBlock('decision', '2', 'X > 5', flowchartBoard, true)[1]
const end = createFlowBlock('terminal', '3', 'end', flowchartBoard, true)[1]

const line1 = createLine('0', '1')
const line2 = createLine('1', '2')
const line3 = createLine('2', '3')

updateFlowBlock(start, 'onMove', () => { line1.position() })
updateFlowBlock(input, 'onMove', () => { line1.position(), line2.position() })
updateFlowBlock(condition, 'onMove', () => { line2.position(), line3.position() })
updateFlowBlock(end, 'onMove', () => { line3.position() })

function createFlowBlock(symbolType, id, content, draggable) {
    const flowchartSymbols = ['terminal', 'process', 'decision', 'inputOutput']

    let element

    if (symbolType == 'terminal') {
        element = terminalTemplate.content.cloneNode(true)
        element.querySelector('[data-flowchart-block-id]').id = id
        element.querySelector('[data-flowchart-block-content]').textContent = content

    } else if (symbolType == 'process') {
        element = processTemplate.content.cloneNode(true)
        element.querySelector('[data-flowchart-block-id]').id = id
        element.querySelector('[data-flowchart-block-content]').textContent = content

    } else if (symbolType == 'decision') {
        element = decisionTemplate.content.cloneNode(true)
        element.querySelector('[data-flowchart-block-id]').id = id
        element.querySelector('[data-flowchart-block-content]').textContent = content

    } else if (symbolType == 'inputOutput') {
        element = inputOutputTemplate.content.cloneNode(true)
        element.querySelector('[data-flowchart-block-id]').id = id
        element.querySelector('[data-flowchart-block-content]').textContent = content
    }

    if (!draggable) return element

    flowchartBoard.appendChild(element)
    const elementDraggable = new PlainDraggable(document.getElementById(id))
    draggables.push(elementDraggable)

    return [element, elementDraggable]
}

function updateFlowBlock(flowBlock, func, whatToUpdate) {
    flowBlock[func] = whatToUpdate
}

function createLine(start, end) {
    const line = new LeaderLine(document.getElementById(start), document.getElementById(end), { startPlug: 'disc', size: 4, startPlugSize: 1.5, startPlugOutlineSize: 2.5, color: '#f0f8ff', path: 'fluid' })
    return line
}

// addBlockPanel
const addBlocksPanel = document.getElementById('add-blocks-panel')
const addPanelBlocks = [['start', 'terminal'], ['end', 'terminal'], ['input', 'inputOutput'], ['output', 'inputOutput'], ['condition', 'decision']]
const addPanelElements = createBlocksPanel(addPanelBlocks)

for (let i = 0; i < addPanelElements.length; i++) {
    const ele = addPanelElements[i]
    addBlocksPanel.appendChild(ele[0])
    document.getElementById(ele[1]).addEventListener('click', () => createFlowBlock(ele[2], `${Math.floor(Math.random() * 99999)}`, '...', true))
}

function createBlocksPanel(panelBlocks = []) {
    const allBlocks = []

    for (let i = 0; i < panelBlocks.length; i++) {
        const element = createFlowBlock(panelBlocks[i][1], panelBlocks[i][0], panelBlocks[i][0], false)
        allBlocks.push([element, panelBlocks[i][0], panelBlocks[i][1]])
    }

    return allBlocks
}

// building mode
const blocksButton = document.getElementById('blocks-button')
const wiresButton = document.getElementById('wires-button')
const moveButton = document.getElementById('move-button')

blocksButton.addEventListener('click', () => {
    toggleSwitch([blocksButton, wiresButton, moveButton], 0, 'active', () => {
        toggleDraggables(false)
    })
})

wiresButton.addEventListener('click', () => {
    toggleSwitch([blocksButton, wiresButton, moveButton], 1, 'active', () => {
        toggleDraggables(false)
    })
})
moveButton.addEventListener('click', () => {
    toggleSwitch([blocksButton, wiresButton, moveButton], 2, 'active', () => {
        toggleDraggables(true)
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
}