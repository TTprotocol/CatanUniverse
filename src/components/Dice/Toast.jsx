import React, { useEffect, useState } from "react";
import "../../styles/Toast.css";

export default function Toast({ message, onClose }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!message) return;
        setVisible(true);
        const t = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, 2000);
        return () => clearTimeout(t);
    }, [message]);

    if (!message) return null;

    return (
        <div className={`toast ${visible ? "toast-show" : "toast-hide"}`}>
            ⚠️ {message}
        </div>
    );
}