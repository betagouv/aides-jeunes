/**
 * Allow using "today" as min / max attributes for <input type="date">.
 */

const today = new Date().toJSON().split('T')[0];

[ 'min', 'max' ].forEach(extremity => {
    let target = document.querySelector(`input[type="date"][${extremity}="today"]`);

    if (target)
        target[extremity] = today;
});
