import React, { createContext, ReactNode, useContext, useState } from "react";

interface ModalType {
  id: number;
  content: ReactNode;
  onCancel?: () => void;
}

type ModalContextType = {
  show: (content: ReactNode, onCancel?: () => void) => void;
  hide: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modal, setModal] = useState<ModalType | null>(null);

  const show = (content: ReactNode, onCancel?: () => void) => {
    const id = new Date().getTime();
    setModal({ id, content, onCancel });
  };

  const hide = () => setModal(null);

  return (
    <ModalContext.Provider value={{ show, hide }}>
      {children}
      {modal && <Modal show={show} onHide={hide}>{modal.content}</Modal>}
    </ModalContext.Provider>
  );
};

export const Modal = ({ children, show, onHide }: any) => {
  return show && (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onHide}
    >
      <div
        className="flex flex-col modal-content bg-white p-4 rounded-lg shadow-lg w-2/3 h-2/3 overflow-y-auto"
        onClick={(event: React.MouseEvent) => event.stopPropagation()}
      >
        <div className="flex justify-end space-x-2">
          <span onClick={onHide} className="cursor-pointer text-xl">&times;</span>
        </div>
        <div className="flex flex-col flex-grow p-2 gap-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export const useModals = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModals must be used within a ModalProvider");
  }
  return context;
};
