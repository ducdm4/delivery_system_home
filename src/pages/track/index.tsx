import { NextPage } from 'next';
import { InputNumber } from 'primereact/inputnumber';
import { useEffect, useState } from 'react';
import { trackingOrder } from '../../features/order/orderSlice';
import { useAppDispatch } from '../../common/hooks';
import { KeyValue } from '../../common/config/interfaces';
import { format } from 'date-fns';
import { ORDER_STATUS } from '../../common/config/constant';

const TrackingPage: NextPage = () => {
  const [trackingId, setTrackingId] = useState(null as number | null);
  const [trackingList, setTrackingList] = useState([] as KeyValue[]);
  const dispatch = useAppDispatch();

  async function didClickFindOrder() {
    if (trackingId) {
      const data = trackingId as unknown;
      const res = await dispatch(trackingOrder(data as string)).unwrap();
      if (res.isSuccess) {
        setTrackingList(res.data.trackings);
      }
    }
  }

  const textByStatus = (item: KeyValue) => {
    switch (item.status) {
      case ORDER_STATUS.ORDER_CREATED:
        return 'Delivery has been created';
        break;
      case ORDER_STATUS.COLLECTOR_ON_THE_WAY_TO_STATION:
        return `Your Delivery is on the way to ${item.stationInCharge.name}`;
        break;
      case ORDER_STATUS.WAITING_COLLECTOR_TO_TRANSIT:
        return `Your Delivery arrived ${item.previousStationInCharge.name} and waiting to transit to ${item.stationInCharge.name}`;
        break;
      case ORDER_STATUS.ORDER_READY_TO_SHIP:
        return `Your Delivery arrived ${item.stationInCharge.name} and ready to be shipped`;
        break;
      case ORDER_STATUS.ORDER_ON_THE_WAY_TO_RECEIVER:
        return `Your Delivery will arrive today, please pay attention to your phone.`;
        break;
      case ORDER_STATUS.ORDER_HAS_BEEN_SHIPPED:
        return `Your Delivery has been completed. Thank you!`;
        break;
      default:
        return '';
    }
  };

  return (
    <>
      <div className="bg-gray-50 border p-10 mt-4 flex items-center justify-center">
        <div>
          <span>Unique Tracking ID:</span>
          <InputNumber
            className="mx-4"
            value={trackingId}
            onValueChange={(e) => setTrackingId(e.value as number)}
            useGrouping={false}
          />
          <button
            onClick={() => didClickFindOrder()}
            className="bg-blue-500 text-white px-8 py-3 ml-2 rounded-md shadow-md"
          >
            SEARCH
          </button>
        </div>
      </div>
      {trackingList.length > 0 && (
        <div className="bg-gray-50 border py-10 px-32 mt-4">
          {trackingList.map((item: KeyValue, index) => (
            <div className="w-full grid grid-cols-8 min-h-[60px] border-b">
              <div className="col-span-2 border-r flex items-center justify-center text-gray-500">
                {format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm')}
              </div>
              <div className="col-span-6 ml-8 flex items-center text-lg">
                {textByStatus(item)}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TrackingPage;
