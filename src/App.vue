<template>
  <div class="mycontainer mymain">
    <canvas id="nome" height="30" width="300"></canvas>
    <canvas id="jogo" height="24" width="300" class="jogo"></canvas>
    <div class="subone" v-for="i in 3" :key="i">
      <canvas :id="`square${(i-1) * 3 + j}`" :height="ss" :width="ss" v-for="j in 3" :key="j"
              :style="{cursor: squares[(i-1) * 3 + j -1]=== null ? 'pointer' : 'default'}"
              @click="jogar((i-1) * 3 + j)"/>
    </div>
    <div class="placar">
      {{ vencedor ? vencedor.resultado : `Próximo Jogador: ${jogador}` }}
    </div>
    <button class="mybtn" v-for="i in history.length" :key="i"
            @click="mudaHistory(i-1)">{{
        (i-1) === 0 ? `Reiniciar!` : `Movimento #${(i-1)}`
      }}
    </button>
  </div>
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
    jogar(num) {
      if (this.squares[num - 1] !== null || this.vencedor) return
      this.squares[num - 1] = this.jogador
      this.printJogada(num, this.jogador)
      this.history.push({
        num,
        jogador: this.jogador,
        squares: [...this.squares]
      })
      if (this.vencedor) this.printVitoria(this.vencedor.line)
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
      ctx.font = Math.floor(this.ss * 0.62) + "px Montserrat"
      ctx.fillStyle = this.cor
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(val, Math.floor(this.ss * 0.5), Math.floor(this.ss * 0.54));
    },
    printBoard() {
      document.querySelectorAll('[id^="square"]').forEach(el => {
        const ctx = el.getContext("2d")
        ctx.beginPath()
        ctx.strokeStyle = this.cor
        ctx.lineWidth = Math.floor(this.ss * 0.04)
        ctx.strokeRect(0, 0, this.ss, this.ss)
      })
    },
    clearBoard() {
      for (let l = 0; l < 3; l++) {
        for (let c = 0; c < 3; c++) {
          const ctx = document.getElementById(`square${l * 3 + c + 1}`).getContext("2d")
          ctx.clearRect(
              this.ss * (c === 0 ? 0 : 0.02),
              this.ss * (l === 0 ? 0 : 0.02),
              this.ss * (c === 1 ? 0.96 : 0.98),
              this.ss * (l === 1 ? 0.96 : 0.98))
        }
      }
    },
    printVitoria([a, b, c, desenho]) {
      a += 1;
      b += 1;
      c += 1;
      // console.log("chamei printVitoria", a, b, c, desenho);
      let ordem = 1;
      let velocidade = 0.02;
      [{ctx: document.querySelector("#square" + a).getContext("2d"), num: a},
        {ctx: document.querySelector("#square" + b).getContext("2d"), num: b},
        {ctx: document.querySelector("#square" + c).getContext("2d"), num: c}
      ].forEach(({ctx, num}) => {
        ctx.beginPath()
        ctx.lineWidth = Math.floor(this.ss * 0.04)
        ctx.lineCap = "round"
        ctx.strokeStyle = this.cor
        if (desenho === 'h') {
          if (num === 2 || num === 5 || num === 8) {
            ctx.moveTo(0, Math.floor(this.ss * 0.5))
            let inicio = 0
            const segundo = setInterval(() => {
              if (ordem !== 2) return
              ctx.lineTo(Math.floor(this.ss * inicio), Math.floor(this.ss * 0.5))
              inicio += velocidade
              ctx.stroke()
              if (inicio >= 1) {
                ordem++
                clearInterval(segundo)
              }
            })
            // ctx.stroke()
            // ctx.lineTo(this.ss, Math.floor(this.ss * 0.5))
          } else if (num === 1 || num === 4 || num === 7) {
            ctx.moveTo(Math.floor(this.ss * 0.06), Math.floor(this.ss * 0.5))
            let inicio = 0
            const prim = setInterval(() => {
              if (ordem !== 1) return
              ctx.lineTo(Math.floor(this.ss * inicio), Math.floor(this.ss * 0.5))
              inicio += velocidade
              ctx.stroke()
              if (inicio >= 1) {
                ordem++
                clearInterval(prim)
              }
            })
            // ctx.stroke()
            // ctx.lineTo(this.ss, Math.floor(this.ss * 0.5))
          } else if (num === 3 || num === 6 || num === 9) {
            ctx.moveTo(0, Math.floor(this.ss * 0.5))
            let inicio = 0
            const terc = setInterval(() => {
              if (ordem !== 3) return
              ctx.lineTo(Math.floor(this.ss * inicio), Math.floor(this.ss * 0.5))
              inicio += velocidade
              ctx.stroke()
              if (inicio >= 0.94) clearInterval(terc)
            })
            // ctx.lineTo(Math.floor(this.ss * 0.94), Math.floor(this.ss * 0.5))
          }
        }
        if (desenho === 'v') {
          if (num === 4 || num === 5 || num === 6) {
            ctx.moveTo(Math.floor(this.ss * 0.5), 0)
            let inicio = 0
            const segundo = setInterval(() => {
              if (ordem !== 2) return
              ctx.lineTo(Math.floor(this.ss * 0.5), this.ss * inicio)
              inicio += velocidade
              ctx.stroke()
              if (inicio > 1.1) {
                ordem++
                clearInterval(segundo)
              }
            })
          } else if (num === 1 || num === 2 || num === 3) {
            ctx.moveTo(Math.floor(this.ss * 0.5), Math.floor(this.ss * 0.06))
            let inicio = 0.06
            const prim = setInterval(() => {
              if (ordem !== 1) return
              ctx.lineTo(Math.floor(this.ss * 0.5), this.ss * inicio)
              inicio += velocidade
              ctx.stroke()
              if (inicio > 1.1) {
                ordem++
                clearInterval(prim)
              }
            })
            // ctx.lineTo(Math.floor(this.ss * 0.5), this.ss)
          } else if (num === 7 || num === 8 || num === 9) {
            ctx.moveTo(Math.floor(this.ss * 0.5), 0)
            let inicio = 0
            const terc = setInterval(() => {
              if (ordem !== 3) return
              ctx.lineTo(Math.floor(this.ss * 0.5), this.ss * inicio)
              inicio += velocidade
              ctx.stroke()
              if (inicio > 0.94) clearInterval(terc)
            })
            // ctx.lineTo(Math.floor(this.ss * 0.5), Math.floor(this.ss * 0.94))
          }
        }
        if (desenho === 'd1') {
          if (num === 5) {
            ctx.moveTo(0, 0)
            let inicio = 0
            const segundo = setInterval(() => {
              if (ordem !== 2) return
              ctx.lineTo(this.ss * inicio, this.ss * inicio)
              inicio += velocidade
              ctx.stroke()
              if (inicio > 1.1) {
                ordem++
                clearInterval(segundo)
              }
            })
            // ctx.lineTo(this.ss, this.ss)
          } else if (num === 1) {
            ctx.moveTo(Math.floor(this.ss * 0.08), Math.floor(this.ss * 0.08))
            let inicio = 0.08
            const prim = setInterval(() => {
              if (ordem !== 1) return
              ctx.lineTo(this.ss * inicio, this.ss * inicio)
              inicio += velocidade
              ctx.stroke()
              if (inicio > 1.1) {
                ordem++
                clearInterval(prim)
              }
            })
            // ctx.lineTo(this.ss, this.ss)
          } else if (num === 9) {
            ctx.moveTo(0, 0)
            let inicio = 0
            const terc = setInterval(() => {
              if (ordem !== 3) return
              ctx.lineTo(this.ss * inicio, this.ss * inicio)
              inicio += velocidade
              ctx.stroke()
              if (inicio > 0.92) clearInterval(terc)
            })
            // ctx.lineTo(Math.floor(this.ss * 0.92), Math.floor(this.ss * 0.92))
          }
        }
        if (desenho === 'd2') {
          if (num === 5) {
            ctx.moveTo(this.ss, 0)
            let inicio = 1
            const segundo = setInterval(() => {
              if (ordem !== 2) return
              ctx.lineTo(this.ss * inicio, this.ss * (1 - inicio))
              inicio -= velocidade
              ctx.stroke()
              if (inicio < -0.1) {
                ordem++
                clearInterval(segundo)
              }
            })
            // ctx.lineTo(0, this.ss)
          } else if (num === 3) {
            ctx.moveTo(Math.floor(this.ss * 0.94), Math.floor(this.ss * 0.06))
            let inicio = 0.94
            const prim = setInterval(() => {
              if (ordem !== 1) return
              ctx.lineTo(this.ss * inicio, this.ss * (1 - inicio))
              inicio -= velocidade
              ctx.stroke()
              if (inicio < -0.1) {
                ordem++
                clearInterval(prim)
              }
            })
            // ctx.lineTo(0, this.ss)
          } else if (num === 7) {
            ctx.moveTo(this.ss, 0)
            let inicio = 1
            const terc = setInterval(() => {
              if (ordem !== 3) return
              ctx.lineTo(this.ss * inicio, this.ss * (1 - inicio))
              inicio -= velocidade
              ctx.stroke()
              if (inicio < 0.06) clearInterval(terc)
            })
            // ctx.lineTo(Math.floor(this.ss * 0.06), Math.floor(this.ss * 0.94))
          }
        }
        ctx.stroke()
        ctx.closePath()
        ctx.save()
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
      this.clearBoard()
      this.history.forEach(({num, jogador}) => {
        this.printJogada(num, jogador)
      })
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
    (async function check(fora) {
      await document.fonts.load("20px Amita")
      fora.drawNomes("nome", "Laura de Araújo Alves Costa", "Amita", 20, 150, 18)
      await document.fonts.load("16px Montserrat")
      fora.drawNomes("jogo", "TIC-TAC-TOE", "Montserrat", 16, 150, 12)
    })(this)
    this.printBoard()
    this.clearBoard()
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

.mycontainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  /*justify-content: center;*/

}

.jogo {
  margin-bottom: 8px;
}

.subone {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
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

#nome {
  margin-top: 8px;
}
</style>