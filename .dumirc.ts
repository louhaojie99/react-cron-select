import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'react',
    socialLinks: {
      github: 'https://github.com/louhaojie99/react-cron-select',
    },
    footer: false,
  },
  logo: false,
  locales: [
    { id: 'zh-CN', name: '中文' },
    { id: 'en-US', name: 'English' },
  ],
  /**
   * 部署到 GitHubPage 的一些配置
   * 配置可见: https://d.umijs.org/guide/faq#%E9%9D%9E%E6%A0%B9%E7%9B%AE%E5%BD%95%E9%83%A8%E7%BD%B2
   */
  base: '/react-cron-select/',
  publicPath: '/react-cron-select/',
});
