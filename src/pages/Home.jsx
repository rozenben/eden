import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Gallery from '../components/Gallery'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import useStore from '../store/useStore'

const Home = () => {
  const { fetchSiteContent } = useStore()

  useEffect(() => {
    fetchSiteContent()
  }, [fetchSiteContent])

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main>
        <Hero />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default Home
