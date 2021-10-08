import SimpleKeyboard from "simple-keyboard";
import React, {
    forwardRef,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { randomStr } from "../utils/str";

const KeyboardLayout = {
    default: [
        "q w e r t y u i o p {bksp}",
        "{lock} a s d f g h j k l {enter}",
        "{shift} z x c v b n m ' {shift}",
        "{space}",
    ],
    shift: [
        "Q W E R T Y U I O P {bksp}",
        "A S D F G H J K L",
        "Z X C V B N M {enter}",
        "{space}",
    ],
    number: ["1 2 3", "4 5 6", "7 8 9", "{bksp} 0 {enter}"],
};

const KeyboardDisplay = {
    "{bksp}": "⌫",
    "{enter}": "OK",
    "{shift}": "⇪",
    "{lock}": "⇧",
    "{space}": "Spasi",
};

/**
 * @typedef {{
 * showKeyboard: (layout: "default" | "shift" | "number", onChangeValue: (value: string) => void, currentValue: string);
 * hideKeyboard: () => void;
 * }} KeyboardType
 *
 * @type {React.ForwardRefRenderFunction<KeyboardType, {
 * onShow: () => void;
 * onHide: () => void;
 * }>}
 */
const KeyboardComponent = ({ onShow, onHide }, ref) => {
    let uniqueName = useRef(
        randomStr(6, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"),
    ).current;
    /**
     * @type {import("react").MutableRefObject<HTMLDivElement>}
     */
    let keyboardDivRef = useRef();
    /**
     * @type {import("react").MutableRefObject<SimpleKeyboard>}
     */
    let keyboardRef = useRef();
    let [isKeyboardShown, setShowKeyboard] = useState(false);
    let [layout, setLayout] = useState("default");
    let onChangeValueUser = useRef(null);

    let onKeyPressHandle = useRef(value => {
        if (value === "{enter}") {
            setShowKeyboard(false);
        }
    }).current;

    let onChangeHandle = useRef(value => {
        onChangeValueUser.current && onChangeValueUser.current(value);
    }).current;

    useImperativeHandle(
        ref,
        () => ({
            showKeyboard: (layout, onChangeValue, currentValue) => {
                onChangeValueUser.current = onChangeValue;
                keyboardRef.current &&
                    keyboardRef.current.setInput(String(currentValue));
                setLayout(layout);
                setShowKeyboard(true);
                if (isKeyboardShown && onShow) {
                    onShow();
                }
            },
            hideKeyboard: () => {
                setShowKeyboard(false);
            },
        }),
        [isKeyboardShown, onShow],
    );

    useLayoutEffect(() => {
        if (isKeyboardShown) {
            onShow && onShow();
        } else {
            onHide && onHide();
        }
    }, [isKeyboardShown]);

    useLayoutEffect(() => {
        keyboardRef.current = new SimpleKeyboard(uniqueName);
    }, []);

    useLayoutEffect(() => {
        keyboardRef.current &&
            keyboardRef.current.setOptions({
                buttonTheme: [
                    {
                        class: "spaceBtn",
                        buttons: "{space}",
                    },
                ],
                maxLength: 250,
                display: KeyboardDisplay,
                layout: KeyboardLayout,
                layoutName: layout || "default",
                onChange: onChangeHandle,
                onKeyPress: onKeyPressHandle,
                theme:
                    "simple-keyboard hg-theme-default" +
                    (layout === "number" ? " keyboard-tall-button" : ""),
            });
    });

    useLayoutEffect(() => {
        let f = e => {
            if (
                !keyboardDivRef.current ||
                !keyboardDivRef.current.contains(e.target)
            ) {
                setShowKeyboard(false);
            }
        };
        window.addEventListener("mousedown", f);
        return () => {
            window.removeEventListener("mousedown", f);
        };
    }, []);

    return createPortal(
        <div
            ref={keyboardDivRef}
            className={
                (isKeyboardShown
                    ? "transition duration-300 ease-out opacity-100 transform translate-y-0"
                    : "pointer-events-none transition duration-200 ease-in opacity-0 transform translate-y-6") +
                " fixed w-full left-0 bottom-0 px-4 pb-8 pt-3 bg-brand-keyboard z-30"
            }>
            <div className={uniqueName} />
        </div>,
        document.getElementsByTagName("body")[0],
    );
};

export const Keyboard = forwardRef(KeyboardComponent);
