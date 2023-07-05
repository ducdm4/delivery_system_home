import React, { ChangeEvent } from 'react';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import ProfileAddressInfo from '../../../common/components/profile/addressInfo';
import ProfileBasicInfo from '../../../common/components/profile/basicInfo';
import ProfileImageInfo from '../../../common/components/profile/imageInfo';
import { KeyValue } from '../../config/interfaces';

interface Props {
  inputs: KeyValue;
  inputsError: object;
  setInputs: Function;
  isShowProfilePicture: boolean;
}

const UserInfo = ({
  inputs,
  inputsError,
  setInputs,
  isShowProfilePicture,
}: Props) => {
  const keyStringAnyObj: KeyValue = {};

  const handleChangeSelect = (
    val: { id: number; name: string },
    key: string,
  ) => {
    let addressNew = inputs.address;
    const addressToAdd: KeyValue = {};
    const levelKey = ['street', 'ward', 'district', 'city'];
    const levelValue = [0, 1, 2, 4];
    let total = 0;
    let count = 0;
    while (total < levelValue[levelKey.findIndex((x) => x === key)]) {
      addressToAdd[levelKey[count]] = keyStringAnyObj;
      total += levelValue[count];
      count++;
    }
    addressToAdd[key] = val;
    addressNew = {
      ...inputs.address,
      ...addressToAdd,
    };
    return setInputByValue('address', addressNew);
  };

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    if (['building', 'detail'].includes(name)) {
      const oldAddress = inputs.address;
      const newAddress = {
        ...oldAddress,
        [name]: value,
      };
      setInputByValue('address', newAddress);
    } else {
      setInputByValue(name, value);
    }
  }

  function setInputByValue(key: string, val: any) {
    setInputs((values: KeyValue) => {
      return { ...values, [key]: val };
    });
  }

  return (
    <div>
      {isShowProfilePicture && (
        <ProfileImageInfo
          inputs={inputs}
          inputsError={inputsError}
          setInputByValue={setInputByValue}
        />
      )}
      <Divider align="center" className={'!mt-10'}>
        <span className="text-xl font-bold text-green-700">BASIC INFO</span>
      </Divider>
      <ProfileBasicInfo
        inputs={inputs}
        handleChange={handleChange}
        setInputByValue={setInputByValue}
      />
      <Divider align="center" className={'!mt-10'}>
        <span className="text-xl font-bold text-green-700">ADDRESS INFO</span>
      </Divider>
      <ProfileAddressInfo
        inputs={inputs}
        handleChangeSelect={handleChangeSelect}
        handleChange={handleChange}
      />
    </div>
  );
};

export default UserInfo;
