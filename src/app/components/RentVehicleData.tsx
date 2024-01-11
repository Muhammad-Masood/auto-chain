"use client";
import { Button } from "@/components/ui/button";
import { rentalABI, rentalContractAddress } from "@/contract/ContractInfo";
import { RentVehicle } from "@/lib/types";
import { useAddress, useContract } from "@thirdweb-dev/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// interface RentedVehicle extends RentVehicle {
//     image: string;
//     tokenId: number;
// }

const RentVehicleData = ({ vehicleId }: { vehicleId: number }) => {
  const [rentData, setRentData] = useState<RentVehicle>();
  const [isLoading, setIsLoading] = useState(true);
  const imageURL: string = useSearchParams().get("image") || "";
  const address = useAddress();
  const { contract } = useContract(rentalContractAddress, rentalABI);

  async function rentVehicle() {
    toast.loading("Waiting for transaction confirmation...");
    const data = await contract!.call("rent", [vehicleId], {
      from: address
    });
    toast.dismiss();
    toast.success("Vehicle rented successfully!");
    console.log(data);
  }

  async function fetchRentVehicleData() {
    try {
      const rentDetails: RentVehicle = await contract!.call(
        "carRentalDetails",
        [vehicleId]
      );
      setRentData(rentDetails);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (contract && address) {
      fetchRentVehicleData();
    }
  }, []);

  return rentData ? (
    <div>
      <Image
        className="object-cover w-full h-full"
        src={imageURL}
        width="200"
        height="200"
        alt="vehicle_uri"
      />
      <div>
        <p>{rentData.dateFrom}</p>
        <p>{rentData.dateTill}</p>
        <p>{rentData.price}</p>
        <p>{rentData.terms}</p>
      </div>
      <Button onClick={() => rentVehicle()}>Rent</Button>
    </div>
  ) : (
    <p>Rent Data Loading...</p>
  );
};

export default RentVehicleData;
