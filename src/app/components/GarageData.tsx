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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import {Contract} from "ethers";

export const ipfsToHTTP = (uri: string): string => {
  const ipfsHash: string = uri.replace("ipfs://", "");
  return `https://ipfs.io/ipfs/${ipfsHash}`;
};

const GarageData = ({ isCollection }: { isCollection: boolean }) => {
  const [imagesURIS, setImagesURIS] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { contract } = useContract(rentalContractAddress, rentalABI);

  const router = useRouter();
  const address = useAddress();
  const searchParams = useSearchParams();

  async function fetchTokenIds() {
    try {
      const tokenIds: number[] = await contract!.call("ownedTokenIds", [], {
        from: address,
      });
      console.log("tokens", tokenIds);
      const ownerAddress: string = await contract!.call("owner");
      const imagesURLS: string[] = await Promise.all(
        tokenIds.map(async (id: number) => {
          const tokenURI: string = await contract!.call("tokenURI", [id], {
            from: isCollection ? ownerAddress : address,
          });
          const { image } = JSON.parse(
            await (await fetch(ipfsToHTTP(tokenURI))).text()
          );
          const imageURL: string = ipfsToHTTP(image);
          return imageURL;
        })
      );
      setImagesURIS(imagesURLS);
      setIsLoading(false);
      console.log(imagesURLS);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isCollection && !searchParams.has("mode")) {
      router.push("?mode=collection");
    }
    if (contract && address) {
      fetchTokenIds();
    }
  }, [contract, address]);

  return address ? (
    isLoading ? (
      <Skeleton className="w-[200px] h-[200px]" />
    ) : !isLoading && imagesURIS.length === 0 ? (
      <div className="gap-y-6 flex flex-col">
        <p className="text-3xl">
          {!isCollection
            ? "No Vehicles In The Garage"
            : "No Vehicles Available"}
        </p>
        {!isCollection ? (
          <Link href="/explore">
            <Button>View Collection</Button>
          </Link>
        ) : (
          ""
        )}
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {imagesURIS.map((image: string, index: number) => (
          <Image
            key={index}
            src={image}
            width="200"
            height="200"
            alt="vehicle_nft"
            className="object-cover w-full h-full rounded-2xl shadow hover:shadow-2xl hover:shadow-slate-700 duration-200"
            priority
          />
        ))}
      </div>
    )
  ) : (
    <p>Connect Wallet</p>
  );
};

export default GarageData;
