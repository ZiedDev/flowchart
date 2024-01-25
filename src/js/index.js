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

const start = createFlowBlock('terminal', 'start', 'start')[1]
const input = createFlowBlock('inputOutput', 'input', 'INPUT X',)[1]
const condition = createFlowBlock('decision', 'condition', 'X > 5')[1]
const end = createFlowBlock('terminal', 'end', 'end')[1]

const line1 = createLine('start', 'input', start, input)
const line2 = createLine('input', 'condition', input, condition)
const line3 = createLine('condition', 'end', condition, end)

updateFlowBlock(input, 'onMove', () => { line1.position(), line2.position() })
updateFlowBlock(condition, 'onMove', () => { line2.position(), line3.position() })

function createFlowBlock(symbolType, id, content) {
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

    flowchartBoard.appendChild(element)
    const elementDraggable = new PlainDraggable(document.getElementById(id))

    return [element, elementDraggable]
}

function updateFlowBlock(flowBlock, func, whatToUpdate) {
    flowBlock[func] = whatToUpdate
}

function createLine(start, end, startNode, endNode) {
    const line = new LeaderLine(document.getElementById(start), document.getElementById(end), { startPlug: 'disc', size: 4, startPlugSize: 1.5, startPlugOutlineSize: 2.5, color: '#f0f8ff', path: 'fluid' })

    startNode.onMove = () => { line.position() }
    endNode.onMove = () => { line.position() }

    return line
}