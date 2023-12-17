import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { socket } from '../../config/socket';
import { toast } from 'react-toastify';
import { KeyValue } from '../../config/interfaces';
import ChatRow from './ChatRow';

const ChatDialog = () => {
  const [isShowFullWindow, setIsShowFullWindow] = useState(false);
  const [userNickname, setUserNickname] = useState('');
  const [messageList, setMessageList] = useState([] as KeyValue[]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatStatus, setChatStatus] = useState({
    isConnected: false,
    isCanNotChat: false,
    isWaitingOperatorToChat: false,
    isOperatorJoined: false,
  });
  const [currentChatRoomName, setCurrentChatRoomName] = useState('');
  const [currentOperatorName, setCurrentOperatorName] = useState('');

  useEffect(() => {
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  function registerListener() {
    socket.on('operatorJoinedChat', (data: KeyValue) => {
      handleOperatorJoin(data);
    });

    socket.on('newMessageReceived', (data: KeyValue) => {
      handleReceive(data);
    });
  }

  function handleOperatorJoin(data: KeyValue) {
    setCurrentOperatorName(data.operatorName);
    setChatStatus({
      ...chatStatus,
      isOperatorJoined: true,
      isWaitingOperatorToChat: true,
    });
  }

  function handleReceive(data: KeyValue) {
    if (data.from !== userNickname) {
      setMessageList((current) => {
        const res = ([] as KeyValue[]).concat(current);
        res.push({
          fromSelf: false,
          message: data.message,
        });
        return res;
      });
    }
  }

  function connectToChat() {
    socket.connect();
    setChatStatus({
      ...chatStatus,
      isConnected: true,
    });
    setTimeout(() => {
      registerListener();
      socket.emit(
        'userRequestToChat',
        { userName: userNickname, instanceId: socket.id },
        (res: KeyValue) => {
          if (!res.roomName) {
            setChatStatus({
              ...chatStatus,
              isCanNotChat: true,
            });
            toast(
              'Sorry, our operator is not online yet. \n Please try again later',
              {
                hideProgressBar: true,
                autoClose: 5000,
                type: 'error',
              },
            );
          } else {
            setCurrentChatRoomName(res.roomName);
            setChatStatus({
              ...chatStatus,
              isCanNotChat: false,
              isWaitingOperatorToChat: true,
            });
          }
        },
      );
    }, 500);
  }

  function sendMessage() {
    socket.emit(
      'sendNewMessage',
      {
        message: currentMessage,
        from: userNickname,
        roomName: currentChatRoomName,
      },
      (res: boolean) => {
        if (res) {
          setCurrentMessage('');
          setMessageList((current) => {
            current.push({
              fromSelf: true,
              message: currentMessage,
            });
            return current;
          });
        }
      },
    );
  }

  return (
    <>
      <div className="fixed right-20 bottom-20 ">
        {!isShowFullWindow && (
          <div
            onClick={() => setIsShowFullWindow(true)}
            className="cursor-pointer flex items-center justify-center bg-blue-400 rounded-lg p-4 text-white"
          >
            <i className="pi pi-comment mr-2 !text-4xl"></i>
            <span>Need a help?</span>
          </div>
        )}
        {isShowFullWindow && (
          <div className="lg:h-[500px] lg:w-[400px] bg-gray-300 rounded-lg flex flex-col justify-between">
            <div className="flex justify-between items-center px-2 pt-2">
              <span className="text-lg ml-2 font-semibold">
                {currentOperatorName || ''}
              </span>
              <button
                className=""
                aria-label="Cancel"
                onClick={() => setIsShowFullWindow(false)}
              >
                <i className="pi pi-times text-white !text-xl"></i>
              </button>
            </div>

            {!chatStatus.isWaitingOperatorToChat && (
              <div className="flex items-center justify-center flex-col h-full w-full">
                <span className="p-input-icon-left mb-4">
                  <i className="pi pi-user" />
                  <InputText
                    value={userNickname}
                    onChange={(e) => setUserNickname(e.target.value)}
                    placeholder="How could we call you?"
                  />
                </span>
                <Button
                  onClick={() => connectToChat()}
                  label="Connect to operator"
                  severity="success"
                  icon="pi pi-check"
                />
              </div>
            )}
            {chatStatus.isWaitingOperatorToChat && (
              <div className="relative w-full h-full p-2">
                <div className="w-[calc(100%)] bg-white m-auto rounded-md h-[calc(100%-4rem)]">
                  {!chatStatus.isOperatorJoined && (
                    <div className="w-full h-full flex items-center justify-center">
                      <span>Waiting for Operator to join chat...</span>
                    </div>
                  )}
                  {chatStatus.isOperatorJoined && (
                    <>
                      <div className="flex flex-col justify-end w-full h-full">
                        {messageList.map((message: KeyValue, index) => (
                          <ChatRow key={index} message={message} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div
                  id="input-chat"
                  className="absolute bottom-2 left-2 w-[calc(100%-1rem)] flex justify-between items-center"
                >
                  <input
                    value={currentMessage}
                    className="h-10 p-2 rounded-md w-[calc(100%-7rem)]"
                    onChange={(e) => setCurrentMessage(e.target.value)}
                  />
                  <Button
                    onClick={() => sendMessage()}
                    label="Send"
                    size="small"
                    severity="success"
                    disabled={!chatStatus.isOperatorJoined}
                    icon="pi pi-send"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatDialog;
