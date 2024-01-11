import RentVehicleData from "@/app/components/RentVehicleData";

const page = ({params}:{params:{tokenId:number}}) => {
    const {tokenId} = params;
    console.log(tokenId, typeof tokenId);
    return <RentVehicleData vehicleId={tokenId}/>
}

export default page