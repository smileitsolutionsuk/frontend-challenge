<script setup lang="ts">
import { confetti } from '@tsparticles/confetti'
import { gsap } from 'gsap'
import { onMounted, ref } from 'vue'

const symbols = ['🍒', '🍋', '🍊', '🍉'] as const
const symbolWinCredits = {
  '🍒': 10,
  '🍋': 20,
  '🍊': 30,
  '🍉': 40,
} satisfies Record<(typeof symbols)[number], number>
const numberOfSlots = 3
const /** slot height in `rem`s */ SHR = 8

const getShuffledSymbols = () =>
  symbols
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
const slotSymbols = ref([...Array(numberOfSlots)].map(getShuffledSymbols))
// const slotSymbols = ref([
//   ['🍒', '🍋', '🍊', '🍉'],
//   ['🍒', '🍋', '🍊', '🍉'],
//   ['🍒', '🍋', '🍊', '🍉'],
// ])
const getRandomSlotIndex = () => (Math.random() * symbols.length) | 0
const slotCurrentIndexes = ref([...Array(numberOfSlots)].map(getRandomSlotIndex))
// const slotCurrentIndexes = ref([0, 0, 0])
const slotColumnRefs = ref<HTMLDivElement[]>([])
const credits = ref(10)
const cashedOutCredits = ref(0)
const isSpinning = ref(false)
const cashOutBtnUnClickable = ref(false)
const cashOutBtnMoveDirection = ref([0, 0])
const cashOutDialog = ref<HTMLDialogElement>()
const noCreditDialog = ref<HTMLDialogElement>()

//* initial slot symbols displacement
onMounted(() => {
  for (let i = 0; i < numberOfSlots; i++)
    gsap.set(slotColumnRefs.value[i].children, { y: (nthSlot) => `${(nthSlot + 1) * SHR}rem` })
})

function spin() {
  if (credits.value <= 0) return

  credits.value -= 1

  slotCurrentIndexes.value = [...Array(numberOfSlots)].map(getRandomSlotIndex)

  const rerollProbability =
    credits.value < 60 && credits.value > 40 ? 0.4 : credits.value > 60 ? 0.6 : 0
  const shouldReroll = Math.random() < rerollProbability

  if (isJackpot() && shouldReroll)
    slotCurrentIndexes.value = [...Array(numberOfSlots)].map(getRandomSlotIndex)

  // slotCurrentIndexes.value = [1, 1, 1]

  animateSpin()
}

const isJackpot = () => {
  // Get the symbols at the specified indexes for each slot
  const symbolsAtIndexes = slotCurrentIndexes.value.map(
    (slotIndex, index) => slotSymbols.value[index][slotIndex]
  )

  // Check if all symbols are the same by comparing the first symbol with the rest
  return symbolsAtIndexes.every((symbol) => symbol === symbolsAtIndexes[0])
}

function animateSpin() {
  isSpinning.value = true

  for (let slotIndex = 0; slotIndex < numberOfSlots; slotIndex++)
    gsap.to(slotColumnRefs.value[slotIndex].children, {
      y: (symbolIndex) => {
        const initialDisplacement = (symbolIndex + 1) * SHR
        const newIndexDisplacement = -slotCurrentIndexes.value[slotIndex] * SHR
        const additionalTurns = symbols.length * SHR * 10
        const totalDisplacement = initialDisplacement + newIndexDisplacement + additionalTurns
        return `${totalDisplacement}rem`
      },
      duration: 2 + ((slotIndex + 1) / numberOfSlots) * 3, // staggered slot animations
      ease: 'power1.out',
      modifiers: {
        y: gsap.utils.unitize((y) => parseFloat(y) % (SHR * symbols.length)), // infinite loop
      },
      onComplete: () => {
        // if last slot finished animating
        if (slotIndex + 1 === numberOfSlots) {
          isSpinning.value = false
          checkWin()
        }
      },
    })
}

function checkWin() {
  const won = isJackpot()
  if (!won && credits.value <= 0) noCreditDialog.value.showModal()
  if (!won) return

  confetti({})

  credits.value += getWinAmount()
}

function getWinAmount() {
  const jackpotSymbol = slotSymbols.value[0][slotCurrentIndexes.value[0]] // value of the 1st slot
  const winAmount = symbolWinCredits[jackpotSymbol]

  return winAmount
}

const cashOutHandler = () => {
  if (credits.value <= 0) return
  cashedOutCredits.value += credits.value
  credits.value = 0
  cashOutDialog.value.showModal()
}

function getRandomMovement() {
  const d = 300
  const angle = Math.random() * 2 * Math.PI
  const dHorizontal = d * Math.cos(angle)
  const dVertical = d * Math.sin(angle)
  return [dHorizontal, dVertical]
}

const cashOutPointerEnterHandler = () => {
  if (Math.random() < 0.5) cashOutBtnMoveDirection.value = getRandomMovement()
  if (Math.random() < 0.4) cashOutBtnUnClickable.value = true
}

const cashOutPointerLeaveHandler = () => {
  cashOutBtnUnClickable.value = false

  //TODO: debounce this
  setTimeout(() => {
    cashOutBtnMoveDirection.value = [0, 0]
  }, 5000)
}

function spinWrapperClickHandler() {
  if (!isSpinning.value && credits.value <= 0) noCreditDialog.value.showModal()
}
</script>

<template>
  <div
    class="flex items-center justify-center w-screen overflow-hidden size-full h-dvh bg-stone-900"
  >
    <div class="flex flex-col items-center gap-3 p-10 shadow rounded-3xl bg-stone-500">
      <span
        class="inline-block font-black text-transparent text-9xl bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text drop-shadow-md"
        >JACKPOT</span
      >
      <span class="text-5xl">Credits: {{ credits }}</span>
      <div class="flex w-full gap-1 mb-2 overflow-hidden" :style="{ height: `${SHR}rem` }">
        <div
          v-for="(symbolArray, symbolArrayIndex) in slotSymbols"
          :key="symbolArrayIndex"
          ref="slotColumnRefs"
          class="relative flex flex-col w-full"
          :style="{ transform: `translateY(-${SHR}rem)` }"
        >
          <div
            v-for="(symbol, symbolIndex) in symbolArray"
            :key="symbolIndex"
            class="absolute grid w-full leading-none place-items-center drop-shadow-md"
            :style="{ height: `${SHR}rem`, fontSize: `${SHR - 0.5}rem` }"
          >
            {{ symbol }}
          </div>
        </div>
      </div>

      <div id="spin-btn" class="w-full" @click="spinWrapperClickHandler">
        <button
          className=" text-white text-6xl relative p-1 w-full inline-flex items-center justify-center overflow-hidden group rounded-md hover:tracking-widest ease-in-out font-bold hover:font-black disabled:contrast-50 disabled:pointer-events-none drop-shadow-md"
          :disabled="isSpinning || credits <= 0"
          @click="spin"
        >
          <span
            className="rounded-2xl w-full h-full bg-gradient-to-br from-[#1f4] to-[#af9] group-hover:from-[#af9] group-hover:to-[#1f4] absolute"
          />
          <span
            className="relative rounded-xl w-full px-6 py-3 transition-all ease-out bg-gray-900 group-hover:bg-opacity-0 duration-400"
          >
            SPIN
          </span>
        </button>
      </div>
      <button
        class="w-full px-16 py-4 text-6xl font-bold text-white transition-all duration-200 ease-in-out bg-rose-700 rounded-2xl hover:bg-rose-800 disabled:contrast-50 hover:enabled:font-black hover:enabled:tracking-widest drop-shadow-md disabled:pointer-events-none"
        :style="{
          transform: `translate3d(${cashOutBtnMoveDirection.map((i) => i + 'px').join(', ')}, 0)`,
        }"
        :disabled="credits <= 0 || cashOutBtnUnClickable"
        @click="cashOutHandler"
        @pointerenter="cashOutPointerEnterHandler"
        @pointerleave="cashOutPointerLeaveHandler"
      >
        CASH OUT
      </button>
    </div>
  </div>

  <dialog ref="cashOutDialog" class="p-6 backdrop:bg-black/25 rounded-2xl min-w-96">
    <span class="mb-5 text-4xl font-bold">Cash Out</span>

    <p class="mb-4">The total amount of credits withdrawn is {{ cashedOutCredits }}.</p>

    <button
      class="px-10 py-1 text-xl font-bold text-white transition-all duration-200 ease-in-out bg-rose-700 rounded-xl hover:bg-rose-800 disabled:contrast-50 hover:enabled:font-black hover:enabled:tracking-widest"
      @click="cashOutDialog.close"
    >
      OK
    </button>
  </dialog>

  <dialog ref="noCreditDialog" class="p-6 backdrop:bg-black/25 rounded-2xl min-w-96">
    <span class="mb-5 text-4xl font-bold">You are broke</span>

    <p class="mb-4">but at least you have a nice personality</p>

    <button
      class="px-10 py-1 text-xl font-bold text-white transition-all duration-200 ease-in-out bg-rose-700 rounded-xl hover:bg-rose-800 disabled:contrast-50 hover:enabled:font-black hover:enabled:tracking-widest"
      @click="noCreditDialog.close"
    >
      Ok, I'll go cry
    </button>
  </dialog>
</template>

<!-- 
  * good luck getting a jackpot!
-->

<!-- 
  ? my thoughts:
 
  im honestly offended by the amount of great DX that there is in the vue eco system and is lacking in the react world
  my experience reuniting with vue was delightful
  thanks for the journey
-->
