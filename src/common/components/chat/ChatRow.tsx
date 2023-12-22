import { KeyValue } from '../../config/interfaces';

interface Props {
  message: KeyValue;
}

const ChatRow = ({ message }: Props) => {
  const messageContainer = () => {
    let classNameDiv = 'px-2 flex items-center justify-end';
    let classNameSpan =
      'bg-blue-400 max-w-[70%] min-h py-2 text-white px-4 rounded-md';
    if (!message.fromSelf) {
      classNameDiv = 'px-2 flex items-center justify-start';
      classNameSpan =
        'bg-green-400 max-w-[70%] min-h py-2 text-white px-4 rounded-md';
    }
    return (
      <div className={`${classNameDiv} mb-2`}>
        <span className={classNameSpan}>{message.message}</span>
      </div>
    );
  };

  return <>{messageContainer()}</>;
};

export default ChatRow;
