import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { socket } from '../../config/socket';
import { toast } from 'react-toastify';
import { KeyValue } from '../../config/interfaces';
import ChatRow from './ChatRow';

const ChatDialog = () => {
  const [isShowFullWindow, setIsShowFullWindow] = useState(false);
  const [currentChatInfo, setCurrentChatInfo] = useState({
    nickname: '',
    roomName: '',
    operatorName: '',
  });
  const [messageList, setMessageList] = useState([] as KeyValue[]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatStatus, setChatStatus] = useState({
    isConnected: false,
    isCanNotChat: false,
    isWaitingOperatorToChat: false,
    isOperatorJoined: false,
  });

  useEffect(() => {
    const savedChat = localStorage.getItem(
      process.env.NEXT_PUBLIC_CHAT_KEY || 'DSChatClient',
    );
    if (savedChat) {
      const data = JSON.parse(savedChat) as KeyValue;
      socket.connect();
      setChatStatus({
        ...chatStatus,
        isConnected: true,
      });
      setTimeout(() => {
        registerListener();
        socket.emit(
          'userReJoinChat',
          { roomName: data.roomName, instanceId: socket.id },
          (res: KeyValue) => {
            if (res) {
              setChatStatus({
                ...chatStatus,
                isOperatorJoined: true,
                isWaitingOperatorToChat: true,
              });
              setCurrentChatInfo({
                roomName: data.roomName,
                operatorName: data.operator,
                nickname: data.nickname,
              });
              data.instanceList.push(socket.id);
              localStorage.setItem(
                process.env.NEXT_PUBLIC_CHAT_KEY || 'DSChatClient',
                JSON.stringify(data),
              );
            }
          },
        );
      }, 500);
    }
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

    socket.on('newClientInstanceJoined', (data: KeyValue) => {
      handleNewClientInstanceJoined(data);
    });

    socket.on('clientLeaveRoom', (data: KeyValue) => {
      handleExit();
    });
  }

  const [newMessageContent, setNewMessageContent] = useState({} as KeyValue);

  function handleReceive(data: KeyValue) {
    setNewMessageContent(data);
  }

  useEffect(() => {
    if (newMessageContent.message) {
      let fromSelf = false;
      let isNeedUpdate = false;

      if (newMessageContent.from !== currentChatInfo.nickname) {
        fromSelf = false;
        isNeedUpdate = true;
      } else if (
        newMessageContent.from === currentChatInfo.nickname &&
        socket.id !== newMessageContent.instanceId
      ) {
        fromSelf = true;
        isNeedUpdate = true;
      }
      if (isNeedUpdate) {
        setMessageList((current) => {
          const res = ([] as KeyValue[]).concat(current);
          res.push({
            fromSelf,
            message: newMessageContent.message,
          });
          return res;
        });
        setTimeout(() => {
          scrollToBottom();
        });
      }
    }
  }, [newMessageContent]);

  function handleNewClientInstanceJoined(data: KeyValue) {
    const current = localStorage.getItem(
      process.env.NEXT_PUBLIC_CHAT_KEY || 'DSChatClient',
    );
    if (current) {
      const data = JSON.parse(current);
      data.instanceList.push(data.instanceId);
      localStorage.setItem(
        process.env.NEXT_PUBLIC_CHAT_KEY || 'DSChatClient',
        JSON.stringify(data),
      );
    }
  }

  function handleOperatorJoin(data: KeyValue) {
    setCurrentChatInfo((prev) => ({
      ...prev,
      operatorName: data.operatorName,
    }));
    setChatStatus({
      ...chatStatus,
      isOperatorJoined: true,
      isWaitingOperatorToChat: true,
    });
    const currentSaved = localStorage.getItem(
      process.env.NEXT_PUBLIC_CHAT_KEY || 'DSChatClient',
    );
    if (currentSaved) {
      const dataSaved = JSON.parse(currentSaved);
      dataSaved.operator = data.operatorName;
      localStorage.setItem(
        process.env.NEXT_PUBLIC_CHAT_KEY || 'DSChatClient',
        JSON.stringify(dataSaved),
      );
    }
  }

  function scrollToBottom() {
    const div = document.getElementById('chat-container');
    if (div) {
      div.scrollTop = div.scrollHeight;
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
        { userName: currentChatInfo.nickname, instanceId: socket.id },
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
            setCurrentChatInfo((prev) => ({
              ...prev,
              roomName: res.roomName,
            }));
            setChatStatus({
              ...chatStatus,
              isCanNotChat: false,
              isWaitingOperatorToChat: true,
            });
            localStorage.setItem(
              process.env.NEXT_PUBLIC_CHAT_KEY || 'DSChatClient',
              JSON.stringify({
                instanceList: [socket.id],
                roomName: res.roomName,
                operator: '',
                nickname: currentChatInfo.nickname,
              }),
            );
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
        from: currentChatInfo.nickname,
        roomName: currentChatInfo.roomName,
        instanceId: socket.id,
      },
      (res: boolean) => {
        if (res) {
          setMessageList((prev) => [
            ...prev,
            {
              fromSelf: true,
              message: currentMessage,
            },
          ]);
          setCurrentMessage('');
          setTimeout(() => {
            scrollToBottom();
          });
        }
      },
    );
  }

  function handleExit() {
    socket.disconnect();
    setChatStatus({
      isConnected: false,
      isCanNotChat: false,
      isWaitingOperatorToChat: false,
      isOperatorJoined: false,
    });
    setCurrentChatInfo((prev) => ({
      ...prev,
      operatorName: '',
    }));
    setMessageList([]);
    setIsShowFullWindow(false);
    localStorage.setItem(
      process.env.NEXT_PUBLIC_CHAT_KEY || 'DSChatClient',
      '',
    );
  }

  function exitChat() {
    socket.emit(
      'customerExitChat',
      {
        roomName: currentChatInfo.roomName,
        instanceId: socket.id,
      },
      (res: boolean) => {
        if (res) {
        }
      },
    );
    handleExit();
  }

  function checkKeyPress(code: string) {
    if (code === 'Enter') sendMessage();
  }

  return (
    <>
      <div className="fixed right-4 lg:right-20 bottom-4 lg:bottom-20 ">
        {!isShowFullWindow && (
          <div
            onClick={() => setIsShowFullWindow(true)}
            className="cursor-pointer flex items-center justify-center bg-blue-400 rounded-lg p-4 text-white"
          >
            <i className="pi pi-comment lg:mr-2 !lg:text-4xl"></i>
            <span className="hidden lg:block">Need a help?</span>
          </div>
        )}
        {isShowFullWindow && (
          <div className="lg:h-[500px] h-[70vh] w-[90vw] lg:w-[400px] bg-gray-300 rounded-lg flex flex-col justify-between">
            <div className="flex justify-between items-center px-2 pt-2">
              <span className="text-lg ml-2 font-semibold">
                {currentChatInfo.operatorName || ''}
              </span>

              <div>
                {chatStatus.isWaitingOperatorToChat && (
                  <button
                    className="mr-4"
                    aria-label="Quit"
                    onClick={() => exitChat()}
                  >
                    <i className="pi pi-sign-out text-white !text-xl"></i>
                  </button>
                )}
                <button
                  className=""
                  aria-label="Cancel"
                  onClick={() => setIsShowFullWindow(false)}
                >
                  <i className="pi pi-times text-white !text-xl"></i>
                </button>
              </div>
            </div>

            {!chatStatus.isWaitingOperatorToChat && (
              <div className="flex items-center justify-center flex-col h-full w-full">
                <span className="p-input-icon-left mb-4">
                  <i className="pi pi-user" />
                  <InputText
                    value={currentChatInfo.nickname}
                    onChange={(e) =>
                      setCurrentChatInfo((prev) => ({
                        ...prev,
                        nickname: e.target.value,
                      }))
                    }
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
              <div className="relative w-full h-[calc(100%-45px)] p-2">
                {!chatStatus.isOperatorJoined && (
                  <div className="w-full h-full flex items-center justify-center">
                    <span>Waiting for Operator to join chat...</span>
                  </div>
                )}
                {chatStatus.isOperatorJoined && (
                  <>
                    <div
                      id="chat-container"
                      className="justify-end overflow-scroll w-full h-[calc(100%-53px)] rounded-md bg-white py-4"
                    >
                      {messageList.map((message: KeyValue, index) => (
                        <ChatRow key={index} message={message} />
                      ))}
                    </div>
                    <div
                      id="input-chat"
                      className="absolute bottom-2 left-2 w-[calc(100%-1rem)] flex justify-between items-center"
                    >
                      <input
                        value={currentMessage}
                        onKeyDown={(e) => checkKeyPress(e.code)}
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
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatDialog;
