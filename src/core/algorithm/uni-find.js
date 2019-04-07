class UniFind {
  constructor (size, points) {
    this.father = {}
    if (!points) {
      points = Array.from(new Array(size), (_, i) => i)
    }
    points.forEach(p => (this.father[p] = p))
  }

  union (x, y) {
    const fx = this.find(x)
    const fy = this.find(y)
    if (fx !== fy) {
      this.father[fx] = fy
    }
  }

  find (x) {
    if (this.father[x] === x) {
      return x
    }
    return (this.father[x] = this.find(this.father[x]))
  }
}

export default UniFind
