class AccessError extends Error {
    constructor(...args) {
        super(...args);

        this.message = "Access file is not correct";
    }
}

export default AccessError;