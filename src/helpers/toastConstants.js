const SUCCCESS_ADD = (messageType) => {
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

const SUCCCESS_UPDATE = (messageType) => {
    return import.meta.env.VITE_APP_LANG === 'TR' ?
        {
            title: 'Başarılı',
            message: `${messageType} başarıyla düzenlendi`,
            type: 'success'
        }
        :
        {
            title: 'Success',
            message: `${messageType} updated successfully`,
            type: 'success'
        }
}

const SUCCCESS_DELETE = (messageType) => {
    return import.meta.env.VITE_APP_LANG === 'TR' ?
        {
            title: 'Başarılı',
            message: `${messageType} başarıyla silindi`,
            type: 'success'
        }
        :
        {
            title: 'Success',
            message: `${messageType} deleted successfully`,
            type: 'success'
        }
}


const ERROR_ADD = (messageType) => {
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

const ERROR_UPDATE = (messageType) => {
    return import.meta.env.VITE_APP_LANG === 'TR' ?
        {
            title: 'Hata',
            message: `${messageType} düzenlenirken bir hata oluştu`,
            type: 'error'
        }
        :
        {
            title: 'Error',
            message: `An error occurred while updating ${messageType}`,
            type: 'error'
        }
}

const ERROR_DELETE = (messageType) => {
    return import.meta.env.VITE_APP_LANG === 'TR' ?
        {
            title: 'Hata',
            message: `${messageType} silinirken bir hata oluştu`,
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
    SUCCCESS_ADD,
    SUCCCESS_UPDATE,
    SUCCCESS_DELETE,
    ERROR_ADD,
    ERROR_UPDATE,
    ERROR_DELETE
}

export default toastMessages;