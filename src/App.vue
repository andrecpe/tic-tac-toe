<template>
  <canvas id="nome" height="30" width="300"></canvas>
  <canvas id="jogo" height="24" width="300" class="jogo"></canvas>
  <div :style="styleBase">
    <canvas :height="3*ss" :width="3*ss" :style="styleMain" id="principal"></canvas>
    <canvas :height="3*ss" :width="3*ss" :style="styleResultado" id="resultado"></canvas>
    <canvas v-for="i in 9" :id="`square${i}`" :height="ss" :width="ss" :key="i"
            :style="quadrado(i)"
            @click="jogar(i)"/>
  </div>
  <div class="placar">
    {{ vencedor ? vencedor.resultado : `Próximo Jogador: ${jogador}` }}
  </div>
  <button class="mybtn" v-for="i in history.length" :key="i"
          @click="mudaHistory(i-1)">{{
      (i - 1) === 0 ? `Reiniciar!` : `Movimento #${(i - 1)}`
    }}
  </button>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    ss: 100,
    cor: "hotpink",
    history: [],
    squares: Array(9).fill(null),
  }),
  methods: {
    quadrado(val) {
      const pos = val - 1
      // console.log("top", `${Math.floor(pos / 3) * this.ss}px`, "left", `${(pos % 3) * this.ss}px`)
      return {
        position: 'absolute',
        top: `${Math.floor(pos / 3) * this.ss}px`,
        left: `${(pos % 3) * this.ss}px`,
        cursor: this.squares[pos] === null ? 'pointer' : 'default',
        zIndex: 90,
      }
    },
    jogar(num) {
      if (this.squares[num - 1] !== null || this.vencedor) return
      this.squares[num - 1] = this.jogador
      this.printJogada(num, this.jogador)
      this.history.push({
        num,
        jogador: this.jogador,
        squares: [...this.squares]
      })
      if (this.vencedor) this.printResultado(this.vencedor.line)
    },
    drawNomes(id, text, font, size, x, y) {
      const ctx = document.getElementById(id).getContext("2d")
      // ctx.font = "20px Amita"
      ctx.font = `${size}px ${font}`
      ctx.fillStyle = "#1C1C1C"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(text, x, y)
    },
    printJogada(num, val) {
      if (!val) return
      const ctx = document.getElementById(`square${num}`).getContext("2d")
      ctx.beginPath()
      ctx.font = Math.floor(this.ss * 0.62) + "px Montserrat"
      ctx.fillStyle = this.cor
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(val, Math.floor(this.ss * 0.5), Math.floor(this.ss * 0.54));
    },
    printBoard() {
      const ctx = document.getElementById("principal").getContext("2d")
      ctx.beginPath()
      ctx.strokeStyle = this.cor
      ctx.lineWidth = Math.floor(this.ss * 0.04)
      ctx.moveTo(this.ss, 0)
      ctx.lineTo(this.ss, 3 * this.ss)
      ctx.moveTo(2 * this.ss, 0)
      ctx.lineTo(2 * this.ss, 3 * this.ss)
      ctx.moveTo(0, this.ss)
      ctx.lineTo(3 * this.ss, this.ss)
      ctx.moveTo(0, 2 * this.ss)
      ctx.lineTo(3 * this.ss, 2 * this.ss)
      ctx.stroke()
    },
    clearBoard() {
      document.querySelectorAll('[id^="square"]').forEach(el => {
        el.getContext("2d").clearRect(0, 0, this.ss, this.ss)
      })
      document.getElementById("resultado").getContext("2d").clearRect(0, 0, 3 * this.ss, 3 * this.ss)
    },

    printResultado(line) {
      const ctx = document.getElementById("resultado").getContext("2d")
      ctx.beginPath()
      ctx.lineWidth = Math.floor(this.ss * 0.04)
      ctx.lineCap = "round"
      ctx.strokeStyle = this.cor
      const ini = this.ss * 0.1, fim = this.ss * 2.9, parte = num => (num % 3 + 0.5) * this.ss
      const animete = (xo, yo, xf, yf) => {
        const tempo = 800  // milisegundos
        ctx.moveTo(xo, yo)
        let start = null, x = xo, y = yo
        const animar = timestamp => {
          !start && (start = timestamp)
          const progress = timestamp - start
          console.log(progress / tempo)
          x = xo + (xf - xo) * (progress / tempo)
          y = yo + (yf - yo) * (progress / tempo)
          ctx.lineTo(Math.min(Math.floor(x), xf), Math.min(Math.floor(y), yf))
          ctx.stroke()
          progress < tempo && requestAnimationFrame(animar)
        }
        requestAnimationFrame(animar)
      }
      line === 0 && animete(ini, parte(line), fim, parte(line))
      line === 1 && animete(ini, parte(line), fim, parte(line))
      line === 2 && animete(ini, parte(line), fim, parte(line))
      line === 3 && animete(parte(line), ini, parte(line), fim)
      line === 4 && animete(parte(line), ini, parte(line), fim)
      line === 5 && animete(parte(line), ini, parte(line), fim)
      line === 6 && animete(ini, ini, fim, fim)
      line === 7 && animete(fim, ini, ini, fim)
    },

    mudaHistory(num) {
      if (num === 0) {
        this.history = []
        this.squares = Array(9).fill(null)
      } else {
        this.history = [...this.history.slice(0, num)]
        this.squares = [...this.history[this.history.length - 1].squares]
      }
      this.clearBoard()
      this.history.forEach(({num, jogador}) => {
        this.printJogada(num, jogador)
      })
    },
  },
  computed: {
    styleBase() {
      return {
        position: 'relative',
        width: `${3 * this.ss}px`,
        height: `${3 * this.ss}px`,
        zIndex: 40,
      }
    },
    styleMain() {
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 80,
      }
    },
    styleResultado() {
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 85,
      }
    },
    rodada() {
      return this.history.length
    },
    jogador() {
      return this.rodada % 2 === 0 ? 'X' : 'O'
    },
    vencedor() {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ]
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (this.squares[a] && this.squares[a] === this.squares[b] && this.squares[a] === this.squares[c]) {
          return {
            resultado: `Vencedor: ${this.squares[a]}!`,
            line: i
          }
        }
      }
      if (this.rodada === 9) {
        return {
          resultado: 'Empate!',
          line: null
        }
      }
      return null;
    },
  },
  mounted() {
    (async fora => {
      await document.fonts.load("20px Amita")
      fora.drawNomes("nome", "Laura de Araújo Alves Costa", "Amita", 20, 150, 18)
      await document.fonts.load("16px Montserrat")
      fora.drawNomes("jogo", "TIC-TAC-TOE", "Montserrat", 16, 150, 12)
    })(this)
    this.printBoard()
  },
}
</script>
<style>
:root {
  background-image: url("@/assets/c903a0bb-6a58-4aac-92b3-456e4b9e2f66.jpg");
  background-size: 480px;
  background-position-x: center;
  background-repeat: repeat;
}

body {
  margin: 0;
  padding: 0;
}

.jogo {
  margin-bottom: 8px;
}

.placar {
  background-color: #607D8B;
  color: white;
  padding: 12px 16px;
  margin-top: 8px;
  margin-bottom: 8px;
  border-radius: 24px;
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  width: 180px;
  text-align: center;
}

.mybtn {
  color: white;
  background-color: #8A4FFF;
  border: 1px solid #8A4FFF;
  border-radius: 24px;
  padding: 8px 12px;
  margin-bottom: 4px;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  width: 150px;
  text-align: center;
  cursor: pointer;
}

.mybtn:before {
  opacity: 0 !important;
}

#nome {
  margin-top: 8px;
}
</style>