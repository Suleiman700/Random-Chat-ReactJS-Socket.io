
class ValidateData {
    constructor() {
        console.log('[Info] ValidateData class loaded');
    }

    /**
     * Check if name is valid upon join
     * @param _name {String}
     */
    check_name_upon_join(_name) {
        let valid = true

        if (_name === '') {
            valid = false
        }

        return valid
    }
}

const ValidateData_C = new ValidateData()
module.exports = ValidateData_C
