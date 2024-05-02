// import { useState } from 'react'
import { Header, HomePage } from './components'
import './index.css'

function App() {

  return(
    <div className="flex flex-col p-4 max-4-[1000px]">
      <section className="min-h-screen flex flex-col">
        <Header />
        <HomePage />
        <main className="flex-1 p-4 flex flex-col justify-center">Sollunga.....</main>
      </section>
      <footer className=""></footer>
    </div>
  )
}

export default App
