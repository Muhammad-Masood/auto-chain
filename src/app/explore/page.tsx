import GarageData from "../components/GarageData";

const page = async () => {
  return (
    <div className="p-4 space-y-8">
      <p className="text-3xl">Launched Vehicles</p>
      <GarageData isCollection={true} />
    </div>
  );
};

export default page;
