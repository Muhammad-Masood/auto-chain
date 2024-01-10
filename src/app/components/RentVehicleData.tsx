"use client";
import { rentalABI, rentalContractAddress } from "@/contract/ContractInfo";
import { RentVehicle } from "@/lib/types";
import { useAddress, useContract } from "@thirdweb-dev/react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface RentedVehicle extends RentVehicle {
    image: string;

} 


const RentVehicleData = ({ vehicleURI }: { vehicleURI: string }) => {

  const [rentData, setRentData] = useState<RentVehicle>();
  const [isLoading, setIsLoading] = useState(true);
  const address = useAddress();
  const { contract } = useContract(rentalContractAddress, rentalABI);

  async function fetchRentVehicleData() {
    try {
        const rentDetails: RentVehicle = await contract!.call("carRentalDetails");
        setRentData(rentDetails);
    } catch (error) {}
  }

  useEffect(() => {
    if (contract && address) {
      fetchRentVehicleData();
    }
  }, []);

  return (
    <div>
      <Image
        className="object-cover w-full h-full"
        src={uri}
        width="200"
        height="200"
        alt="vehicle_uri"
      />
      <div>
        <p></p>
        <p></p>
        <p></p>
      </div>
    </div>
  );
};

export default RentVehicleData;
