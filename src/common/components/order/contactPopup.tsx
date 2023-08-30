import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import React, {
  forwardRef,
  Ref,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { contactInputRef } from '../../config/interfaces';
import { InputsContext } from '../../../pages/new';
import {
  setInputByValue,
  validateEmailText,
  validateRequired,
} from '../../functions';

interface Props {
  isShow: boolean;
  keyInput: string;
}

const ContactPopup = forwardRef(
  ({ isShow, keyInput }: Props, ref: Ref<contactInputRef>) => {
    useImperativeHandle(ref, () => ({ submitContact, saveData }));

    const context = useContext(InputsContext);
    const initSelfInputs = {
      name: '',
      email: '',
      phone: '',
    };
    const [selfInputs, setSelfInputs] = useState(initSelfInputs);
    const [errors, setErrors] = useState(initSelfInputs);

    useEffect(() => {
      if (isShow) {
        setSelfInputs((old) => {
          const newVal = {
            name: context.inputs[`${keyInput}Name`],
            email: context.inputs[`${keyInput}Email`],
            phone: context.inputs[`${keyInput}Phone`],
          };
          return newVal;
        });
      } else {
        setSelfInputs(initSelfInputs);
        setErrors(initSelfInputs);
      }
    }, [isShow]);

    function submitContact() {
      let check = true;
      const errorsCheck = Object.assign({}, errors);
      errorsCheck.email = validateEmailText(selfInputs.email);
      if (errorsCheck.email) check = false;

      errorsCheck.name = validateRequired(selfInputs.name, 'name');
      if (errorsCheck.name) check = false;

      errorsCheck.phone = validateRequired(selfInputs.phone, 'phone');
      if (errorsCheck.phone) check = false;

      if (!check) {
        setErrors(errorsCheck);
      }
      return check;
    }

    function saveData() {
      context.customSetInputs(`${keyInput}Name`, selfInputs.name);
      context.customSetInputs(`${keyInput}Email`, selfInputs.email);
      context.customSetInputs(`${keyInput}Phone`, selfInputs.phone);
    }

    return (
      <>
        <div className={'flex gap-4'}>
          <div className="pt-8 basis-1/3">
            <span className="p-float-label">
              <InputText
                className={'p-inputtext-sm w-full'}
                id="fullname"
                value={selfInputs.name}
                name="name"
                onChange={(e) =>
                  setInputByValue(e.target.name, e.target.value, setSelfInputs)
                }
              />
              <label htmlFor="fullname">Full name</label>
            </span>
            <p className={'text-xs mt-1 text-red-300 text-left '}>
              {errors.name}
            </p>
          </div>
          <div className="pt-8  basis-1/3">
            <span className="p-float-label">
              <InputText
                className={'p-inputtext-sm w-full'}
                value={selfInputs.email}
                name="email"
                onChange={(e) =>
                  setInputByValue(e.target.name, e.target.value, setSelfInputs)
                }
                type="email"
                id="email"
              />
              <label htmlFor="email">Email</label>
            </span>
            <p className={'text-xs mt-1 text-red-300 text-left '}>
              {errors.email}
            </p>
          </div>
          <div className="pt-8 basis-1/3">
            <span className="p-float-label">
              <InputMask
                mask="9999-999-999"
                placeholder="9999-999-999"
                className={'p-inputtext-sm w-full'}
                id="senderPhone"
                value={selfInputs.phone}
                name="phone"
                onChange={(e) =>
                  setInputByValue(e.target.name, e.target.value, setSelfInputs)
                }
              />
              <label htmlFor="senderPhone">Phone</label>
            </span>
            <p className={'text-xs mt-1 text-red-300 text-left '}>
              {errors.phone}
            </p>
          </div>
        </div>
      </>
    );
  },
);

export default ContactPopup;
