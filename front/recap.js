export default function updateRecap(state) {
    document.querySelector('#recap textarea').value = JSON.stringify(state.openfiscaSituation);
}
