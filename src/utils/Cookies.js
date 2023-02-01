import Cookies from "js-cookie";

export function getCookie(key) {
    return Cookies.get(key);
}

export function setCookie(key, value) {
    Cookies.set(key, value);
}

export function deleteCookie(key) {
    Cookies.remove(key);
}
