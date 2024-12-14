import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import BeatLoaderLoading from "./element/loading/BeatLoader";

export default function ModalAction({
  title,
  onSubmitTitle,
  onSubmit,
  children,
  id,
  show,
  onClose,
  loading,
  width,
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10  overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className={`relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8  ${width ? 'sm:' + width : 'sm:max-w-lg sm:w-full'} `}>
                <div className="bg-white px-4 pb-4 pt-5 overflow-initial rounded-lg sm:p-6 sm:pb-4">
                  <div className="">
                    <div className="mt-3 sm:ml-4 sm:mt-0 text-right">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900 text-center"
                      >
                        {title}
                      </Dialog.Title>
                      <div className="my-4">{children}</div>
                    </div>
                  </div>
                </div>
                {onSubmit && (
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row sm:justify-center sm:px-6">
                    <button
                      type="button"
                      disabled={loading}
                      className="btn-primary"
                      onClick={onSubmit}
                    >
                      {!loading ? (
                        onSubmitTitle
                      ) : (
                        <BeatLoaderLoading size={20} color="#fff" />
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={onClose}
                      ref={cancelButtonRef}
                    >
                      بستن
                    </button>
                  </div>
                )}
                {onSubmit == false && (
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row sm:justify-center sm:px-6">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={onClose}
                      ref={cancelButtonRef}
                    >
                      بستن
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
