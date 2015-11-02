import AIDES from '../config/aides';


export function alreadyHasAide(aideId, situation) {
    let declaredResources = situation.scenarios[0].test_case.familles[0];  // navigate OpenFisca structure

    for (let period in declaredResources[aideId])
        if (declaredResources[aideId][period])
            return true;
}

export function getRequestedPeriod(situation) {
    return situation.scenarios[0].period  // navigate OpenFisca structure
                    .match(/[\d-]+/)[0];  // could be formatted as 'month:2015-01', and we just want '2015-01'
}

export function reverseMap(openFiscaResponse, situation) {
    let computed = openFiscaResponse.value[0].familles[0],
        period = getRequestedPeriod(situation),
        result = {};

    for (let aideId in AIDES) {
        if (alreadyHasAide(aideId, situation))
            continue;

        let value = computed[aideId] && computed[aideId][period];

        if (value)
            result[aideId] = value;
    }

    return result;
}
