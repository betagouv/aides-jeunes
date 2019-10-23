import { createLocalVue, shallowMount } from '@vue/test-utils'
import CommuneInput from '@/components/CommuneInput.vue'
jest.mock('axios')

import AsyncComputed from 'vue-async-computed'

const localVue = createLocalVue()
localVue.use(AsyncComputed)

describe('CommuneInput.vue', () => {
  xit('fetch communes asynchronously', (done) => {
    let menage = {
      code_postal: '75019'
    }

    const wrapper = shallowMount(CommuneInput, {
      localVue,
      propsData: {
        menage,
      }
    })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('#postal-code').element.value).toMatch(menage.code_postal)
      expect(wrapper.vm.communes.length).toBeTruthy()
      done()
    })
  })
})
