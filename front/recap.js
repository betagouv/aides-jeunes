export default function updateRecap(state) {
    document.getElementById('situation').value = JSON.stringify(state.openfiscaSituation);
}
