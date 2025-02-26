import MarkdownIt, { type Options } from 'markdown-it'
import hljs from './hljsConfig'
import codeCopyPlugins from './codeCopyPlugins'

/**
 * 初始化 MarkdownIt
 * @param options MarkdownIt option 参数
 * @returns
 */
function MarkdownItRender(options: Options = {}) {
  // Options 默认值
  const defaultOptions: Options = {
    html: true,
    linkify: true,
    breaks: true,
    xhtmlOut: true,
    typographer: true,
    highlight: (str, lang): any => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
        } catch (e: any) {
          throw new Error(e)
        }
      }
      return `<pre><code class="hljs language-${lang}">${md.utils.escapeHtml(str)}</code></pre>`
    }
  }

  const MegertOptions = {
    ...defaultOptions,
    ...options
  }
  const md = new MarkdownIt(MegertOptions).use(codeCopyPlugins).disable('image')
  return md
}

export default MarkdownItRender
