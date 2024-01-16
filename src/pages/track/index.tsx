import { NextPage } from 'next';
import { InputNumber } from 'primereact/inputnumber';
import { lazy, useCallback, useEffect, useMemo, useState } from 'react';
import {
  trackingOrder,
  orderLoading,
  customerRequestCancel,
  customerConfirmCancel,
} from '../../features/order/orderSlice';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import { KeyValue } from '../../common/config/interfaces';
import { format } from 'date-fns';
import { CALL_STATUS, ORDER_STATUS } from '../../common/config/constant';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import router from 'next/router';
import { toast } from 'react-toastify';
import CallDialog from '../../common/components/call/CallDialog';
import { socket } from '../../common/config/socket';
// import { Peer } from 'peerjs';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const TrackingPage: NextPage = () => {
  const [trackingId, setTrackingId] = useState(null as number | null);
  const [inputError, setInputError] = useState('');
  const [cancelOTP, setCancelOTP] = useState(null as number | null);
  const [trackingList, setTrackingList] = useState([] as KeyValue[]);
  const [showDialogCancel, setShowDialogCancel] = useState(false);
  const [inputOTPError, setInputOTPError] = useState('');
  const dispatch = useAppDispatch();
  const currentLoading = useAppSelector(orderLoading);

  async function didClickFindOrder() {
    if (validateTrackingId()) {
      const res = await dispatch(trackingOrder(`${trackingId}`)).unwrap();
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

  function validateTrackingId() {
    let check = true;
    if (!trackingId) {
      check = false;
      setInputError('Please input tracking ID');
    } else {
      setInputError('');
    }
    return check;
  }

  async function sendRequestCancelOrder() {
    if (trackingId && validateTrackingId()) {
      const request = await dispatch(
        customerRequestCancel(`${trackingId}`),
      ).unwrap();
      if (request.isSuccess) {
        setShowDialogCancel(true);
      }
    }
  }

  async function confirmCancelOrder() {
    let check = true;
    if (!cancelOTP) {
      check = false;
      setInputOTPError('Please input OTP');
    } else {
      setInputOTPError('');
    }
    if (check) {
      const request = await dispatch(
        customerConfirmCancel({ trackingId, otp: cancelOTP }),
      ).unwrap();
      if (request.isSuccess) {
        setShowDialogCancel(false);
        toast('Order canceled successfully!', {
          hideProgressBar: true,
          autoClose: 2000,
          type: 'success',
        });
        router.push('/');
      }
    }
  }

  const orderCancel = () => {
    if (trackingList.length > 0 && trackingList[0].order.isCancel) {
      const res = (
        <div className="w-full grid grid-cols-8 min-h-[60px] border-b">
          <div className="col-span-2 border-r flex items-center justify-center text-gray-500 lg:text-md text-sm lg:w-auto w-30">
            {format(
              new Date(trackingList[0].order.updatedAt),
              'yyyy-MM-dd HH:mm',
            )}
          </div>
          <div className="col-span-6 p-2 lg:ml-8 flex items-center text-lg">
            Order canceled with reason: {trackingList[0].order.isCancelNote}
          </div>
        </div>
      );
      return res;
    }
    return '';
  };

  const [callInfo, setCallInfo] = useState({
    isShowDialog: false,
    connectingState: CALL_STATUS.CHECKING_SHIPPER_ONLINE,
  });

  function didClickCallShipper() {
    console.log('socket', socket);
    if (!socket.connected) {
      socket.connect();
    }
    setTimeout(() => {
      handleSendRequestCall();
    }, 400);
  }

  function handleSendRequestCall() {
    console.log('socket.id', socket.id);
    socket.emit(
      'customerRequestCallShipper',
      {
        instanceId: socket.id,
        trackingId: trackingId,
      },
      (res: boolean) => {
        if (res) {
          setCallInfo(() => ({
            isShowDialog: true,
            connectingState: CALL_STATUS.CONNECTING_TO_SHIPPER,
          }));
          console.log('callInfo. 22', callInfo.connectingState);
        } else {
          toast('Shipper is not online yet, try again later', {
            hideProgressBar: true,
            autoClose: 2000,
            type: 'error',
          });
        }
      },
    );
  }

  const checkAbleToConnect = useCallback(() => {
    if (callInfo.connectingState === CALL_STATUS.CONNECTING_TO_SHIPPER) {
      setCallInfo((current) => ({
        ...current,
        connectingState: CALL_STATUS.SHIPPER_NOT_ONLINE,
      }));
    }
  }, []);

  useEffect(() => {
    if (callInfo.connectingState === CALL_STATUS.CONNECTING_TO_SHIPPER) {
      setTimeout(() => {
        console.log('callInfo.connectingState', callInfo.connectingState);
        checkAbleToConnect();
      }, 3000);
    }
    // if (callInfo.connectingState === CALL_STATUS.SHIPPER_NOT_ONLINE) {
    console.log('callInfo.SHIPPER_NOT_ONLINE', callInfo.connectingState);
    // }
  }, [callInfo.connectingState]);

  useEffect(() => {
    socket.on('shipperCanJoinCall', (peer: KeyValue) => {
      setCallInfo((current) => ({
        ...current,
        connectingState: CALL_STATUS.CONNECTED_TO_SHIPPER,
      }));

      audioCall(peer.peerId);
      console.log('peer', peer.peerId);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const audioCall = useCallback((peerId: string) => {
    if (typeof window !== 'undefined' && window.document) {
      if (peerId) {
        const Peer = require('peerjs').default;
        const peer = new Peer();

        setTimeout(() => {
          console.log('peer own id', peer.id);
          const getMedia = navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
          getMedia.then(
            (stream) => {
              // const audioEle = document.getElementById(
              //   'audio-call',
              // ) as HTMLAudioElement;
              // if (videoId) {
              //   videoId.srcObject = stream;
              // }
              console.log('peer peer id', peer);
              console.log('peer peer stream', stream);
              console.log('peer peer peerId', peerId);
              const call = peer.call(peerId, stream);
              call.on('stream', (localStream: MediaStream) => {
                console.log('localStream', localStream);
                // Show stream in some <video> element.
                const audioElement = document.getElementById(
                  'call-play',
                ) as HTMLAudioElement;
                if (audioElement) {
                  audioElement.srcObject = stream;
                }
                // videoContainer.value!.srcObject = remoteStream
              });
            },
            (err) => {
              console.error('Failed to get local stream', err);
            },
          );
        }, 500);
      }
    }
  }, []);

  function userDidEndCall() {
    setCallInfo(() => ({
      isShowDialog: false,
      connectingState: 0,
    }));
    socket.disconnect();
  }

  return (
    <>
      <Head>
        <title>Track your delivery | Delivery system</title>
      </Head>
      <div className="bg-gray-50 border p-4 lg:p-10 mt-4 gap-4 flex flex-col items-center justify-center w-[100vw] lg:w-auto">
        <span>Unique Tracking ID:</span>
        <div>
          <InputNumber
            className=""
            value={trackingId}
            onValueChange={(e) => setTrackingId(e.value as number)}
            useGrouping={false}
          />
          <p className="text-red-500 text-sm pl-2">{inputError}</p>
        </div>

        <div>
          <button
            onClick={() => didClickFindOrder()}
            className="bg-blue-500 text-white px-4 lg:px-8 lg:py-3 py-2 ml-2 rounded-md shadow-md text-sm lg:text-md"
          >
            SEARCH
          </button>
          {trackingList.length > 0 &&
            trackingList[trackingList.length - 1].status ===
              ORDER_STATUS.ORDER_ON_THE_WAY_TO_RECEIVER && (
              <button
                onClick={() => didClickCallShipper()}
                className="bg-green-500 text-white px-4 lg:px-8 lg:py-3 py-2 ml-2 rounded-md shadow-md text-sm lg:text-md"
              >
                CALL SHIPPER
              </button>
            )}

          {trackingList.length === 1 && (
            <button
              onClick={() => sendRequestCancelOrder()}
              className="bg-red-500 text-white px-4 lg:px-8 lg:py-3 py-2 ml-2 rounded-md shadow-md text-sm lg:text-md"
            >
              CANCEL
            </button>
          )}
        </div>
      </div>
      {currentLoading === 'loading' && (
        <div className="flex items-center justify-center mt-4">
          <ProgressSpinner
            style={{ width: '50px', height: '50px' }}
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration="1.5s"
          />
        </div>
      )}

      {trackingList.length > 0 && (
        <div className="bg-gray-50 border py-10 lg:px-32 px-4 mt-4">
          {trackingList.map((item: KeyValue, index) => (
            <div
              className="w-full grid grid-cols-8 min-h-[60px] border-b"
              key={index}
            >
              <div className="col-span-2 border-r flex items-center justify-center text-gray-500 lg:text-md text-sm lg:w-auto w-30">
                {format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm')}
              </div>
              <div className="col-span-6 p-2 lg:ml-8 flex items-center text-lg">
                {textByStatus(item)}
              </div>
            </div>
          ))}
          {orderCancel()}
        </div>
      )}

      <Dialog
        visible={showDialogCancel}
        header="Cancel your order"
        onHide={() => setShowDialogCancel(false)}
      >
        <div className="flex flex-col gap-4 items-center">
          <p>
            We've sent an OTP to the sender's email. Please provide your OTP
            below
          </p>
          <div>
            <InputNumber
              className=""
              value={cancelOTP}
              onValueChange={(e) => setCancelOTP(e.value as number)}
              useGrouping={false}
            />
            <p className="text-red-500 text-sm pl-2">{inputOTPError}</p>
          </div>

          <button
            onClick={() => confirmCancelOrder()}
            className="bg-red-500 w-36 text-white px-4 lg:px-8 lg:py-3 py-2 ml-2 rounded-md shadow-md text-sm lg:text-md"
          >
            CANCEL
          </button>
        </div>
      </Dialog>

      {callInfo.isShowDialog && (
        <CallDialog
          trackingId={`${trackingId}`}
          callInfo={callInfo}
          userDidEndCall={userDidEndCall}
        ></CallDialog>
      )}
    </>
  );
};

export default TrackingPage;
