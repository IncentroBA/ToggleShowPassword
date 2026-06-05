import "./ui/ToggleShowPassword.css";
import defaultEyeClosedIcon from "./assets/eye_slash.svg";
import defaultEyeOpenIcon from "./assets/eye.svg";

export default function ToggleShowPassword({ eyeOpen, eyeClosed }) {
    const item = `input[type="password"]`;
    const visibilityObservers = new WeakMap();

    const observeInputType = (input, button) => {
        if (visibilityObservers.has(input)) {
            return;
        }

        const observer = new MutationObserver(() => {
            if (button.dataset.visible === "true" && input.type === "password") {
                input.type = "text";
            }
        });

        observer.observe(input, { attributes: true, attributeFilter: ["type"] });
        visibilityObservers.set(input, observer);
    }

    const restoreInputSelection = (input, start, end) => {
        const hasExplicitSelection = Number.isInteger(start) && Number.isInteger(end) && (start !== 0 || end !== 0);
        const position = hasExplicitSelection ? start : input.value.length;
        const selectionEnd = hasExplicitSelection ? end : position;
        input.setSelectionRange(position, selectionEnd);
    }

    const showInputText = (input) => {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        input.type = "text";
        restoreInputSelection(input, start, end);
    }

    const handlePasswordToggle = (event) => {
        const button = event.currentTarget || event.target.parentElement;
        const input = button.previousElementSibling;
        if (!input) {
            return;
        }

        const isHidden = input.type === "password";
        if (isHidden) {
            showInputText(input);
        } else {
            input.type = "password";
        }

        button.dataset.visible = String(isHidden);
        button.classList.toggle("show-val", !isHidden);
        button.classList.toggle("hide-val", isHidden);

        if (isHidden) {
            input.focus();
            observeInputType(input, button);
        }
    }

    const waitFor = (elementClass, callback) => {
        const observer = new MutationObserver(() => {
            if (document.querySelector(elementClass)) {
                observer.disconnect();
                callback();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    const handlePasswords = () => {
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
            toggleBtn.dataset.visible = "false";
            toggleBtn.addEventListener("click", handlePasswordToggle);

            const inputEl = toggleBtn.previousElementSibling;
            if (inputEl) {
                inputEl.addEventListener("focus", () => {
                    if (toggleBtn.dataset.visible === "true") {
                        setTimeout(() => showInputText(inputEl), 0);
                    }
                });
                inputEl.addEventListener("mouseup", () => {
                    if (toggleBtn.dataset.visible === "true") {
                        setTimeout(() => showInputText(inputEl), 0);
                    }
                });
                observeInputType(inputEl, toggleBtn);
            }
        }
    }

    waitFor(item, () => handlePasswords());
    return null;
}
