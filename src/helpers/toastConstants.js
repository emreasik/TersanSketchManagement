const SUCCCESS_TR = (messageType) => {
    return {
        title: 'Başarılı',
        message: `Yeni ${messageType} başarıyla eklendi`,
        type: 'success'
    }
}

const SUCCCESS_EN = (messageType) => {
    return {
        title: 'Success',
        message: `New ${messageType} added successfully`,
        type: 'success'
    }
}

const ERROR_TR = (messageType) => {
    return {
        title: 'Hata',
        message: `${messageType} eklenirken bir hata oluştu`,
        type: 'error'
    }
}

const ERROR_EN = (messageType) => {
    return {
        title: 'Error',
        message: `An error occurred while adding ${messageType}`,
        type: 'error'
    }
}


const toastMessages = {
    SUCCCESS_TR,
    SUCCCESS_EN,
    ERROR_TR,
    ERROR_EN
}

export default toastMessages;