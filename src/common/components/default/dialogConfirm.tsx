import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

interface Props {
  isShow: boolean;
  title: string;
  body: string;
  refusedCallback: () => void;
  acceptedCallback: () => void;
}

const DialogConfirm: NextPage<Props> = ({
  isShow,
  title,
  body,
  refusedCallback,
  acceptedCallback,
}) => {
  useEffect(() => {
    if (isShow) {
      confirmDialog({
        message: body,
        header: title,
        icon: 'pi pi-exclamation-triangle',
        accept: acceptedCallback,
        reject: refusedCallback,
        onHide: (e) => onHid(e),
      });
    }
  }, [isShow]);

  function onHid(res: string) {
    refusedCallback();
  }

  return <ConfirmDialog />;
};

export default DialogConfirm;
