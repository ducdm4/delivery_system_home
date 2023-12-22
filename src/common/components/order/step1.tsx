import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { KeyValue } from '../../config/interfaces';
import ParcelItem from './parcelItem';
import React, { useEffect, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
import { useAppSelector, useAppDispatch } from '../../hooks';
import InputInfoPopup from './inputInfoPopup';
import { getQuoteInfo } from '../../../features/order/orderSlice';
import { numberWithCommas, validateImageFile } from '../../functions';
import { usePrevious } from '../../hooks/usePrevious';

interface Props {
  inputs: KeyValue;
  initParcelItem: KeyValue;
  customSetInputs: Function;
  setInputs: Function;
  uploadData: Function;
}

function OrderStepOne({
  inputs,
  initParcelItem,
  customSetInputs,
  setInputs,
  uploadData,
}: Props) {
  const [popupData, setPopupData] = useState({
    headerText: 'sender',
    inputsKey: 'sender',
  });
  const dispatch = useAppDispatch();

  const [isShowPopup, setIsShowPopup] = useState(false);
  const [isShowProcess, setIsShowProcess] = useState(false);
  const [isShowGetQuote, setIsShowGetQuote] = useState({
    receiver: false,
    sender: false,
  });
  const keyStringAnyArr: Array<KeyValue> = [];
  const [errorParcels, setErrorParcels] = useState(keyStringAnyArr);
  const previousParcels = usePrevious(inputs.parcels);

  function computeAddress(a: KeyValue) {
    if (a.detail) {
      return `${a.building} ${a.detail} ${a.street.name + ', '}${
        a.ward.name + ', '
      }${a.district.name + ', '}${a.city.name}`;
    }
    return <span className={'text-sm text-red-700'}>Please select!</span>;
  }

  function addNewParcel() {
    const newParcels: Array<KeyValue> = [].concat(inputs.parcels);
    newParcels.push(initParcelItem);
    setInputs((old: KeyValue) => {
      return {
        ...old,
        parcels: newParcels,
      };
    });
  }

  const computeUserInfo = (key: string) => {
    const name = inputs[`${key}Name`];
    const mail = inputs[`${key}Email`];
    const phone = inputs[`${key}Phone`];
    if (name) {
      return (
        <>
          <p>{`${mail}`}</p>
          <p>{`${name}, ${phone}`}</p>
        </>
      );
    }
    return <span className={'text-sm text-red-700'}>Please select!</span>;
  };

  function prepareShowPopup(key: string) {
    setPopupData({
      headerText: key,
      inputsKey: key,
    });
    setIsShowPopup(true);
  }

  function deleteParcel(index: number) {
    const list = JSON.parse(JSON.stringify(inputs.parcels));
    list.splice(index, 1);
    customSetInputs('parcels', list);
  }

  function calculateQuote() {
    const parcelsList = inputs.parcels.map((parcel: KeyValue) => {
      return {
        weight: parcel.weight.id,
      };
    });
    const dataToSend = {
      parcels: parcelsList,
      pickupAddress: inputs.pickupAddress,
      dropOffAddress: inputs.dropOffAddress,
    };
    const getQuote = dispatch(getQuoteInfo(dataToSend)).unwrap();
    getQuote.then((res) => {
      if (res.isSuccess) {
        customSetInputs('shippingFare', res.data.total);
        setIsShowProcess(true);
      }
    });
  }

  const displayShippingFare = () => {
    return numberWithCommas(inputs.shippingFare);
  };

  function processToNextStep() {
    if (validateParcel()) {
      uploadData();
    }
  }

  function validateParcel() {
    let check = true;
    const errors: Array<KeyValue> = [];
    inputs.parcels.forEach((parcel: KeyValue) => {
      const errorItem = {
        description: '',
        image: '',
      };
      if (!parcel.description) {
        check = false;
        errorItem.description = 'Please tell us what is inside the box';
      }
      if (!parcel.imageSelected) {
        check = false;
        errorItem.image = 'Please take a picture of the parcel';
      } else {
        const checkImage = validateImageFile(parcel.imageFile);
        check = checkImage.check;
        errorItem.image = checkImage.error;
      }
      errors.push(errorItem);
    });
    setErrorParcels(errors);
    return check;
  }

  useEffect(() => {
    setIsShowProcess(false);
  }, [inputs.pickupAddress, inputs.dropOffAddress]);

  useEffect(() => {
    if (previousParcels) {
      if (previousParcels.length !== inputs.parcels.length) {
        setIsShowProcess(false);
      }
    }
  }, [inputs.parcels]);

  return (
    <>
      <div
        id="main-order-container"
        className={
          'lg:grid lg:grid-cols-10 sm:flex sm:flex-col justify-items-center lg:mt-10 mt-5'
        }
      >
        <div className={'w-full text-center px-5 col-span-4'}>
          <p className={'text-xl font-semibold'}>
            <i className="fa-regular text-blue-900 fa-address-card mr-2"></i>{' '}
            SENDER
          </p>
          <div>
            <div className="lg:pt-8 pt-4 text-left flex gap-4 items-start justify-between">
              <div>
                <label className={'text-gray-500'} htmlFor="senderPhone">
                  Sender info:
                </label>
                <div className="text-xl">{computeUserInfo('sender')}</div>
              </div>
              <Button
                onClick={() => prepareShowPopup('sender')}
                size={'small'}
                severity={'secondary'}
                icon="pi pi-pencil"
              />
            </div>
            <div className="pt-5 text-left flex gap-4 items-start justify-between">
              <div>
                <label className={'text-gray-500'} htmlFor="senderPhone">
                  Pickup address:
                </label>
                <p className="text-xl">
                  {computeAddress(inputs.pickupAddress)}
                </p>
              </div>
            </div>
          </div>
          <Divider type="dashed" className={'!my-5'} />
          <div>
            <p className={'text-xl font-semibold '}>
              <i className="fa-solid fa-address-book mr-2 text-blue-900"></i>{' '}
              RECIPIENT
            </p>
            <div>
              <div className="pt-4 lg:pt-8 text-left flex gap-4 items-start justify-between">
                <div>
                  <label className={'text-gray-500'} htmlFor="senderPhone">
                    Recipient info:
                  </label>
                  <div className="text-xl">{computeUserInfo('receiver')}</div>
                </div>
                <Button
                  onClick={() => prepareShowPopup('receiver')}
                  size={'small'}
                  severity={'secondary'}
                  icon="pi pi-pencil"
                />
              </div>
              <div className="pt-5 text-left flex gap-4 items-start justify-between">
                <div>
                  <label className={'text-gray-500'} htmlFor="senderPhone">
                    Drop-off address:
                  </label>
                  <p className="text-xl">
                    {computeAddress(inputs.dropOffAddress)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={'lg:hidden block'}>
          <Divider type="dashed" />
        </div>

        <div className={'w-full text-center px-5 col-span-3'}>
          <p className={'text-xl font-semibold'}>
            <i className="fa-solid fa-box mr-2 text-blue-900"></i> PARCEL
          </p>
          {inputs.parcels.length > 0 && (
            <Accordion className={'lg:pt-8 pt-4'} activeIndex={0}>
              {inputs.parcels.map((item: KeyValue, index: number) => {
                return (
                  <AccordionTab key={index} header={`Parcel #${index + 1}`}>
                    <ParcelItem
                      inputData={item}
                      index={index}
                      setInputs={setInputs}
                      deleteParcel={deleteParcel}
                      errors={errorParcels[index]}
                      isHideDelete={inputs.parcels.length === 1 && index === 0}
                    />
                  </AccordionTab>
                );
              })}
            </Accordion>
          )}
          <div className={'mt-4 text-right'}>
            {inputs.parcels.length < 3 && (
              <Button
                severity={'secondary'}
                icon="pi pi-plus"
                onClick={addNewParcel}
              />
            )}
          </div>
        </div>
        <div className={'lg:hidden block'}>
          <Divider type="dashed" />
        </div>
        <div className={'w-full px-5 col-span-3'}>
          <p className={'text-xl text-center font-semibold'}>
            <i className="fa-solid fa-money-bills text-blue-900"></i> SUMMARY
          </p>
          <div className="pt-4 lg:pt-8">
            <div className={''}>
              <Checkbox
                name="isRecipientPayingFare"
                onChange={(e) =>
                  customSetInputs('isRecipientPayingFare', e.checked)
                }
                checked={inputs.isRecipientPayingFare}
              />
              <label htmlFor="isRecipientPayingFare" className="ml-2 text-sm">
                Recipient will pay shipping fee
              </label>
            </div>
            <div className={'mt-4'}>
              <Checkbox
                name="isTakeParcelMySelf"
                onChange={(e) =>
                  customSetInputs('isTakeParcelMySelf', e.checked)
                }
                checked={inputs.isTakeParcelMySelf}
              />
              <label htmlFor="isTakeParcelMySelf" className="ml-2 text-sm">
                I'd like to take parcel to station by my self (faster delivery)
              </label>
            </div>
            <div className={'pt-8'}>
              <span className="p-float-label">
                <InputNumber
                  className={'p-inputtext-sm w-full'}
                  id="cashOnDelivery"
                  value={inputs.cashOnDelivery}
                  name="cashOnDelivery"
                  onValueChange={(e) =>
                    customSetInputs(e.target.name, e.target.value)
                  }
                  min={0}
                  max={10000000}
                />
                <label htmlFor="cashOnDelivery">
                  Cash on delivery (&#8363;)
                </label>
              </span>
            </div>
            <div className={'flex justify-between text-xl mt-4'}>
              <span className={'font-bold'}>Shipping fee:</span>
              <span>{displayShippingFare()}&#8363;</span>
            </div>
            <div className={'text-right mt-10'}>
              {isShowGetQuote.sender && isShowGetQuote.receiver && (
                <Button
                  severity={'info'}
                  label={'Get quote'}
                  onClick={() => calculateQuote()}
                />
              )}
              {isShowProcess && (
                <Button
                  onClick={() => processToNextStep()}
                  className={'!ml-4'}
                  severity={'success'}
                  label={'Process'}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <InputInfoPopup
        setIsShowGetQuote={setIsShowGetQuote}
        headerText={popupData.headerText}
        isShow={isShowPopup}
        setIsShow={setIsShowPopup}
        keyInput={popupData.inputsKey}
      />
    </>
  );
}

export default OrderStepOne;
