import Hero from '../Home/Hero';
import Categoria from '../Home/Categoria';
import Newsletter from '../Home/Newsletter';
import FeaturedProducts from '../Home/Featureproducts';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categoria />
      <FeaturedProducts />
      <Newsletter />
      <Footer />
    </>
  );
}
