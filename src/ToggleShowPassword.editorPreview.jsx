import { createElement } from "react";
import defaultEyeOpenIcon from "./assets/eye.svg";

export function preview({ eyeOpen }) {
    return (
        <div className="toggle-password-button-preview">
            Toggle show password
            <img src={eyeOpen ? eyeOpen : defaultEyeOpenIcon} width={24} height={24} />
        </div>
    );
}

export function getPreviewCss() {
    return require("./ui/ToggleShowPassword.css");
}
