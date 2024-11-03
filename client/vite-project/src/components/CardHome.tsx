import CountUp from "react-countup";

type Props = {
  card: {
    title: string;
    total: number;
  };
  loading: boolean;
};

function CardHome({ card, loading }: Props) {
  return (
    <div className="basis-[22%] bg-slate-900 h-40 py-8 px-5 rounded-xl">
      <h1 className="font-semibold text-lg mb-2 text-slate-200">
        {card.title}
      </h1>
      <div className="h-[1px] mb-8 w-full bg-slate-700"></div>
      <div className="flex gap-5 items-center">
        <p className="text-sm text-slate-600 font-bold">Total:</p>{" "}
        <span className="text-yellow-500 font-bold text-4xl">
          {loading ? 0 : <CountUp duration={3} end={card.total} />}
        </span>
      </div>
    </div>
  );
}

export default CardHome;
