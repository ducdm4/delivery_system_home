import { KeyValue } from '../../config/interfaces';
import { InputText } from 'primereact/inputtext';
import React, { ChangeEvent } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { parcelWeightList } from '../../config/constant';
import { Button } from 'primereact/button';

interface Props {
  inputData: KeyValue;
  setInputs: Function;
  index: number;
  isHideDelete: boolean;
  errors: KeyValue;
  deleteParcel: Function;
}

function ParcelItem({
  inputData,
  setInputs,
  index,
  deleteParcel,
  isHideDelete,
  errors,
}: Props) {
  function customSetInputs(key: string, value: any) {
    setInputs((old: KeyValue) => {
      const parcels: Array<KeyValue> = [].concat(old.parcels);
      parcels[index][key] = value;
      return {
        ...old,
        parcels,
      };
    });
  }
  function onSelectedImage(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        customSetInputs('imageSelected', reader.result as string);
        customSetInputs('imageFile', file);
      };
    }
  }

  return (
    <>
      <div className={'mt-2'}>
        <span className="p-float-label">
          <InputText
            id="desc"
            value={inputData.description}
            name="description"
            className={'w-full p-inputtext-sm'}
            onChange={(e) => customSetInputs(e.target.name, e.target.value)}
          />
          <label htmlFor="building">Description</label>
        </span>
        <p className={'text-left text-xs mt-1 text-red-300'}>
          {errors?.description}
        </p>
      </div>
      <div className={'flex'}>
        <div className={'basis-5/12 flex flex-col justify-between'}>
          <div className={'mt-8'}>
            <span className="p-float-label">
              <Dropdown
                value={inputData.weight}
                onChange={(e) => customSetInputs(e.target.name, e.target.value)}
                options={parcelWeightList}
                optionLabel="name"
                placeholder=""
                className={'w-full p-inputtext-sm'}
                name="weight"
                id="weight"
              />
              <label htmlFor="city">Weight</label>
            </span>
          </div>
          {!isHideDelete && (
            <Button
              onClick={() => deleteParcel(index)}
              size={'small'}
              severity={'danger'}
              icon="pi pi-trash"
            />
          )}
        </div>
        <div className={'basis-7/12'}>
          <div className="flex flex-col items-end justify-end w-full pt-8">
            <label
              htmlFor={`images-select-${index}`}
              className="drop-container w-40 h-40"
              id="dropcontainer"
            >
              {inputData.imageSelected === '' && (
                <span className="drop-title">Select image</span>
              )}
              <input
                className={'hidden'}
                type="file"
                id={`images-select-${index}`}
                accept="image/*"
                required
                onChange={onSelectedImage}
              />
              {inputData.imageSelected !== '' && (
                <div className={'w-full h-full absolute'}>
                  <img
                    className={'object-contain w-full h-full'}
                    src={inputData.imageSelected}
                  />
                </div>
              )}
            </label>
            <p className={'w-40 text-center text-xs mt-1 text-red-300'}>
              {errors?.image}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ParcelItem;
