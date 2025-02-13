import React, { FC, useEffect, useImperativeHandle } from "react";
import styles from "./Modal.module.scss";

interface OpenModalOptions {
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  autoClose?: boolean;
  showCountdown?: boolean;
}

interface ModalState extends OpenModalOptions {
  isOpen: boolean;
  message: string;
}

const defaultState: ModalState = {
  isOpen: false,
  message: "",
  type: "info",
  duration: 5,
  showCountdown: false,
  autoClose: true,
};

export interface ModalHandler {
  open: (message: string, options?: OpenModalOptions) => void;
  close: (clearMessage?: boolean) => void;
  update: (message: string, options?: OpenModalOptions) => void;
}

interface ModalProps {
  ref: React.RefObject<ModalHandler | null>;
  onClose?: () => void;
}

const Modal: FC<ModalProps> = ({ ref, onClose }) => {
  const [status, setStatus] = React.useState<ModalState>(defaultState);

  const autoCloseTimer = React.useRef<NodeJS.Timeout | null>(null);
  useImperativeHandle(ref, () => ({
    open: (message: string, options?: OpenModalOptions) => {
      setStatus((prev) => {
        return {
          ...prev,
          isOpen: true,
          message,
          ...options,
        };
      });
    },
    close: (clearMessage = false) => {
      if (clearMessage) {
        setStatus(defaultState);
      } else {
        setStatus((prev) => {
          return {
            ...prev,
            isOpen: false,
          };
        });
      }
    },
    update: (message: string) => {
      setStatus((prev) => {
        return {
          ...prev,
          message,
        };
      });
    },
  }));

  useEffect(() => {
    if (status.isOpen) {
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }
      if (status.autoClose) {
        autoCloseTimer.current = setTimeout(() => {
          setStatus((prev) => {
            return {
              ...prev,
              isOpen: false,
            };
          });
        }, status.duration! * 1000);
      }
    }
    return () => {
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }
    };
  }, [status.isOpen, status.autoClose, status.duration]);

  useEffect(() => {
    if (!status.isOpen) {
      onClose?.();
    }
  }, [status.isOpen]);

  if (!status.isOpen) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <div
        className={`${styles["modal-message"]} ${
          styles[`modal-message-${status.type}`]
        }`}
      >
        {status.message}
      </div>
      {status.showCountdown ? (
        <div className={styles["modal-countdown"]}>5</div>
      ) : null}
    </div>
  );
};

export default Modal;
