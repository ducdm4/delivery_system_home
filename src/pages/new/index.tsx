import { NextPage } from 'next';
import { InputText } from 'primereact/inputtext';
import React, { ChangeEvent, useState } from 'react';
import { InputMask } from 'primereact/inputmask';
import { Button } from 'primereact/button';
import AddressPopup from '../../common/components/order/addressPopup';
import { KeyValue } from '../../common/config/interfaces';
import { handleChange, handleChangeAddressProp } from '../../common/functions';

const NewOrderPage: NextPage = () => {
  const keyStringAnyObj: KeyValue = {};

  const initStateAddress: KeyValue = {
    pickupAddress: {
      building: '',
      detail: '',
      lng: null,
      lat: null,
      street: keyStringAnyObj,
      ward: keyStringAnyObj,
      district: keyStringAnyObj,
      city: keyStringAnyObj,
    },
  };

  const [isShowPopupPickup, setIsShowPopupPickup] = useState(false);
  const [inputs, setInputs] = useState(initStateAddress);

  function handleInputChanged(e: ChangeEvent<HTMLInputElement>) {
    handleChange(e, inputs, setInputs, 'pickupAddress');
  }

  const handleSelectAddressChanged = (
    val: { id: number; name: string },
    key: string,
  ) => {
    handleChangeAddressProp(val, key, inputs, setInputs, 'pickupAddress');
  };

  return (
    <>
      <div className={'w-full bg-white mt-4 py-5'}>
        <p className={'text-3xl text-center font-bold text-gray-600'}>
          NEW ORDER
        </p>
        <div
          id="main-order-container"
          className={'grid grid-cols-3 justify-items-center mt-10'}
        >
          <div className={'w-full text-center px-4'}>
            <p className={'text-xl font-semibold text-green-700'}>
              SENDER INFO
            </p>
            <div>
              <div className="pt-8">
                <span className="p-float-label">
                  <InputText
                    className={'p-inputtext-sm w-full'}
                    id="fullname"
                  />
                  <label htmlFor="fullname">Full name</label>
                </span>
                <p className={'text-xs mt-1 text-red-300 text-left '}></p>
              </div>
              <div className="pt-8">
                <span className="p-float-label">
                  <InputText className={'p-inputtext-sm w-full'} id="email" />
                  <label htmlFor="email">Email</label>
                </span>
              </div>
              <div className="pt-8">
                <span className="p-float-label">
                  <InputMask
                    mask="9999-999-999"
                    placeholder="9999-999-999"
                    className={'p-inputtext-sm w-full'}
                    id="senderPhone"
                  />
                  <label htmlFor="senderPhone">Phone</label>
                </span>
              </div>
              <div className="pt-8 text-left flex gap-4 items-center justify-between">
                <div>
                  <label className={'text-gray-500'} htmlFor="senderPhone">
                    Pickup order address:
                  </label>
                  <p>so nha 20 ngo 30 </p>
                </div>
                <Button
                  onClick={() => setIsShowPopupPickup(true)}
                  className={'min-w-[6rem]'}
                  label="Change"
                  size={'small'}
                />
              </div>
            </div>
          </div>
          <div>
            <p className={'text-xl font-semibold text-green-700'}>
              RECEIVER INFO
            </p>
          </div>
          <div>
            <p className={'text-xl font-semibold text-green-700'}>
              PARCEL INFO
            </p>
          </div>
        </div>
      </div>

      <AddressPopup
        isShow={isShowPopupPickup}
        setIsShow={setIsShowPopupPickup}
        inputs={inputs.pickupAddress}
        handleChangeAddressProp={handleSelectAddressChanged}
        handleChange={handleInputChanged}
      />
    </>
  );
};

export default NewOrderPage;
