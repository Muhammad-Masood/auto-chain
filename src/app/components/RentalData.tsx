"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { rentalABI, rentalContractAddress } from "@/contract/ContractInfo";
import {
  ContractEvent,
  SmartContract,
  useAddress,
  useContract,
  useContractEvents,
} from "@thirdweb-dev/react";
import { BaseContract, ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ListedVehicle {
  imageURL: string;
  tokenId: number;
}

const RentalData = () => {
  const [listedVehicles, setListedVehicles] = useState<ListedVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { contract } = useContract(rentalContractAddress, rentalABI);

  const address = useAddress();

  const ipfsToHTTP = (uri: string): string => {
    const ipfsHash: string = uri.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  };

  async function fetchAndSetRentedVehiclesData() {
    try {
      const totalSupply: number = await contract!.call("getTotalSupply", []);
      const activeListingsTokenIds: (number | undefined)[] = await Promise.all(
        Array(totalSupply).map(async (tokenId: number) => {
          const isActiveListing: number = await contract!.call("rentStatus", [
            tokenId-1,
          ]);
          return isActiveListing === 1 ? tokenId-1 : undefined;
        })
      );
      const filteredActiveListingsTokenIds: number[] =
        activeListingsTokenIds.filter(
          (tokenId: number | undefined): tokenId is number =>
            tokenId !== undefined
        );
        console.log(filteredActiveListingsTokenIds);
      if (filteredActiveListingsTokenIds.length > 0) {
        const listedVehiclesData: ListedVehicle[] = await Promise.all(
          filteredActiveListingsTokenIds.map(async (id: number) => {
            const tokenURI: string = await contract!.call("tokenURI", [id], {
              from: address,
            });
            const { image } = JSON.parse(
              await (await fetch(ipfsToHTTP(tokenURI))).text()
            );
            const imageURL: string = ipfsToHTTP(image);
            return { imageURL, tokenId: id };
          })
        );
        setListedVehicles(listedVehiclesData);
        console.log("listed_vehicles", listedVehiclesData, isLoading);
      }
      setIsLoading(false);
      console.log(listedVehicles, listedVehicles.length);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (contract && address) {
      fetchAndSetRentedVehiclesData();
    }
    console.log("consdns",contract,address);
  }, [contract, address]);

  return address ? (
    isLoading ? (
      <Skeleton className="w-[200px] h-[200px]" />
    ) : !isLoading && listedVehicles.length === 0 ? (
      <div className="gap-y-6 flex flex-col">
        <p className="text-3xl">No Vehicles For Rent</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {listedVehicles.map((vehicle: ListedVehicle, index: number) => (
          <Link href={`/rent/${vehicle.tokenId}?uri=${vehicle.imageURL}`} key={vehicle.tokenId}>
            <Image
              key={index}
              src={vehicle.imageURL}
              width="200"
              height="200"
              alt="vehicle_nft"
              className="object-cover w-full h-full rounded-2xl shadow hover:shadow-2xl hover:shadow-slate-700 duration-200 cursor-pointer"
              priority
            />
          </Link>
        ))}
      </div>
    )
  ) : (
    <p>Connect Wallet</p>
  );
};

export default RentalData;
