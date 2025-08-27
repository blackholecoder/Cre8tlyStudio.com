
import CustomIcon from "./CustomIcon";

const PerksCard = ({ perk }) => {
  return (
    <div className='flex-1 sm:w-[350px] sm:min-w-[350px] w-full rounded-[20px] shadow-3xl px-10 py-10 bg-pale-blue'>
      <div className='w-11 h-11 flex justify-center items-center bg-phlokkGreen rounded-full'>
        <CustomIcon name={perk.icon}/>
      </div>
      <h3 className='mt-5 font-palanquin text-3xl leading-normal font-bold'>
        {perk.label}
      </h3>
      <p className='mt-3 break-words font-montserrat text-lg leading-normal text-slate-gray'>
        {perk.subtext}
      </p>
    </div>
  );
};

export default PerksCard