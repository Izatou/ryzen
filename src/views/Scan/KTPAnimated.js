import React, { useEffect, useState } from "react";
import KtpImage from "../../assets/img-ektp.png";

export default () => {
    let [isShown, setIsShown] = useState(false);

    // useEffect(() => {
    //     let int = setInterval(() => {
    //         setIsShown(a => !a);
    //     }, 2000);

    //     return () => {
    //         clearInterval(int);
    //     }
    // }, []);

    return (
        <div
            className={(isShown ? "transition duration-1000 ease-out opacity-0 transform translate-y-6" : "transition duration-1000 ease-in opacity-100 transform translate-y-0")}
        >
            <img
                className="w-72 shadow-lg"
                src={KtpImage}
                alt=""
            />
        </div>
    )
}