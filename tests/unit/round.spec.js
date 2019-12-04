import { round } from '@/../backend/lib/mes-aides'

describe('round', function() {
    it('should not round for type "bool"', function() {
        expect(round(true, { type: 'bool' })).toEqual(true)
    })

    it('should floor for unit "%"', function() {
        expect(round(10.25, { unit: '%' })).toEqual(10)
        expect(round(10.2499, { unit: '%', floorAt: 0.01 })).toEqual(10.24)
    })

    it('should floor to lower 10s', function() {
        expect(round(132.17, { floorAt: 10 })).toEqual(130)
        expect(round(135, { floorAt: 10 })).toEqual(130)
        expect(round(139.47, { floorAt: 10 })).toEqual(130)
        expect(round(139.7, { floorAt: 10 })).toEqual(130)
    })

    it('should floor to lower cent', function() {
        expect(round(132.1789, { floorAt: 0.01 })).toBeCloseTo(132.17)
        expect(round(135, { floorAt: 0.01 })).toEqual(135)
        expect(round(139.0001, { floorAt: 0.01 })).toEqual(139.00)
    })

    it('should floor to lower integer by default', function() {
        expect(round(132.17, {})).toEqual(132)
        expect(round(135, {})).toEqual(135)
        expect(round(139.47, {})).toEqual(139)
    })
})
