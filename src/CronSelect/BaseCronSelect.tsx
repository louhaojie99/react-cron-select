/**
 * @file 基于 React 的 Cron 表达式生成组件
 */
import React from 'react';

export interface BaseCronSelectProps {
  value: string;
}
const BaseCronSelect = React.memo<BaseCronSelectProps>((props) => {
  console.log('props: ', props);
  return <div></div>;
});

export default BaseCronSelect;
