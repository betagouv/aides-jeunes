export default function updateRecap(state) {
    document.querySelector('#recap textarea').value = JSON.stringify(state.openfiscaSituation);
    document.querySelector('#recap pre').innerHTML = JSON.stringify(state.additionalInformation);
}
