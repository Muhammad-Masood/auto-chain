"use client";
import { Button } from "@/components/ui/button";
import { rentalABI, rentalContractAddress } from "@/contract/ContractInfo";
import { ListVehicle } from "@/lib/types";
import { TransactionError, useAddress, useContract } from "@thirdweb-dev/react";
import { ethers, utils } from "ethers";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// interface RentedVehicle extends RentVehicle {
//     image: string;
//     tokenId: number;
// }

const RentVehicleData = ({ vehicleId }: { vehicleId: number }) => {
  const [rentData, setRentData] = useState<ListVehicle>();
  const [isLoading, setIsLoading] = useState(true);
  const imageURL: string = useSearchParams().get("uri") || "";
  const address = useAddress();
  const { contract } = useContract(rentalContractAddress, rentalABI);

  async function rentVehicle() {
    try {
      toast.loading("Waiting for transaction confirmation...");
      const _value = utils.parseEther(rentData!.price.toString());
      const data = await contract!.call("rent", [vehicleId], {
        from: address,
        value: _value,
      });
      toast.dismiss();
      toast.success("Vehicle rented successfully!");
      console.log(data);
    } catch (error) {
      toast.dismiss();
      toast.error((error as TransactionError).reason);
      console.log(error);
    }
  }

  async function fetchRentVehicleData() {
    try {
      const rentDataResponse = await contract!.call("carRentalDetails", [
        vehicleId,
      ]);
      const rentalData: ListVehicle = {
        dateFrom: rentDataResponse.durationFrom.toString(),
        dateTill: rentDataResponse.durationTill.toString(),
        price: Number(utils.formatEther(rentDataResponse.price)),
        terms: rentDataResponse.terms,
      };
      console.log(rentalData);
      setRentData(rentalData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (contract && address) {
      fetchRentVehicleData();
    }
  }, [contract, address]);

  const formatTimestampToDateString = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  return rentData ? (
    <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 p-4 space-x-12 space-y-4">
      <Image
        className="object-cover w-full h-full"
        src={imageURL}
        width="500"
        height="500"
        alt="vehicle_uri"
      />
      <div className="lg:order-1 md:order-2 flex flex-col gap-y-8">
        <div className="flex lg:gap-x-10 md:gap-x-10 gap-x-7">
          <p>{formatTimestampToDateString(rentData.dateFrom)}</p>
          <p className="">TO</p>
          <p>{formatTimestampToDateString(rentData.dateTill)}</p>
        </div>
        <p className="text-lg">BNB {rentData.price}</p>
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={rentVehicle}
        >
          Rent Now
        </Button>
        <p className="text-sm">Terms: {rentData.terms}</p>
      </div>
    </div>
  ) : (
    <p className="mt-8 text-center text-xl">Rent Data Loading...</p>
  );
};

export default RentVehicleData;
