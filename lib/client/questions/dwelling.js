exports.underMortgage = {
    type: 'yesno',
    label: 'Remboursez-vous un emprunt financer votre logement ?'
};

exports.ownedByOccupantFamily = {
    type: 'yesno',
    label: 'Un membre de votre famille est-il le propriétaire de votre logement ?'
};

exports.rent = {
    type: 'number',
    label: 'À combien s\'élève votre loyer (ou votre mensualité d\'emprunt) ?',
    defaultValue: 0
};

exports.postalCode = {
    type: 'number',
    label: 'Quel est le code postal de votre lieu de résidence ?'
};
