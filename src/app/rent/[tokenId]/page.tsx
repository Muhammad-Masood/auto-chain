import RentVehicleData from "@/app/components/RentVehicleData";

const page = ({params}:{params:{tokenId:string}}) => {
    const {tokenId} = params;
    return <RentVehicleData vehicleId={Number(tokenId)}/>
}

export default page