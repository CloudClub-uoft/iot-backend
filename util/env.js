var dotenv = require('dotenv')

exports.configure = () => {

    const result = dotenv.config()
    if (result.error) {
        throw result.error
    }    
    return 0;
};