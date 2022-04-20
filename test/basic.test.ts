import { mount } from '@vue/test-utils'
import MiniMCE from '../src/index.ts'

test('mount component', async() => {
  const wrapper = mount(MiniMCE, {
    props: {
      count: 4,
    },
  })

  console.log(wrapper)

  /*expect(wrapper.text()).toContain('4 x 2 = 8')
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.get('button').trigger('click')

  expect(wrapper.text()).toContain('4 x 3 = 12')

  await wrapper.get('button').trigger('click')

  expect(wrapper.text()).toContain('4 x 4 = 16')*/
})
