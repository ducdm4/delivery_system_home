import React, {
  ChangeEvent,
  forwardRef,
  Ref,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { addressInputRef, KeyValue } from '../../config/interfaces';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  cityListState,
  getCityListFilter,
} from '../../../features/city/citySlice';
import {
  districtList,
  getDistrictListFilter,
} from '../../../features/district/districtSlice';
import {
  currentWardList,
  getWardListFilter,
} from '../../../features/ward/wardSlice';
import {
  getStreetListFilter,
  streetListStore,
} from '../../../features/street/streetSlice';
import { handleChangeAddressProp, validateAddress } from '../../functions';
import { InputsContext } from '../../../pages/new';

interface Props {
  isShow: boolean;
  inputsKey: string;
}

interface CityDistrictWardItem {
  id: number;
  name: string;
  cityId?: number;
  districtId?: number;
  wardId?: number;
}

const AddressPopup = forwardRef(
  ({ inputsKey, isShow }: Props, ref: Ref<addressInputRef>) => {
    useImperativeHandle(ref, () => ({ submitAddress, saveData }));

    const context = useContext(InputsContext);
    const dispatch = useAppDispatch();
    const initialCityDistrictList: Array<CityDistrictWardItem> = [];
    const keyStringAnyObj: KeyValue = {};

    const cityListStore = useAppSelector(cityListState);
    const districtListStore = useAppSelector(districtList);
    const streetList = useAppSelector(streetListStore);
    const wardList = useAppSelector(currentWardList);

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
    const [selfInputs, setSelfInputs] = useState(initAddressState);
    const initError: KeyValue = {
      building: '',
      detail: '',
      street: '',
      ward: '',
      district: '',
      city: '',
    };
    const [errors, setErrors] = useState(initError);

    useEffect(() => {
      const promises = [];
      if (!cityListStore.length) {
        const getCity = dispatch(getCityListFilter({ query: '' })).unwrap();
        getCity.then();
      }
      if (!districtListStore.length) {
        const getDistrict = dispatch(
          getDistrictListFilter({ query: '' }),
        ).unwrap();
        getDistrict.then();
      }
      if (!streetList.length) {
        const getStreet = dispatch(getStreetListFilter({ query: '' })).unwrap();
        getStreet.then();
      }
      if (!wardList.length) {
        const getWard = dispatch(getWardListFilter({ query: '' })).unwrap();
        getWard.then();
      }
    }, []);

    useEffect(() => {
      const key = inputsKey === 'sender' ? 'pickupAddress' : 'dropOffAddress';
      const initData = context.inputs[key];
      setSelfInputs(initData);
    }, [isShow]);

    const handleSelectAddressChanged = (
      val: { id: number; name: string },
      key: string,
    ) => {
      handleChangeAddressProp(val, key, selfInputs, setSelfInputs);
    };

    const districtListFiltered = () => {
      return districtListStore.filter((item) => {
        return item.cityId === selfInputs.city.id;
      });
    };

    const wardListFiltered = () => {
      return wardList.filter((item) => {
        return item.districtId === selfInputs.district.id;
      });
    };

    const streetListFiltered = () => {
      return streetList.filter((item) => {
        return item.wardId === selfInputs.ward.id;
      });
    };

    function handleChangeText(e: ChangeEvent<HTMLInputElement>) {
      const name = e.target.name;
      const value = e.target.value;
      setSelfInputs((values) => {
        return {
          ...values,
          [name]: value,
        };
      });
    }

    function submitAddress() {
      const errorCheck = validateAddress(selfInputs);
      setErrors(errorCheck);
      if (Object.keys(errorCheck).length) {
        return false;
      }
      return true;
    }

    function saveData() {
      const key = inputsKey === 'sender' ? 'pickupAddress' : 'dropOffAddress';
      context.customSetInputs(key, selfInputs);
    }

    return (
      <>
        <div className="grid-cols-1 grid lg:grid-cols-2 gap-8 mt-8">
          <div className="grid-cols-1 grid gap-8">
            <div>
              <span className="p-float-label">
                <Dropdown
                  value={selfInputs.city}
                  onChange={(e) => handleSelectAddressChanged(e.value, 'city')}
                  options={cityListStore}
                  filter
                  optionLabel="name"
                  placeholder="Select a City"
                  className={'w-full p-inputtext-sm'}
                  name="city"
                  id="city"
                />
                <label htmlFor="city">City</label>
              </span>
              <p className={'text-xs mt-1 text-red-300'}>{errors.city}</p>
            </div>
            <div>
              <span className="p-float-label">
                <Dropdown
                  value={selfInputs.district}
                  onChange={(e) =>
                    handleSelectAddressChanged(e.value, 'district')
                  }
                  options={districtListFiltered()}
                  filter
                  optionLabel="name"
                  placeholder="Select a District"
                  className={'w-full p-inputtext-sm'}
                  name="city"
                  id="city"
                />
                <label htmlFor="city">District</label>
              </span>
              <p className={'text-xs mt-1 text-red-300'}>{errors.district}</p>
            </div>
            <div>
              <span className="p-float-label">
                <Dropdown
                  value={selfInputs.ward}
                  onChange={(e) => handleSelectAddressChanged(e.value, 'ward')}
                  options={wardListFiltered()}
                  filter
                  optionLabel="name"
                  placeholder="Select a Ward"
                  className={'w-full p-inputtext-sm'}
                  name="ward"
                  id="ward"
                />
                <label htmlFor="ward">Ward</label>
              </span>
              <p className={'text-xs mt-1 text-red-300'}>{errors.ward}</p>
            </div>
          </div>

          <div className="grid-cols-1 grid gap-8">
            <div>
              <span className="p-float-label">
                <Dropdown
                  value={selfInputs.street}
                  onChange={(e) =>
                    handleSelectAddressChanged(e.value, 'street')
                  }
                  options={streetListFiltered()}
                  optionLabel="name"
                  filter
                  placeholder="Select a Street"
                  className={'w-full p-inputtext-sm'}
                  name="street"
                  id="street"
                />
                <label htmlFor="street">Street</label>
              </span>
              <p className={'text-xs mt-1 text-red-300'}>{errors.street}</p>
            </div>
            <div>
              <span className="p-float-label">
                <InputText
                  id="detail"
                  name="detail"
                  value={selfInputs.detail}
                  onChange={(e) => handleChangeText(e)}
                  className={'w-full p-inputtext-sm'}
                />
                <label htmlFor="detail">Detail</label>
              </span>
              <p className={'text-xs mt-1 text-red-300'}>{errors.detail}</p>
            </div>
            <div>
              <span className="p-float-label">
                <InputText
                  id="building"
                  name="building"
                  value={selfInputs.building}
                  onChange={(e) => handleChangeText(e)}
                  className={'w-full p-inputtext-sm'}
                />
                <label htmlFor="building">Building</label>
              </span>
            </div>
          </div>
        </div>
      </>
    );
  },
);

export default AddressPopup;
