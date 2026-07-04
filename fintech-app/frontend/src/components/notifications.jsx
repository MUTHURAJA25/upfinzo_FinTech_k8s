
import { toast } from "react-toastify";

export const showConfirmToast = (message, onConfirm, onCancel) => {
    toast(
        ({ closeToast }) => (
            <div className="d-flex flex-column gap-4">
                <p>{message}</p>
                <div className="d-flex gap-3">
                    <button className="btn btn-success btn-sm" onClick={async () => { closeToast(); onConfirm && (await onConfirm()); }}> Yes </button>
                    <button className="btn btn-danger btn-sm" onClick={() => { closeToast(); onCancel && onCancel(); }}> No </button>
                </div>
            </div>
        ),
        {
            closeOnClick: false,
            closeButton: false,
            autoClose: false,
        }
    );
};

export const showSuccess = (msg, duration = 1000) => {
    toast.success(msg, { autoClose: duration });
};

export const showError = (msg, duration = 1000) => {
    toast.error(msg, { autoClose: duration });
};

export const showInfo = (msg, duration = 1000) => {
    toast.info(msg, { autoClose: duration });
};

export const notify = {
    success: showSuccess,
    error: showError,
    info: showInfo,
    confirm: showConfirmToast,
};