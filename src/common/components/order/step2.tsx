import React from 'react';
import { KeyValue } from '../../config/interfaces';

interface Props {
  data: KeyValue;
  isShowStation: boolean;
}

function OrderStep2({ data, isShowStation }: Props) {
  const calculateAddress = () => {
    const address = [];
    if (data.stationPickup?.buildingName) {
      address.push(data.stationPickup.buildingName);
    }
    if (data.stationPickup?.addDetail) {
      address.push(data.stationPickup.addDetail);
    }
    if (data.stationPickup?.streetName) {
      address.push(data.stationPickup.streetName);
    }
    if (data.stationPickup?.wardName) {
      address.push(data.stationPickup.wardName);
    }
    if (data.stationPickup?.districtName) {
      address.push(data.stationPickup.districtName);
    }
    if (data.stationPickup?.cityName) {
      address.push(data.stationPickup.cityName);
    }
    return address.join(', ');
  };
  return (
    <>
      <div className={'my-10 px-20 text-center'}>
        <i className="fa-regular fa-circle-check text-6xl text-green-500"></i>
        <p className="mt-4 text-2xl font-medium">
          Your delivery created successfully!
        </p>
        {!isShowStation && (
          <p className="mt-8 text-xl text-gray-600">
            Your tracking number: <b>{data.orderInfo?.uniqueTrackingId}</b>
          </p>
        )}
        {isShowStation && (
          <p className="mt-8 text-xl text-gray-600">
            Please bring your parcel to
            <b> {data.stationPickup?.stationName} </b>
            at this address
            <b> {calculateAddress()} </b>
            and provide this tracking number:
            <b> {data.orderInfo?.uniqueTrackingId}</b>
          </p>
        )}
        <p className="mt-4 text-2xl font-medium">Thank you!</p>
      </div>
    </>
  );
}

export default OrderStep2;
