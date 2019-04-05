import _ from 'lodash'
import UniFind from '../../core/algorithm/uni-find'

class Graph {
  constructor () {
    this.vertexes = new Set()
    this.edges = new Set()
    this.next = {}
  }
}

const parse = (vertexes, edges) => {
  const graph = { edges: [], next: {} }
  vertexes.forEach(v => (graph.next[v] = -1))
  const loadEdge = edge => {
    const last = graph.next[edge.from]
    graph.edges.push(_.extend(edge, { next: last }))
    graph.next[edge.from] = graph.edges.length - 1
  }
  for (let i = 0; i < edges.length; ++i) {
    loadEdge({ from: edges[i][0], to: edges[i][1] })
    loadEdge({ from: edges[i][1], to: edges[i][0] })
  }
  return graph
}

const generate = (vertexSize, connected = true) => {
  const vertexes = Array.from(new Array(vertexSize), (_, i) => String.fromCharCode('A'.charCodeAt(0) + i))
  const edges = []
  const unifind = new UniFind(vertexSize, vertexes)
  for (let i = 0; i < vertexSize; ++i) {
    for (let j = i + 1; j < vertexSize; ++j) {
      const vFrom = vertexes[i]
      const vTo = vertexes[j]
      unifind.union(vFrom, vTo)
      edges.push(vFrom + vTo)
      // TODO: Unfinished
    }
  }
  return edges
}

export default {
  Graph,
  parse,
  generate
}
