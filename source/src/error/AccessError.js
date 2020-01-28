/**
 * Error that gets called whenever the user does not has the right permissions set for the application.
 */
class AccessError extends Error {
    constructor(...args) {
        super(...args);

        this.message = "Access file is not correct";
    }
}

export default AccessError;