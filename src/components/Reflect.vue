<template>
  <div>
    <canvas
      id="reflect-canvas"
    >
      {{ canvas.invalidHint }}
    </canvas>
  </div>
</template>

<script>
export default {
  name: 'Reflect',
  data () {
    return {
      // unit: ms
      flushInterval: 1,
      canvas: {
        invalidHint: '您的浏览器不支持Canvas！',
        width: 900,
        height: 700
      },
      ring: {
        center: {
          x: 450,
          y: 350
        },
        radius: 300,
        color: '#00FF00',
        lineWidth: 10
      },
      ball: {
        center: {
          x: 450,
          y: 350
        },
        radius: 50,
        motion: {
          // polar coordinate system radian
          radian: 30 * Math.PI / 180,
          // pixels per millisecond
          speed: 1
        },
        color: '#000000'
      }
    }
  },
  mounted () {
    this.reviseValue()
    const ctx = this.initCanvas()
    const self = this
    const run = () => self.move(ctx, this.flushInterval)
    setInterval(run, this.flushInterval)
  },
  methods: {
    initCanvas () {
      const canvas = document.getElementById('reflect-canvas')
      canvas.width = this.canvas.width
      canvas.height = this.canvas.height
      const ctx = canvas.getContext('2d')
      this.drawRing(ctx)
      this.drawBall(ctx)
      return ctx
    },
    move (ctx, time) {
      const speedX = this.ball.motion.speed * Math.cos(this.ball.motion.radian)
      const speedY = -1 * this.ball.motion.speed * Math.sin(this.ball.motion.radian)
      // clear the canvas
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      // move a distance and redraw
      this.ball.center.x += speedX * time
      this.ball.center.y += speedY * time
      this.drawRing(ctx)
      this.drawBall(ctx)
      // detect collision and change direction
      if (this.collision()) {
        this.ball.motion.speed *= -1
        this.ball.motion.radian = Math.random() * Math.PI * 2
      }
    },
    collision () {
      const maxDist = this.ring.radius - this.ring.lineWidth / 2 - this.ball.radius
      const dist = Math.sqrt(Math.pow(this.ring.center.x - this.ball.center.x, 2) + Math.pow(this.ring.center.y - this.ball.center.y, 2))
      return dist >= maxDist
    },
    drawRing (ctx) {
      ctx.beginPath()
      ctx.arc(this.ring.center.x, this.ring.center.y, this.ring.radius, 0, 2 * Math.PI)
      ctx.strokeStyle = this.ring.color
      ctx.lineWidth = this.ring.lineWidth
      ctx.stroke()
      ctx.save()
      ctx.closePath()
    },
    drawBall (ctx) {
      ctx.beginPath()
      ctx.arc(this.ball.center.x, this.ball.center.y, this.ball.radius, 0, 2 * Math.PI)
      ctx.fillStyle = this.ball.color
      ctx.lineWidth = this.ring.lineWidth
      ctx.fill()
      ctx.save()
      ctx.closePath()
    },
    reviseValue () {
      // value of the ring
      this.ring.center.x = this.canvas.width / 2
      this.ring.center.y = this.canvas.height / 2
      this.ring.radius = this.ring.center.y - this.ring.lineWidth
      // value of the ball
      this.ball.center.x = this.ring.center.x
      this.ball.center.y = this.ring.center.y + this.ring.radius - this.ring.lineWidth / 2 - this.ball.radius
    }
  },
  computed: {
  },
  watch: {
    canvas: {
      deep: true,
      handler () {
        this.reviseValue()
        this.initCanvas()
      }
    }
  }
}
</script>

<style scoped>

</style>
