import { Contract, ethers } from "ethers";
import GarageData from "../components/GarageData";
import { rentalABI, rentalContractAddress } from "@/contract/ContractInfo";
import { SDKOptionsSchema, ThirdwebSDK, getSignerAndProvider } from "@thirdweb-dev/sdk";

const page = async () => {
  return (
    <div className="p-4 space-y-8">
      <p className="text-3xl">Your Garage</p>
      <GarageData isCollection={false}/>
    </div>
  );
};

export default page;
