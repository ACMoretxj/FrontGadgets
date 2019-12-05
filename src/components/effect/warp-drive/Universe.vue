<!-- reference: https://codepen.io/NiklasKnaack/pen/OmwgKb -->
<template>
  <div class="body">
    <div id='holder' style='background-color:#000; width:800px; height:300px; position:relative'>
      <div id='effect' style='position:absolute; width:800px; height:300px'></div>
    </div>
  </div>
</template>

<!--suppress JSUnresolvedVariable -->
<script>
export default {
  name: 'Universe',

  data () {
    return {
      canvasWidth: 800,
      canvasHeight: 300,
      canvas: null,
      ctx: null,
      imageData: null,
      backgroundColor: { r: 0, g: 0, b: 0, a: 0 },
      center: {
        x: 400,
        y: 150
      },
      mobile: false,
      mouse: {
        active: false,
        down: false,
        pos: {
          x: 400,
          y: 150
        }
      },
      fov: {
        normal: 300,
        fovMin: 210,
        fovMax: 300
      },
      stars: {
        holderCount: 6666,
        holder: [],
        bgHolder: [],
        speed: 20,
        speedMin: 20,
        speedMax: 200,
        distance: 8000,
        rotation: 0
      }
    }
  },

  methods: {
    getMousePos (canvas, event) {
      const rect = canvas.getBoundingClientRect()
      return { x: event.clientX - rect.left, y: event.clientY - rect.top }
    },

    getTouchPos (canvas, event) {
      const rect = canvas.getBoundingClientRect()
      return { x: event.touches[ 0 ].clientX - rect.left, y: event.touches[ 0 ].clientY - rect.top }
    },

    addPCHandler (canvas) {
      canvas.addEventListener('mousemove', event => (this.mouse.pos = this.getMousePos(canvas, event)))
      canvas.addEventListener('mousedown', event => (this.mouse.down = true))
      canvas.addEventListener('mouseup', event => (this.mouse.down = false))
      canvas.addEventListener('mouseenter', event => (this.mouse.active = true))
      canvas.addEventListener('mouseleave', event => {
        this.mouse.active = false
        this.mouse.down = false
      })
    },

    addMobileHandler (canvas) {
      canvas.addEventListener('touchstart', event => {
        event.preventDefault()
        this.mouse.down = true
        this.mouse.active = true
      }, false)
      canvas.addEventListener('touchend', event => {
        event.preventDefault()
        this.mouse.down = false
        this.mouse.active = false
      }, false)
      canvas.addEventListener('touchmove', event => {
        event.preventDefault()
        this.mouse.pos = this.getTouchPos(canvas, event)
      }, false)
      canvas.addEventListener('touchcancel', event => {
        this.mouse.active = false
        this.mouse.down = false
      }, false)
    },

    clearImageData () {
      const pix = this.imageData.data
      for (let i = 0, l = pix.length; i < l; i += 4) {
        pix[ i ] = this.backgroundColor.r
        pix[ i + 1 ] = this.backgroundColor.g
        pix[ i + 2 ] = this.backgroundColor.b
        pix[ i + 3 ] = this.backgroundColor.a
      }
    },

    setPixel (x, y, r, g, b, a) {
      const pix = this.imageData.data
      const i = (x + y * this.canvasWidth) * 4
      pix[ i ] = r
      pix[ i + 1 ] = g
      pix[ i + 2 ] = b
      pix[ i + 3 ] = a
    },

    setPixelAdditive (x, y, r, g, b, a) {
      const pix = this.imageData.data
      const i = (x + y * this.canvasWidth) * 4
      pix[ i ] = pix[ i ] + r
      pix[ i + 1 ] = pix[ i + 1 ] + g
      pix[ i + 2 ] = pix[ i + 2 ] + b
      pix[ i + 3 ] = a
    },

    drawLine (x1, y1, x2, y2, r, g, b, a) {
      const dx = Math.abs(x2 - x1)
      const dy = Math.abs(y2 - y1)

      const sx = (x1 < x2) ? 1 : -1
      const sy = (y1 < y2) ? 1 : -1

      let err = dx - dy

      let lx = x1
      let ly = y1

      while (true) {
        if (lx > 0 && lx < this.canvasWidth && ly > 0 && ly < this.canvasHeight) {
          this.setPixel(lx, ly, r, g, b, a)
        }

        if ((lx === x2) && (ly === y2)) {
          break
        }

        const e2 = 2 * err
        if (e2 > -dx) {
          err -= dy
          lx += sx
        }
        if (e2 < dy) {
          err += dx
          ly += sy
        }
      }
    },

    addParticle (x, y, z, ox, oy, oz) {
      const particle = {}
      particle.x = x
      particle.y = y
      particle.z = z
      particle.ox = ox
      particle.oy = oy
      particle.x2d = 0
      particle.y2d = 0
      return particle
    },

    addParticles () {
      let x, y, z
      let colorValue
      let particle

      for (let i = 0; i < this.stars.holderCount / 3; i++) {
        x = Math.random() * 24000 - 12000
        y = Math.random() * 4500 - 2250
        z = Math.round(Math.random() * this.stars.distance)
        colorValue = Math.floor(Math.random() * 55) + 5

        particle = this.addParticle(x, y, z, x, y, z)
        particle.color = { r: colorValue, g: colorValue, b: colorValue, a: 255 }
        this.stars.bgHolder.push(particle)
      }

      for (let i = 0; i < this.stars.holderCount; i++) {
        x = Math.random() * 10000 - 5000
        y = Math.random() * 10000 - 5000
        z = Math.round(Math.random() * this.stars.distance)

        colorValue = Math.floor(Math.random() * 155) + 100

        particle = this.addParticle(x, y, z, x, y, z)
        particle.color = { r: colorValue, g: colorValue, b: colorValue, a: 255 }
        particle.oColor = { r: colorValue, g: colorValue, b: colorValue, a: 255 }
        particle.w = 1
        particle.distance = this.stars.distance - z
        particle.distanceTotal = Math.round(this.stars.distance + this.fov.normal - particle.w)
        this.stars.holder.push(particle)
      }
    },

    render () {
      let scale

      this.clearImageData()
      if (this.mouse.active) {
        this.stars.speed = Math.min(this.stars.speed + 2, this.stars.speedMax)
        this.fov.normal = Math.max(this.fov.normal - 1, this.fov.fovMin)
      } else {
        this.stars.speed = Math.max(this.stars.speed - 1, this.stars.speedMin)
        this.fov.normal = Math.min(this.fov.normal + 0.5, this.fov.fovMax)
      }

      for (let i = 0, l = this.stars.bgHolder.length; i < l; i++) {
        const star = this.stars.bgHolder[ i ]
        scale = this.fov.normal / (this.fov.normal + star.z)
        star.x2d = (star.x * scale) + this.center.x
        star.y2d = (star.y * scale) + this.center.y
        if (star.x2d > 0 && star.x2d < this.canvasWidth && star.y2d > 0 && star.y2d < this.canvasHeight) {
          this.setPixel(star.x2d | 0, star.y2d | 0, star.color.r, star.color.g, star.color.b, 255)
        }
      }

      let warpSpeedValue = this.stars.speed * (this.stars.speed / this.stars.speedMax)
      if (!this.mobile) {
        warpSpeedValue *= 2
      }

      for (let i = 0, l = this.stars.holder.length; i < l; i++) {
        const star = this.stars.holder[ i ]
        star.z -= this.stars.speed
        star.distance += this.stars.speed

        if (star.z < -this.fov.normal + star.w) {
          star.z = this.stars.distance
          star.distance = 0
        }

        const distancePercent = star.distance / star.distanceTotal
        star.color.r = Math.floor(star.oColor.r * distancePercent)
        star.color.g = Math.floor(star.oColor.g * distancePercent)
        star.color.b = Math.floor(star.oColor.b * distancePercent)

        let scale = this.fov.normal / (this.fov.normal + star.z)
        star.x2d = (star.x * scale) + this.center.x
        star.y2d = (star.y * scale) + this.center.y
        if (star.x2d > 0 && star.x2d < this.canvasWidth && star.y2d > 0 && star.y2d < this.canvasHeight) {
          this.setPixelAdditive(star.x2d | 0, star.y2d | 0, star.color.r, star.color.g, star.color.b, 255)
        }

        if (this.stars.speed !== this.stars.speedMin) {
          const nz = star.z + warpSpeedValue
          scale = this.fov.normal / (this.fov.normal + nz)

          const x2d = (star.x * scale) + this.center.x
          const y2d = (star.y * scale) + this.center.y

          if (x2d > 0 && x2d < this.canvasWidth && y2d > 0 && y2d < this.canvasHeight) {
            this.drawLine(star.x2d | 0, star.y2d | 0, x2d | 0, y2d | 0, star.color.r, star.color.g, star.color.b, 255)
          }
        }

        if (this.mouse.down) {
          const radians = Math.PI / 180 * this.stars.rotation

          const cos = Math.cos(radians)
          const sin = Math.sin(radians)

          star.x = (cos * (star.ox - this.center.x)) + (sin * (star.oy - this.center.y)) + this.center.x
          star.y = (cos * (star.oy - this.center.y)) - (sin * (star.ox - this.center.x)) + this.center.y
        }
      }

      this.ctx.putImageData(this.imageData, 0, 0)
      if (this.mouse.active) {
        this.center.x += (this.mouse.pos.x - this.center.x) * 0.015
      } else {
        this.center.x += ((this.canvasWidth / 2) - this.center.x) * 0.015
      }

      if (this.mouse.down) {
        this.stars.rotation -= 0.5
      }
    },

    animloop () {
      this.render()
      window.requestAnimFrame(this.animloop)
    }
  },

  mounted () {
    this.mobile = false
    this.canvas = document.createElement('canvas')
    document.getElementById('effect').appendChild(this.canvas)

    this.canvas.setAttribute('width', this.canvasWidth)
    this.canvas.setAttribute('height', this.canvasHeight)
    this.canvas.oncontextmenu = e => e.preventDefault()

    this.ctx = this.canvas.getContext('2d')
    this.imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight)

    if (!this.mobile) {
      this.addPCHandler(this.canvas)
    } else {
      this.addMobileHandler(this.canvas)
    }

    window.requestAnimFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      (callback => (setTimeout(callback, 1000 / 60)))

    this.addParticles()
    this.animloop()
  }
}
</script>

<style scoped lang="scss">
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, font, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    font-size: 100%;
    vertical-align: baseline;
    background: transparent;
    box-sizing: border-box;
  }

  .body {
    overflow: hidden;
    background-color: #111;
  }
</style>
