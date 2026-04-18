import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import History from "@/components/History";
import Recipes from "@/components/Recipes";
import Testimonials from "@/components/Testimonials";
import Visit from "@/components/Visit";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Recipes />
        <Products />
        <History />
        <Testimonials />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
