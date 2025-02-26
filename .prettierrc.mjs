/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  // 不尾随分号
  semi: false,
  // 使用单引号
  singleQuote: true,
  // 多行逗号分割的语法中，最后一行不加逗号
  trailingComma: 'none',
  // 行尾风格，设置为auto
  endOfLine: 'auto',
  // 指定最大换行长度
  printWidth: 140,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 单个参数的箭头函数不加括号 x => x
  arrowParens: 'avoid',
  // 对象大括号内两边是否加空格 { a:0 }
  bracketSpacing: true,
  // 将 > 多行元素放在最后一行的末尾，而不是单独放在下一行 (true：放末尾，false：单独一行)
  bracketSameLine: false
}
