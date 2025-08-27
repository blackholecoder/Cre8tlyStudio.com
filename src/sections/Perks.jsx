import { perks } from "../constants";
import { PerksCard } from "../sections";

const Perks = () => {
    return (
      <section className='max-container flex justify-center flex-wrap gap-9'>
        {perks.map((perk) => (
          <PerksCard key={perk.label} perk={perk} />
        ))}
      </section>
    );
  };

export default Perks;