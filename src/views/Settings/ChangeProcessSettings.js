import React, { useRef, useState } from "react";
import { ReactComponent as LogoEdit } from "../../assets/logo-edit.svg";
import { Keyboard } from "../../components/Keyboard";
import { useVariableToConfig } from "../../utils/hooks";

export default () => {

    /**
     * @type {React.MutableRefObject<import("../../components/Keyboard").KeyboardType>}
     */
    const keyboardRef = useRef();
    const [isEdit, setIsEdit] = useState(false);
    const [process1, setProcess1, showKeyboard1] = useVariableToConfig("process1", 0, keyboardRef, "number");
    const [process2, setProcess2, showKeyboard2] = useVariableToConfig("process2", 0, keyboardRef, "number");
    const [process3, setProcess3, showKeyboard3] = useVariableToConfig("process3", 0, keyboardRef, "number");

    return (
        <>
            <div>
                <h2 className="text-2xl mb-2 font-semibold text-brand-green">Waktu Sampling</h2>
                <p className="text-gray-500 text-lg leading-snug">
                    Atur waktu pengambilan sampling tiap sensor.
                </p>
            </div>
            <div className="flex items-end space-x-5">
                <div className="flex-1 grid grid-cols-3 gap-2">
                    <div>
                        <p className="text-gray-500 font-semibold">Process 1</p>
                        <div className="text-2xl font-semibold text-brand-green">
                            {!isEdit && <p className="mt-1">
                                {Number(process1).toString()}
                            </p>}
                            {isEdit && <input
                                value={process1}
                                onInput={(e) => setProcess1(e.target.value)}
                                onFocus={showKeyboard1}
                                type="number"
                                className="text-2xl rounded-lg bg-gray-100 px-2 py-1 w-full font-semibold outline-none focus:bg-white focus:ring-4 focus:ring-brand-green-lighter transition duration-300"
                            />}
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 font-semibold">Process 2</p>
                        <div className="text-2xl font-semibold text-brand-green">
                            {!isEdit && <p className="mt-1">
                                {Number(process2).toString()}
                            </p>}
                            {isEdit && <input
                                onFocus={showKeyboard2}
                                value={process2}
                                onInput={(e) => setProcess2(e.target.value)}
                                type="number"
                                className="text-2xl rounded-lg bg-gray-100 px-2 py-1 w-full font-semibold outline-none focus:bg-white focus:ring-4 focus:ring-brand-green-lighter transition duration-300"
                            />}
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 font-semibold">Process 3</p>
                        <div className="text-2xl font-semibold text-brand-green">
                            {!isEdit && <p className="mt-1">
                                {Number(process3).toString()}
                            </p>}
                            {isEdit && <input
                                onFocus={showKeyboard3}
                                value={process3}
                                onInput={(e) => setProcess3(e.target.value)}
                                type="number"
                                className="text-2xl rounded-lg bg-gray-100 px-2 py-1 w-full font-semibold outline-none focus:bg-white focus:ring-4 focus:ring-brand-green-lighter transition duration-300"
                            />}
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        onClick={() => setIsEdit(edit => !edit)}
                        className={(isEdit ? 'bg-brand-green text-white' : 'bg-white text-brand-green') + " flex items-center justify-center text-lg font-semibold border-2 border-brand-green p-2 w-32 rounded-lg focus:outline-none"}
                    >
                        <LogoEdit className="w-5 h-5 mr-1" />
                        {isEdit ? "Simpan" : "Ubah"}
                    </button>
                </div>
            </div>

            <Keyboard ref={keyboardRef} />
        </>
    )
}