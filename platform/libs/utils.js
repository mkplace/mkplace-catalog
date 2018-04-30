
module.exports = exports = function () {

    let _checkMandatoryObjectFields = function (mandatory_list, object) {
        // @todo make namespace names. Make recursive function. Make good name :)
        mandatory_list.forEach(function (el) {
            var fields = el.split('.');

            if (fields.length > 1) {
                if (!object[fields[0]][fields[1]]) throw Error('Field ' + el + ' is mandatory!');
            } else if (fields.length === 1) {
                if (!object[fields[0]]) throw Error('Field ' + el + ' is mandatory!');
            }
        });
    };

    return {
        checkMandatoryObjectFields: _checkMandatoryObjectFields
    }
}();