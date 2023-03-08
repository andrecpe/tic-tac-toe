<template>
  <v-app>
    <div class="mymain">
      <v-container class="d-flex flex-column align-center">
        <canvas id="nome" height="30" width="300"></canvas>
        <canvas id="jogo" height="24" width="300" class="mb-3"></canvas>
        <div class="d-flex justify-center" v-for="i in 3" :key="i">
          <canvas :id="`square${(i-1) * 3 + j}`" :height="ss" :width="ss" v-for="j in 3" :key="j"
                  :style="{cursor: squares[(i-1) * 3 + j -1]=== null ? 'pointer' : 'default'}" @click="jogar"/>
        </div>
        <div class="bg-blue-grey rounded rounded-pill py-2 px-4 my-4 text-white">
          {{ vencedor ? vencedor.resultado : `Próximo Jogador: ${jogador}` }}
        </div>
        <v-btn color="#8A4FFF" size="small" style="color: white" v-for="(h, i) in history" :key="i"
               @click="mudaHistory(i)" width="150" class="mb-1">{{ i === 0 ? `Reiniciar!` : `Movimento #${i}` }}
        </v-btn>
      </v-container>
    </div>
  </v-app>
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
    jogar(evt) {
      const num = evt.target.id.slice(6) - 1
      if (this.squares[num] !== null || this.vencedor) return
      this.squares[num] = this.jogador
      this.printJogada(evt.target.getContext("2d"), this.jogador)
      this.history.push({
        num,
        jogador: this.jogador,
        squares: [...this.squares]
      })
      if (this.vencedor) this.printVitoria(this.vencedor.line)
    },
    drawNome() {
      const canvas = document.getElementById("nome")
      const ctx = canvas.getContext("2d")
      ctx.font = "20px Amita"
      ctx.fillStyle = "#1C1C1C"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText('Laura de Araújo Alves Costa', 150, 18)
    },
    drawJogo() {
      const canvas = document.getElementById("jogo")
      const ctx = canvas.getContext("2d")
      ctx.font = '16px Montserrat'
      ctx.fillStyle = '#1C1C1C'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('TIC-TAC-TOE', 150, 12)
    },
    printJogada(ctx, val) {
      if (!val) return
      ctx.font = Math.floor(this.ss * 0.62) + "px Montserrat"
      ctx.fillStyle = this.cor
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(val, Math.floor(this.ss * 0.5), Math.floor(this.ss * 0.54));
    },
    printBoard(ctx, board) {
      ctx.strokeStyle = this.cor
      ctx.lineWidth = Math.floor(this.ss * 0.02)
      switch (board) {
        case 1:
          ctx.moveTo(this.ss, 0)
          ctx.lineTo(this.ss, this.ss)
          ctx.lineTo(0, this.ss)
          break
        case 2:
          ctx.moveTo(0, 0)
          ctx.lineTo(0, this.ss)
          ctx.lineTo(this.ss, this.ss)
          ctx.lineTo(this.ss, 0)
          break
        case 3:
          ctx.moveTo(0, 0)
          ctx.lineTo(0, this.ss)
          ctx.lineTo(this.ss, this.ss)
          break
        case 4:
          ctx.moveTo(0, 0)
          ctx.lineTo(this.ss, 0)
          ctx.lineTo(this.ss, this.ss)
          ctx.lineTo(0, this.ss)
          break
        case 5:
          ctx.moveTo(0, 0)
          ctx.lineTo(this.ss, 0)
          ctx.lineTo(this.ss, this.ss)
          ctx.lineTo(0, this.ss)
          ctx.lineTo(0, 0)
          break
        case 6:
          ctx.moveTo(this.ss, 0)
          ctx.lineTo(0, 0)
          ctx.lineTo(0, this.ss)
          ctx.lineTo(this.ss, this.ss)
          break
        case 7:
          ctx.moveTo(0, 0)
          ctx.lineTo(this.ss, 0)
          ctx.lineTo(this.ss, this.ss)
          break
        case 8:
          ctx.moveTo(0, this.ss)
          ctx.lineTo(0, 0)
          ctx.lineTo(this.ss, 0)
          ctx.lineTo(this.ss, this.ss)
          break
        case 9:
          ctx.moveTo(0, this.ss)
          ctx.lineTo(0, 0)
          ctx.lineTo(this.ss, 0)
          break
        default:
          return
      }
      ctx.stroke()
    },
    printVitoria([a, b, c, desenho]) {
      a += 1;b += 1;c += 1;
      [{ctx: document.querySelector("#square" + a).getContext("2d"), num: a},
        {ctx: document.querySelector("#square" + b).getContext("2d"), num: b},
        {ctx: document.querySelector("#square" + c).getContext("2d"), num: c}
      ].forEach(({ctx, num}) => {
        ctx.lineWidth = Math.floor(this.ss * 0.04)
        ctx.lineCap = "round"
        ctx.strokeStyle = this.cor
        if (desenho === 'h') {
          if (num === 2 || num === 5 || num === 8) {
            ctx.moveTo(0, Math.floor(this.ss * 0.5))
            ctx.lineTo(this.ss, Math.floor(this.ss * 0.5))
          } else if (num === 1 || num === 4 || num === 7) {
            ctx.moveTo(Math.floor(this.ss * 0.06), Math.floor(this.ss * 0.5))
            ctx.lineTo(this.ss, Math.floor(this.ss / 2))
          } else if (num === 3 || num === 6 || num === 9) {
            ctx.moveTo(0, Math.floor(this.ss / 2))
            ctx.lineTo(Math.floor(this.ss * 0.94), Math.floor(this.ss * 0.5))
          }
        }
        if (desenho === 'v') {
          if (num === 4 || num === 5 || num === 6) {
            ctx.moveTo(Math.floor(this.ss * 0.5), 0)
            ctx.lineTo(Math.floor(this.ss * 0.5), this.ss)
          } else if (num === 1 || num === 2 || num === 3) {
            ctx.moveTo(Math.floor(this.ss * 0.5), Math.floor(this.ss * 0.06))
            ctx.lineTo(Math.floor(this.ss * 0.5), this.ss)
          } else if (num === 7 || num === 8 || num === 9) {
            ctx.moveTo(Math.floor(this.ss * 0.5), 0)
            ctx.lineTo(Math.floor(this.ss * 0.5), Math.floor(this.ss * 0.94))
          }
        }
        if (desenho === 'd1') {
          if (num === 5) {
            ctx.moveTo(0, 0)
            ctx.lineTo(this.ss, this.ss)
          } else if (num === 1) {
            ctx.moveTo(Math.floor(this.ss * 0.08), Math.floor(this.ss * 0.08))
            ctx.lineTo(this.ss, this.ss)
          } else if (num === 9) {
            ctx.moveTo(0, 0)
            ctx.lineTo(Math.floor(this.ss * 0.92), Math.floor(this.ss * 0.92))
          }
        }
        if (desenho === 'd2') {
          if (num === 5) {
            ctx.moveTo(this.ss, 0)
            ctx.lineTo(0, this.ss)
          } else if (num === 3) {
            ctx.moveTo(Math.floor(this.ss * 0.94), Math.floor(this.ss * 0.06))
            ctx.lineTo(0, this.ss)
          } else if (num === 7) {
            ctx.moveTo(this.ss, 0)
            ctx.lineTo(Math.floor(this.ss * 0.06), Math.floor(this.ss * 0.94))
          }
        }
        ctx.stroke()
      })
    },
    mudaHistory(num) {
      if (num === 0) {
        this.history = []
        this.squares = Array(9).fill(null)
      } else {
        this.history = [...this.history.slice(0, num)]
        this.squares = [...this.history[this.history.length - 1].squares]
      }
      document.querySelectorAll('[id^="square"]').forEach(el => {
        let ctx = el.getContext("2d")
        ctx.clearRect(0, 0, this.ss, this.ss)
        ctx.stroke()
      })
      document.querySelectorAll('[id^="square"]').forEach(el => {
        let ctx = el.getContext("2d")
        const myId = el.id.slice(6)
        this.printBoard(ctx, myId)
      })
      document.querySelectorAll('[id^="square"]').forEach(el => {
        let ctx = el.getContext("2d")
        this.printJogada(ctx, this.squares[el.id.slice(6) - 1])
      })

      this.history.forEach(h => {
        console.log(h.num, h.jogador, h.squares)
      })
      console.log("squares", this.squares)
    },
  },
  computed: {
    rodada() {
      return this.history.length
    },
    jogador() {
      return this.rodada % 2 === 0 ? 'X' : 'O'
    },
    vencedor() {
      const lines = [
        [0, 1, 2, 'h'],
        [3, 4, 5, 'h'],
        [6, 7, 8, 'h'],
        [0, 3, 6, 'v'],
        [1, 4, 7, 'v'],
        [2, 5, 8, 'v'],
        [0, 4, 8, 'd1'],
        [2, 4, 6, 'd2'],
      ]
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (this.squares[a] && this.squares[a] === this.squares[b] && this.squares[a] === this.squares[c]) {
          return {
            resultado: `Vencedor: ${this.squares[a]}!`,
            line: lines[i]
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
    this.drawNome()
    this.drawJogo()
    for (let i = 1; i <= 9; i++) {
      const canvas = document.getElementById(`square${i}`)
      const ctx = canvas.getContext("2d")
      this.printBoard(ctx, i)
    }
  },
}
</script>
<style>
.mymain {
  background-image: url("@/assets/c903a0bb-6a58-4aac-92b3-456e4b9e2f66.jpg");
  background-size: 480px;
  background-position-x: center;
  background-repeat: repeat;
  height: 100vh;
  width: 100vw;
}

</style>