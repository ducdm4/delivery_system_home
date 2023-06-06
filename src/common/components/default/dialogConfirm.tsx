import { NextPage } from 'next';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';

interface Props {
  isShow: boolean;
  title: Function;
  body: Function;
  refusedCallback: Function;
  acceptedCallback: Function;
}

const DialogConfirm: NextPage<Props> = ({
  isShow,
  title,
  body,
  refusedCallback,
  acceptedCallback,
}) => {
  const [open, setOpen] = useState(isShow);

  const handleOpen = () => {
    refusedCallback();
  };

  useEffect(() => {
    setOpen(isShow);
  }, [isShow]);

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>{title()}</DialogHeader>
      <DialogBody divider>{body()}</DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button
          variant="gradient"
          color="green"
          onClick={() => acceptedCallback()}
        >
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DialogConfirm;
