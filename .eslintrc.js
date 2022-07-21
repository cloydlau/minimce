/**
 * 搭建 eslint + prettier：
 *   1. pnpm add lint-staged eslint @antfu/eslint-config -D
 *   2. npx husky add .husky/pre-commit "npx lint-staged"
 */

module.exports = {
  extends: '@antfu',
  rules: {
    'vue/component-tags-order': ['error', {
      order: [['script', 'template'], 'style'],
    }],
  },
}
