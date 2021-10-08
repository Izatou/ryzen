import React, { useCallback, useEffect, useState } from "react";

/**
 * @param {string} variableName
 * @param {string} defaultValue
 * @param {React.MutableRefObject<import("../components/Keyboard").KeyboardType>} keyboardRef
 * @param {string} keyboardType
 * @return {[
 * variable: any,
 * React.Dispatch<React.SetStateAction<any>>,
 * ()=>void,
 * ]}
 */
export const useVariableToConfig = (
    variableName,
    defaultValue,
    keyboardRef,
    keyboardType,
) => {
    const [variable, setVariable] = useState(
        window.bridge.config.read(variableName),
    );

    useEffect(() => {
        if (variable !== window.bridge.config.read(variableName)) {
            let newValue = variable ? Number(variable) : defaultValue;
            window.bridge.config.write(variableName, newValue);
            window.log.verbose("Change config", variableName, newValue);
        }
    }, [variable]);

    let showKeyboard = useCallback(() => {
        keyboardRef.current &&
            keyboardRef.current.showKeyboard(
                keyboardType,
                value => setVariable(value),
                variable,
            );
    }, [variable]);

    return [variable, setVariable, showKeyboard];
};

/**
 * @param {string} defaultValue
 * @param {React.MutableRefObject<import("../components/Keyboard").KeyboardType>} keyboardRef
 * @param {string} keyboardType
 * @param {number} maxLength
 * @return {[
 * variable: any,
 * React.Dispatch<React.SetStateAction<any>>,
 * ()=>void,
 * ]}
 */
export const useVariable = (
    defaultValue,
    keyboardRef,
    keyboardType,
    maxLength = 255,
) => {
    const [variable, setVariable] = useState(defaultValue || "");

    let showKeyboard = useCallback(() => {
        keyboardRef.current &&
            keyboardRef.current.showKeyboard(
                keyboardType,
                value => setVariable(String(value).substr(0, maxLength)),
                variable,
            );
    }, [variable]);

    return [variable, setVariable, showKeyboard];
};
