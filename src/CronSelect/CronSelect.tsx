/**
 * @file 基于 BaseCronSelect 封装的选择器（输入框 + 气泡面板）组合版
 */
import { EditOutlined } from '@ant-design/icons';
import { useControllableValue } from 'ahooks';
import { Input, Popover } from 'antd';
import React from 'react';
import BaseCronSelect from './BaseCronSelect';
import type { CronSelectProps } from './types';

const CronSelect = React.memo<CronSelectProps>((props) => {
  const { inputProps, cronSelectProps, defaultValue } = props;

  const [inputValue, setInputValue] = useControllableValue(props, {
    defaultValue,
  });

  const [visible, setVisible] = useControllableValue(props, {
    defaultValue: false,
    valuePropName: 'visible',
    trigger: 'onVisibleChange',
  });

  const handleClose = () => setVisible(false);

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
