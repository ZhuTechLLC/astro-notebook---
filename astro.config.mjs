import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
  markdown: {
    // 允许HTML在Markdown中渲染
    allowHTML: true,
    // 配置remark和rehype插件
    remarkPlugins: [],
    rehypePlugins: [],
    // 代码高亮配置
    shikiConfig: {
      theme: {
        light: 'github-light',
        dark: 'github-dark'
      },
      wrap: true
    }
  }
});