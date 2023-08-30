import { NextPage } from 'next';
import React, { createContext, useState } from 'react';
import { KeyValue } from '../../common/config/interfaces';
import OrderStepOne from '../../common/components/order/step1';
import OrderStep2 from '../../common/components/order/step2';
import { useAppDispatch } from '../../common/hooks';
import { createNewPhoto } from '../../features/photo/photoSlice';
import { createNewOrder } from '../../features/order/orderSlice';
import { toast } from 'react-toastify';

const keyStringAnyObj: KeyValue = {};
export const InputsContext = createContext(keyStringAnyObj);
const NewOrderPage: NextPage = () => {
  const initParcelItem: KeyValue = {
    description: '',
    photo: keyStringAnyObj,
    weight: {
      id: 0,
      name: '< 1kg',
    },
    imageSelected: '',
    imageFile: null,
  };
  const initAddressState: KeyValue = {
    building: '',
    detail: '',
    lng: null,
    lat: null,
    street: keyStringAnyObj,
    ward: keyStringAnyObj,
    district: keyStringAnyObj,
    city: keyStringAnyObj,
  };

  const initState: KeyValue = {
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    receiverName: '',
    receiverPhone: '',
    receiverEmail: '',
    cashOnDelivery: 0,
    shippingFare: 0,
    isRecipientPayingFare: false,
    isTakeParcelMySelf: false,
    parcels: [initParcelItem],
    dropOffAddress: initAddressState,
    pickupAddress: initAddressState,
  };

  const [inputs, setInputs] = useState(initState);
  const [stationPickupData, setStationPickupData] = useState(keyStringAnyObj);
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useAppDispatch();

  function customSetInputs(key: string, value: any) {
    setInputs((old: KeyValue) => {
      return {
        ...old,
        [key]: value,
      };
    });
  }

  async function uploadData() {
    const parcels = [];
    for (let i = 0; i < inputs.parcels.length; i++) {
      const imageRes = await handleUploadImage(inputs.parcels[i].imageFile);
      if (imageRes.isSuccess) {
        parcels.push({
          description: inputs.parcels[i].description,
          photo: { id: imageRes.data.photoInfo.id },
          weight: inputs.parcels[i].weight.id,
        });
      }
    }
    const dataToUpload = {
      ...inputs,
      senderPhone: inputs.senderPhone.replaceAll('-', ''),
      receiverPhone: inputs.receiverPhone.replaceAll('-', ''),
      parcels,
    };
    const createOrderRes = await dispatch(
      createNewOrder(dataToUpload),
    ).unwrap();
    if (createOrderRes.isSuccess) {
      setStationPickupData(createOrderRes.data);
      setActiveIndex(1);
      toast('Create delivery successfully!', {
        hideProgressBar: true,
        autoClose: 2000,
        type: 'success',
      });
    }
  }

  async function handleUploadImage(image: File) {
    const formData = new FormData();
    formData.append('image', image as Blob);
    return await dispatch(createNewPhoto(formData)).unwrap();
  }

  return (
    <>
      <InputsContext.Provider value={{ inputs, customSetInputs }}>
        <div className={'w-full bg-white mt-4 py-5 shadow-md'}>
          <div
            className={
              'text-2xl font-bold text-gray-600 px-4 flex items-center gap-2'
            }
          >
            <img width="30px" height="30px" src={'./icons/man-carrying.png'} />
            <span>NEW DELIVERY</span>
          </div>
          {activeIndex === 0 && (
            <OrderStepOne
              initParcelItem={initParcelItem}
              inputs={inputs}
              customSetInputs={customSetInputs}
              setInputs={setInputs}
              uploadData={uploadData}
            />
          )}
          {activeIndex === 1 && (
            <OrderStep2
              isShowStation={inputs.isTakeParcelMySelf}
              data={stationPickupData}
            />
          )}
        </div>
      </InputsContext.Provider>
    </>
  );
};

export default NewOrderPage;
