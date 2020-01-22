import {toast} from "react-toastify";
import React from "react";
import "./css/Toasts.scss";


export function infoToast(string) {
    toast(<p>{string} </p>, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        className: 'infoToast-background',
        progressClassName: 'infoToast-progress-bar',
    });


}

export function errorToast(string) {
    return toast.error(<p>{"❌ " + string} </p>, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true
    });
}

export function succesToast(string) {
    return toast.success(<p>{"✔️ " + string} </p>, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true
    });
}

export function waitToast(string) {
    return toast.info(<p>{"⌛ " + string} </p>, {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        className: 'infoToast-background',
    });
}

export function updateToSuccesToast(toastUpdate, text){
    toast.update(toastUpdate, {type: toast.TYPE.SUCCESS,
        autoClose : 3000,
        render : <p>{"✔️ " + text} </p>
    });
}

export function updateToErrorToast(toastUpdate, text){
    toast.update(toastUpdate, {type: toast.TYPE.ERROR,
        autoClose : 3000,
        render :<p>{"❌ " + text} </p>
    });
}

