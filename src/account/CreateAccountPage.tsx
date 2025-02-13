import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalHandler } from "@/shared/components/Modal";
import {
  createAccount,
  ICreateAccountServiceBody,
} from "@/services/accounts.service";
import styles from "./CreateAccountPage.module.scss";
import CreateAccountForm from "./components/CreateAccountForm/CreateAccountForm";

const CreateAccountPage = () => {
  const modalRef = React.useRef<ModalHandler | null>(null);
  const isMounted = useRef(false);
  const controller = useRef<AbortController | null>(null);

  const isCreateAccountSuccess = useRef(false);
  const router = useRouter();
  const handleOnCreate = async (data: ICreateAccountServiceBody) => {
    if (controller.current) {
      controller.current.abort();
    }
    controller.current = new AbortController();
    const result = await createAccount(data, {
      signal: controller.current.signal,
    });
    if (!isMounted.current) {
      return false;
    }
    isCreateAccountSuccess.current = result.success;
    modalRef.current?.open(result.message, {
      type: result.success ? "success" : "error",
    });
    return result.success;
  };

  const handleOnClose = () => {
    if (isCreateAccountSuccess.current) {
      router.push("/");
    }
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (controller.current) {
        controller.current.abort();
      }
    };
  }, []);

  return (
    <>
      <div className={styles.CreateAccountPage}>
        <CreateAccountForm onCreate={handleOnCreate} />
      </div>
      <Modal ref={modalRef} onClose={handleOnClose} />
    </>
  );
};

export default CreateAccountPage;
