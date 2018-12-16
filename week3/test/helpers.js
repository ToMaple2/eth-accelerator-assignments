// Helper function to help verify expected exceptions being thrown in tests
expectThrow = async (promise) => {
    try {
        await promise;
    } catch (err) {
        return;
    }
    assert(false, 'Expected throw not received');
}

expectEvent = async (promise, event) => {
    try {
        let result = await promise;
        for (var i = 0; i < result.logs.length; i++) {
            var log = result.logs[i];
            if (log.event === event) {
                return; // Found the event, return!
            }
        }
    } catch (err) {
        assert(false, 'Exception thrown when not expected');
    }
    assert(false, "Expected " + event + " event not fired");
}

module.exports = {
    expectThrow,
    expectEvent
}
