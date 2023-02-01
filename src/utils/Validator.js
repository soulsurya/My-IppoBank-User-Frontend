import lodash from "lodash";

export const getValue = (data, key, defaultValue) => {
    let value = lodash.get(data, key);
    if (value === undefined || value === null) {
        return defaultValue;
    }
    return value;
};

export const isEmpty = (value) => {
    return lodash.isEmpty(value)
}
