description: 'There is a start link.',

steps: [
    {
        'HomepageComponent.metaOGDescription': function hasAppropriateCount(metaField) {
            return metaField.getAttribute('content')
            .then(function(attribute) {
                assert.ok(attribute.match(AID_COUNT + ' prestations'));
            });
        },
        'HomepageComponent.metaTwitterDescription': function hasAppropriateCount(metaField) {
            return metaField.getAttribute('content')
            .then(function(attribute) {
                assert.ok(attribute.match(AID_COUNT + ' prestations'));
            });
        },
        'HomepageComponent.valueProposition': new RegExp(AID_COUNT + ' aides'),
        'HomepageComponent.startLink': true,
    }
]
