success = (result) => {
    return {
        status: 'success',
        result: result
    }
}

error = (message) => {
    return {
        status: 'error',
        message: message
    }
}
exports.isErr = (err) => {
    return err instanceof Error
}

exports.checkAndChange = (obj) => {
    if (this.isErr(obj)) {
        return this.error(obj.message)
    } else {
        return this.success(obj)
    }
}

/* 
    FUNCTIONS BEFORE TEST BDD
getIndex = (id,array) => {

    for (let index = 0; index < array.length; index++) {

        if (array[index].id == id) {
            return index
        }

    }
    return 'Wrong id'
}

createId = (array) => {
    return array[array.length - 1].id + 1
} */

//exports.getIndex = getIndex
exports.success = success
exports.error = error
//exports.createId = createId