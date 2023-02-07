const SUCCCESS = (messageType) => {
    return import.meta.env.VITE_APP_LANG === 'TR' ?
    {
        title: 'Başarılı',
        message: `Yeni ${messageType} başarıyla eklendi`,
        type: 'success'
    }
    :
    {
        title: 'Success',
        message: `New ${messageType} added successfully`,
        type: 'success'
    }
}

const ERROR = (messageType) => {
    return import.meta.env.VITE_APP_LANG === 'TR' ?
    {
        title: 'Hata',
        message: `Yeni ${messageType} eklenirken bir hata oluştu`,
        type: 'error'
    }
    :
    {
        title: 'Error',
        message: `An error occurred while adding ${messageType}`,
        type: 'error'
    }
}


const toastMessages = {
    SUCCCESS,
    ERROR
}

export default toastMessages;