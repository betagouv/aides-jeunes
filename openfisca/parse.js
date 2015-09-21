import AIDES from '../config/aides';


export function getGivenAides(situation) {
    return [];
}

export function reverseMap(openFiscaResponse, situation) {
    let computed = openFiscaResponse.value[0].familles[0],
        result = {};

    return result;
};

export function toOpenFiscaPeriod(date) {
    return moment(date).format('YYYY-MM');
}
