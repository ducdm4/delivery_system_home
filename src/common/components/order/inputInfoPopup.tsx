import { Button } from 'primereact/button';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import {
  contactInputRef,
  addressInputRef,
  KeyValue,
} from '../../config/interfaces';
import { InputsContext } from '../../../pages/new';
import ContactPopup from './contactPopup';
import AddressPopup from './addressPopup';
import { Divider } from 'primereact/divider';

interface Props {
  headerText: string;
  isShow: boolean;
  setIsShow: Function;
  setIsShowGetQuote: Function;
  keyInput: string;
}

function InputInfoPopup({
  headerText,
  isShow,
  setIsShow,
  keyInput,
  setIsShowGetQuote,
}: Props) {
  const contactInputRef = useRef<contactInputRef>(null);
  const addressInputRef = useRef<addressInputRef>(null);

  const header = () => {
    const first = headerText.charAt(0).toUpperCase();
    const rest = headerText.slice(1);
    return (
      <p className={'text-gray-500'}>
        <i className="fa-regular fa-user mr-2"></i>
        {`${first}${rest} information`}
      </p>
    );
  };

  function submitInfo() {
    if (contactInputRef.current && addressInputRef.current) {
      const check1 = contactInputRef.current.submitContact();
      const check2 = addressInputRef.current.submitAddress();
      if (check1 && check2) {
        contactInputRef.current.saveData();
        addressInputRef.current.saveData();
        setIsShowGetQuote((old: KeyValue) => {
          return {
            ...old,
            [keyInput]: true,
          };
        });
        setIsShow(false);
      }
    }
  }

  const addressText = () => {
    return keyInput === 'sender' ? 'Pickup' : 'Drop';
  };

  return (
    <>
      <Dialog
        header={header}
        visible={isShow}
        className="w-[98vw] lg:w-[800px] h-[90vh] lg:h-auto"
        onHide={() => setIsShow(false)}
      >
        <ContactPopup
          ref={contactInputRef}
          isShow={isShow}
          keyInput={keyInput}
        />
        <Divider align="left">
          <div className="flex items-center align-items-center">
            <i className="fa-solid fa-location-dot mr-2"></i>
            {`${addressText()} address`}
          </div>
        </Divider>
        <AddressPopup
          ref={addressInputRef}
          isShow={isShow}
          inputsKey={keyInput}
        />
        <div className={'flex mt-4 justify-center'}>
          <Button
            label="Submit"
            onClick={submitInfo}
            severity={'success'}
            size={'small'}
          />
        </div>
      </Dialog>
    </>
  );
}

export default InputInfoPopup;
