import PlainDraggable from 'plain-draggable'
import LeaderLine from 'leader-line-new'

import '../css/index.css'
import '../css/flowchartSymbols.css'

const flowchartBoard = document.getElementById('flowchart-board')
const startTemplate = document.getElementById('start-template')
const endTemplate = document.getElementById('end-template')

flowchartBoard.appendChild(startTemplate.content.cloneNode(true))
flowchartBoard.appendChild(endTemplate.content.cloneNode(true))

const startDraggable = new PlainDraggable(document.getElementById('start'), { onMove: () => startEndLine.position() })
const endDraggable = new PlainDraggable(document.getElementById('end'), { onMove: () => startEndLine.position() })

const startEndLine = new LeaderLine(document.getElementById('start'), document.getElementById('end'), { startPlug: 'disc', size: 4, startPlugSize: 1.5, startPlugOutlineSize: 2.5, color: '#f0f8ff', path: 'fluid' })