function addBuildingLabels() {
    return {
        modalId: 0,
        modalHeaderLabel: 'Yeni Bina Ekle',
        modalBodyLabel: 'Bina Adı',
        modalBodyInputSpanX: 'X Koordinatı',
        modalBodyInputSpanY: 'Y Koordinatı',
        modalFooterFirstButton: 'Kaydet',
        modalFooterSecondButton: 'İptal',
    }
}

function updateBuildingLabels() {
    return {
        modalId: 1,
        modalHeaderLabel: 'Bina Düzenle',
        modalBodyLabel: 'Bina Adı',
        modalBodyInputSpanX: 'X Koordinatı',
        modalBodyInputSpanY: 'Y Koordinatı',
        modalFooterFirstButton: 'Kaydet',
        modalFooterSecondButton: 'İptal',
    }
}

export { addBuildingLabels, updateBuildingLabels };
