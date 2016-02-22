export const SINGLE_MATCH_INSEE_CODE = '75111';
export function fetchWithSingleMatch() {
    return Promise.resolve({
        json: () =>[{"codeInsee":SINGLE_MATCH_INSEE_CODE,"nomCommune":"PARIS 11","codePostal":"75011","libelleAcheminement":"PARIS"}],
        ok: true,
        status: 200,
    });
}

export const MULTIPLE_MATCHES = [{"codeInsee":"09013","nomCommune":"ARABAUX","codePostal":"09000","libelleAcheminement":"ARABAUX"},{"codeInsee":"09044","nomCommune":"BAULOU","codePostal":"09000","libelleAcheminement":"BAULOU"},{"codeInsee":"09049","nomCommune":"BENAC","codePostal":"09000","libelleAcheminement":"BENAC"},{"codeInsee":"09063","nomCommune":"LE BOSC","codePostal":"09000","libelleAcheminement":"LE BOSC"},{"codeInsee":"09066","nomCommune":"BRASSAC","codePostal":"09000","libelleAcheminement":"BRASSAC"},{"codeInsee":"09068","nomCommune":"BURRET","codePostal":"09000","libelleAcheminement":"BURRET"},{"codeInsee":"09093","nomCommune":"CELLES","codePostal":"09000","libelleAcheminement":"CELLES"},{"codeInsee":"09099","nomCommune":"COS","codePostal":"09000","libelleAcheminement":"COS"},{"codeInsee":"09121","nomCommune":"FERRIERES SUR ARIEGE","codePostal":"09000","libelleAcheminement":"FERRIERES SUR ARIEGE"},{"codeInsee":"09122","nomCommune":"FOIX","codePostal":"09000","libelleAcheminement":"FOIX"},{"codeInsee":"09130","nomCommune":"GANAC","codePostal":"09000","libelleAcheminement":"GANAC"},{"codeInsee":"09138","nomCommune":"L HERM","codePostal":"09000","libelleAcheminement":"L HERM"},{"codeInsee":"09174","nomCommune":"LOUBIERES","codePostal":"09000","libelleAcheminement":"LOUBIERES"},{"codeInsee":"09210","nomCommune":"MONTOULIEU","codePostal":"09000","libelleAcheminement":"MONTOULIEU"},{"codeInsee":"09234","nomCommune":"PRADIERES","codePostal":"09000","libelleAcheminement":"PRADIERES"},{"codeInsee":"09236","nomCommune":"PRAYOLS","codePostal":"09000","libelleAcheminement":"PRAYOLS"},{"codeInsee":"09264","nomCommune":"ST JEAN DE VERGES","codePostal":"09000","libelleAcheminement":"ST JEAN DE VERGES"},{"codeInsee":"09269","nomCommune":"ST MARTIN DE CARALP","codePostal":"09000","libelleAcheminement":"ST MARTIN DE CARALP"},{"codeInsee":"09272","nomCommune":"ST PAUL DE JARRAT","codePostal":"09000","libelleAcheminement":"ST PAUL DE JARRAT"},{"codeInsee":"09273","nomCommune":"ST PIERRE DE RIVIERE","codePostal":"09000","libelleAcheminement":"ST PIERRE DE RIVIERE"},{"codeInsee":"09293","nomCommune":"SERRES SUR ARGET","codePostal":"09000","libelleAcheminement":"SERRES SUR ARGET"},{"codeInsee":"09300","nomCommune":"SOULA","codePostal":"09000","libelleAcheminement":"SOULA"},{"codeInsee":"09329","nomCommune":"VERNAJOUL","codePostal":"09000","libelleAcheminement":"VERNAJOUL"}];
export function fetchWithMultipleMatches() {
    return Promise.resolve({
        json: () => MULTIPLE_MATCHES,
        ok: true,
        status: 200,
    });
}

export function fetchWithNoMatch() {
    return Promise.resolve({
        json: () => { throw new Error('Pretending to not be parsable') },
        ok: false,
        status: 404,
        statusText: 'Not found',
    });
}

export function fetchWithNetworkError() {
    return Promise.reject({ message: 'Pretending that network is down' });
}
