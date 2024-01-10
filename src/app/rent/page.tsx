import React from "react";
import RentalData from "../components/RentalData";

const page = () => {
  return (
    <div className="p-4 space-y-8">
      <p className="text-3xl">Vehicles For Rent</p>
      <RentalData />
    </div>
  );
};

export default page;
