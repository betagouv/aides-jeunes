var { Step } = require('./steps')
var { generateBlocks } = require('./blocks')

function processBlock({journey, subject, situation, isActive}, b) {
    if (b instanceof Step) {
        b.isActive = isActive
        journey.push(b)
    } else if (typeof(b) == 'string') {
        console.warn(`string step should no longer be used: ${b}`)
        journey.push({isActive, path: b})
    } else {
        if (!b.steps) {
            throw Error('' + b + ' (' + (b instanceof Array ? 'array' : '?') + ')')
        }
        let blockSubject = b.subject ? b.subject(subject, situation) : (subject || situation)
        const localActive = isActive && (!b.isActive || (blockSubject && b.isActive(blockSubject, situation)))
        b.steps.forEach(s => processBlock({journey, subject: blockSubject, situation, isActive: localActive}, s))
    }
}

function generateJourney(situation) {
    const blocks = generateBlocks(situation)

    function processBlocks({situation}) {
        let journey = []
        blocks.forEach(b => {
            processBlock({journey, subject: situation, situation, isActive: true}, b)
        })
        return journey
    }
    try {
        return processBlocks({situation})
    } catch (e) {
        console.log('error', e)
    }
}

function generateAllSteps(situation) {
    const fullSteps = generateJourney(situation)
    fullSteps.pop()
    let lastChapter
    return fullSteps.map((s) => {
        if (s.chapter)
            lastChapter = s.chapter
        else
            s.chapter = lastChapter
        return s
    })
}


module.exports = {
    generateAllSteps
}
