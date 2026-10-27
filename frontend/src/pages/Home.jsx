
import React, { useState } from 'react'
import Header from '../components/Header'
import Menu from '../components/Menu'
import FoodDisplay from '../components/FoodDisplay'
import AiRecommended from '../components/AiRecommended'

const Home = () => {
  const [category, setCategory] = useState('All')

  return (
    <main className="mx-auto min-h-screen w-[90%] max-w-[1400px] py-6 sm:py-8">
      <Header />
      <AiRecommended/>
      <section id="menu" className="mt-10 scroll-mt-24 sm:mt-14">
        <Menu category={category} setCategory={setCategory} />
      </section>

      <section className="mt-8">
        <FoodDisplay category={category} />
      </section>
    </main>
  )
}

export default Home
