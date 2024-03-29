import "./ui/ToggleShowPassword.css";
import defaultEyeClosedIcon from "./assets/eye_slash.svg";
import defaultEyeOpenIcon from "./assets/eye.svg";

export default function ToggleShowPassword({ eyeOpen, eyeClosed }) {
    const item = `input[type="password"]`;

    function handlePasswordToggle(event) {
        // eslint-disable-next-line consistent-this
        const button = event.target.parentElement;
        const input = button.previousSibling;
        const inputType = input.getAttribute("type");

        if (inputType === "password") {
            input.setAttribute("type", "text");
            button.classList.remove("show-val");
            button.classList.add("hide-val");
        } else {
            input.setAttribute("type", "password");
            button.classList.add("show-val");
            button.classList.remove("hide-val");
        }
    }

    function waitFor(elementClass, callback) {
        const observer = new MutationObserver(() => {
            if (document.querySelector(elementClass)) {
                observer.disconnect();
                callback();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function handlePasswords() {
        const passwords = [...document.querySelectorAll(`input[type="password"]`)];

        for (const password of passwords) {
            const parent = password.parentNode;

            let isButtonAlreadyPresent;
            for (const child of parent.children) {
                if (child.id.startsWith("toggle-password-button")) {
                    isButtonAlreadyPresent = true;
                    break;
                }
            }
            if (isButtonAlreadyPresent) continue;

            const index = Math.floor(Math.random() * 1000000);

            parent.insertAdjacentHTML(
                "beforeend",
                `<button id="toggle-password-button-${index}" type="button" class="toggle-password-button show-val" tabindex="-1">
                        <img src=${eyeOpen ? eyeOpen.value.uri : defaultEyeOpenIcon} class="icon-hide" />
                        <img src=${eyeClosed ? eyeClosed.value.uri : defaultEyeClosedIcon} class="icon-show" />
                    </button>`
            );

            const toggleBtn = document.getElementById(`toggle-password-button-${index}`);
            toggleBtn.addEventListener("click", handlePasswordToggle);
        }
    }

    waitFor(item, () => handlePasswords());
    return null;
}
