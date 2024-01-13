/**
 * @file Cron表达式生成组件（输入框 + 气泡弹出选择器）组合版
 */

import { EditOutlined } from '@ant-design/icons';
import { useControllableValue } from 'ahooks';
import { Input, Popover } from 'antd';
import React from 'react';
import BaseCronSelect from './BaseCronSelect';
import type { CronSelectProps } from './types';

const CronSelect = React.memo<CronSelectProps>((props) => {
  const { inputProps, cronSelectProps, defaultValue, ...restProps } = props;

  // 组件支持受控和非受控使用
  const [inputValue, setInputValue] = useControllableValue(restProps, {
    defaultValue,
  });

  const [visible, setVisible] = useControllableValue(restProps, {
    defaultValue: false,
    valuePropName: 'visible',
    trigger: 'onVisibleChange',
  });

  const handleClose = () => setVisible(false);

  // 气泡内容
  const content = (
    <BaseCronSelect
      {...cronSelectProps}
      value={inputValue}
      onChange={(value) => {
        setInputValue(value);
        setVisible(false);
      }}
      onClose={handleClose}
    />
  );

  return (
    <Popover content={content} trigger="click" open={visible}>
      <Input
        {...inputProps}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={'请选择'}
        addonAfter={<EditOutlined onClick={() => setVisible(!visible)} />}
      />
    </Popover>
  );
});

export default CronSelect;
