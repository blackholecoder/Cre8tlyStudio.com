import {
  Footer,
  Landing
} from "./sections";
import Nav from "./components/Nav";

const App = () => (
  <main className="relative">

    <Nav />
    <section id="landing" className="padding">
      <Landing />
    </section>

    <section
      id="contact"
      className="bg-bioModal p-5 sm:px-8 sm:pt-20 sm:pb-8 sm:py-20"
    >
      <Footer />
    </section>
  </main>
);

export default App;
