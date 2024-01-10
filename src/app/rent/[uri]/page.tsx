import RentVehicleData from "@/app/components/RentVehicleData";

const page = ({params}:{params:{uri:string}}) => {
    const {uri} = params;
    console.log(uri);
    return <RentVehicleData vehicleURI={params.uri}/>
}

export default page