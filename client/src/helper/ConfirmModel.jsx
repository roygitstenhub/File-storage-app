// components/ConfirmModal.jsx
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50 " onClose={onCancel}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-white/10 opacity backdrop-blur" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4 ">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="max-w-md w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-200  ">
                            <Dialog.Title className="text-lg font-medium text-gray-900">{title}</Dialog.Title>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">{message}</p>
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    onClick={onCancel}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Confirm
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
