import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Catalogo from "@/components/Catalogo";
import Products from "@/components/Products";
import History from "@/components/History";
import Recipes from "@/components/Recipes";
import Testimonials from "@/components/Testimonials";
import Visit from "@/components/Visit";
import Footer from "@/components/Footer";
import site from "@/content/site.json";

export default function Home() {
  // El catálogo anterior — las cuatro tarjetas con foto y precio — se apaga
  // desde el panel en vez de borrarse: al cliente le gusta y quiere poder
  // recuperarlo. Vive como "Productos relevantes".
  const relevantes = (site as { secciones?: { productosRelevantes?: boolean } })
    .secciones?.productosRelevantes ?? false;

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Recipes />
        <Catalogo />
        {relevantes && <Products />}
        <History />
        <Testimonials />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
