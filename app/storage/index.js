import AsyncStorage from '@react-native-async-storage/async-storage';

export const get = async (key, isJSON = true) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);

        if (isJSON == true) {
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        }

        return jsonValue;
    } catch (e) {
        // console.log(`Storage get error message: ${  e.message}`);
    }

    return null;
};

export const set = async (key, value) => {
    try {
        return await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        // console.log(`AsyncStorage#setItem error: ${  error.message}`);
    }

    return null;
};

export const store = async (key, value, isJSON = true) => {
    try {
        if (isJSON == true) {
            value = JSON.stringify(value);
        }

        await AsyncStorage.setItem(key, value);
        return true;
    } catch (e) {
        // console.log(`Storage store error message: ${  e.message}`);
    }

    return null;
};

export const remove = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (e) {
        // console.log(`Storage remove error message: ${  e.message}`);
    }

    return null;
};

export const clear = async () => {
    try {
        await AsyncStorage.clear();
        return true;
    } catch (e) {
        // console.log(`Storage clear error message: ${  e.message}`);
    }

    return null;
};

export const checkAndClearOnFirstRun = async () => {
    try {
        const firstRun = await AsyncStorage.getItem('firstRun');
        if (!firstRun) {
            await clear();
            await AsyncStorage.setItem('firstRun', 'true');
        } else {
        }
    } catch (error) {
        // console.log({ error });
    }

};
