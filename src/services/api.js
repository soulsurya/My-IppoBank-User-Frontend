import { getCookie, deleteCookie } from "./../utils/Cookies";
import { CookiesKey, StatusCode, WebsitePageLinks } from "./../services/constants";

export function makePostAPICAll(url, data, dummyAuth, skipToken = false) {
    return new Promise((resolve, reject) => {
        let headerObj = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie(CookiesKey.ippoPay)}`,
        };

        if (dummyAuth) {
            headerObj.Authorization = dummyAuth;
        }

        if (skipToken) {
            delete headerObj.Authorization;
        }

        fetch(url, {
            method: "POST",
            headers: headerObj,
            body: JSON.stringify(data),
        })
            .then((stream) => {
                console.log(stream);
                return stream.json();
            })
            .then((apiResponse) => {
                validateResponse(apiResponse);
                return resolve(apiResponse);
            })
            .catch(reject);
    });
}

export function makeGetAPICAll(url, data, skipVersion = false) {
    return new Promise((resolve, reject) => {
        const headerObj = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie(CookiesKey.ippoPay)}`,
        };

        if (skipVersion) {
            delete headerObj.version;
        }

        if (data) {
            url = new URL(url);
            url.search = new URLSearchParams(data).toString();
        }

        fetch(url, {
            method: "GET",
            headers: headerObj,
        })
            .then((stream) => {
                if (stream) {
                    return stream.json();
                }
            })
            .then((apiResponse) => {
                validateResponse(apiResponse);
                return resolve(apiResponse);
            })
            .catch(reject);
    });
}

const validateResponse = (response) => {
    checkAuthorization(response);
};

const checkAuthorization = (response) => {
    if (response && response.code === StatusCode.inValidToken) {
        deleteCookie(CookiesKey.ippoPay);
        setTimeout(() => {
            window.location.href = WebsitePageLinks.signIn;
        }, 500);
    }
}



