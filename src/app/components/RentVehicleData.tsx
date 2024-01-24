"use client";
import { Button } from "@/components/ui/button";
import { rentalABI, rentalContractAddress } from "@/contract/ContractInfo";
import { mintFormSchema } from "@/lib/schema";
import { ListVehicle } from "@/lib/types";
import { TransactionError, useAddress, useContract } from "@thirdweb-dev/react";
import { ethers, utils } from "ethers";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ipfsToHTTP } from "./GarageData";
import { ScrollArea } from "@/components/ui/scroll-area";

// interface RentedVehicle extends RentVehicle {
//     image: string;
//     tokenId: number;
// }

const RentVehicleData = ({ vehicleId }: { vehicleId: number }) => {
  const [rentData, setRentData] = useState<ListVehicle>();
  // const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState<typeof mintFormSchema.shape>();
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
      const tokenURI: string = await contract!.call("tokenURI", [vehicleId]);
      const vehicleData: typeof mintFormSchema.shape = JSON.parse(
        await (await fetch(ipfsToHTTP(tokenURI))).text()
      );
      setMetadata(vehicleData);
      console.log(vehicleData);
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
        {metadata && (
          <ScrollArea className="h-72 w-full rounded-md border">
            <pre className="w-full h-full p-4 overflow-auto text-wrap">{JSON.stringify({ ...metadata, image: undefined }, null, 2)}</pre>
          </ScrollArea>
        )}
      </div>
    </div>
  ) : (
    <p className="mt-8 text-center text-xl">Preparing data...</p>
  );
};

export default RentVehicleData;
