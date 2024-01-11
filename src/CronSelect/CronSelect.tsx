/**
 * @file 基于 React 的 Cron 表达式生成组件
 */
import React from 'react';

export interface CronSelectProps {
  value: string;
}
const CronSelect = React.memo<CronSelectProps>((props) => {
  console.log('props: ', props);
  return <div></div>;
});

export default CronSelect;
