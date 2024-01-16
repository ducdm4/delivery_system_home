'use client';

import { Button } from 'primereact/button';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyValue } from '../../config/interfaces';
import { CALL_STATUS } from '../../config/constant';

type Props = {
  trackingId: string;
  callInfo: KeyValue;
  userDidEndCall: any;
};

const CallDialog = ({ trackingId, callInfo, userDidEndCall }: Props) => {
  const threeDot = useRef<HTMLSpanElement>(null);
  const [dotInterval, setDotInterval] = useState(0);

  useEffect(() => {
    startTimer();
    return () => {
      stopTimer();
    };
  }, []);

  const intervalIDRef = useRef(0);
  const startTimer = useCallback(() => {
    intervalIDRef.current = window.setInterval(() => {
      if (threeDot.current) {
        if (threeDot.current.innerText.length < 3) {
          threeDot.current.innerText += '.';
        } else {
          threeDot.current.innerText = '.';
        }
      }
    }, 500);
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(intervalIDRef.current);
    intervalIDRef.current = 0;
  }, []);

  const connectStateText = useMemo(() => {
    switch (callInfo.connectingState) {
      case CALL_STATUS.CHECKING_SHIPPER_ONLINE:
        return 'Checking shipper is online';
        break;
      case CALL_STATUS.SHIPPER_NOT_ONLINE:
        stopTimer();
        if (threeDot.current) {
          threeDot.current.innerText = '';
        }
        return 'Unable to connect, shipper is not online';
        break;
      case CALL_STATUS.CONNECTING_TO_SHIPPER:
        return 'Connecting to shipper';
        break;
      case CALL_STATUS.CONNECTED_TO_SHIPPER:
        return 'Connected to shipper, waiting shipper to pickup the call';
        break;
      case CALL_STATUS.SHIPPER_DECLINE:
        return "Shipper didn't pickup the phone";
        break;
      case CALL_STATUS.IN_CALL:
        return 'In call';
        break;
      default:
        return '';
    }
  }, [callInfo.connectingState]);

  function endCall() {
    userDidEndCall();
  }

  return (
    <>
      <div
        id="background"
        className="fixed top-0 left-0 w-[100vw] h-[100vh] backdrop-brightness-75 flex justify-center items-center"
      >
        <div
          id="main-call-background"
          className="lg:w-[20vw] w-[90vw] bg-white p-4"
        >
          <div className="flex justify-center items-baseline gap-1">
            <span className="text-center font-semibold text-xl">
              {' '}
              Calling your shipper in charge{' '}
            </span>
          </div>
          <p className="text-center text-gray-400">{connectStateText}</p>
          <p className="text-center">
            <span className="w-[10px]" ref={threeDot}>
              .
            </span>
          </p>

          <audio id="call-play" autoPlay={true}></audio>

          <div className="mt-10">
            <p className="font-semibold text-red-500 text-center">
              <span className="text-sm text-gray-500">Tracking ID:</span>{' '}
              {trackingId}
            </p>
          </div>

          <div className="flex mt-10 justify-center gap-16 mb-4">
            <Button
              rounded
              severity="danger"
              size="large"
              icon="pi pi-times-circle"
              onClick={() => endCall()}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CallDialog;
