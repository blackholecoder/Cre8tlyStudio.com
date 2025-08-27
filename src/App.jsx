import {
  Footer,
  Features,
  Subscribe,
  Reviews,
  Hero,
  SocialLinks,
  // Merch,
  // Shop,
} from "./sections";
import Nav from "./components/Nav";

const App = () => (
  <main className="relative">
    <div className="scroll-watcher"></div>
    <div className="scroll-watcher-2"></div>

    <Nav />
    <section className=" bg-bioModal ">
      <Hero />
    </section>
    <section id="social" className="bg-bioModal padding">
      <SocialLinks />
    </section>
    <section id="features" className="bg-bioModal padding">
      <Features />
    </section>
    {/* <section id="merch" className="bg-bioModal padding">
      <Merch user={user} setUser={setUser} />
    </section> */}

    {/* <section id="shop" className="bg-bioModal padding">
      <Shop />
    </section> */}

    <section
      id="reviews"
      className="padding-x sm:py-32 py-16 w-full bg-bioModal"
    >
      <Reviews />
    </section>

    {/* <section
      id="subscribe"
      className="p-5 sm:px-8 sm:py-32 py-16 w-full bg-bioModal"
    >
      <Subscribe />
    </section> */}

    <section
      id="contact"
      className="bg-bioModal p-5 sm:px-8 sm:pt-20 sm:pb-8 sm:py-20"
    >
      <Footer />
    </section>
  </main>
);

export default App;
