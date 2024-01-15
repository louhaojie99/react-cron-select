/**
 * @file 基于 Cron 封装的基础组件
 */
import { useControllableValue } from 'ahooks';
import { Button, Space } from 'antd';
import classNames from 'classnames';
import { defaultTo } from 'lodash';
import React, { useCallback, useRef } from 'react';
import Cron from './Cron';
import type { CronFns } from './Cron/types';
import type { BaseCronSelectProps } from './types';

const BaseCronSelect = React.memo<BaseCronSelectProps>((props) => {
  const { className, style, defaultValue, onClose, ...restProps } = props;
  const cronRef = useRef<CronFns | null>(null);
  const [value, setValue] = useControllableValue<string>(props, {
    defaultValue,
  });

  const handleOk = useCallback(() => {
    if (cronRef.current) {
      const newValue = cronRef.current.getValue();
      setValue(newValue);
      props.onChange?.(newValue);
    }
  }, [setValue, props.onChange]);

  const getCronFns: BaseCronSelectProps['getCronFns'] = (fns) => {
    cronRef.current = fns;
  };

  const footerContent = () => (
    <Space>
      <Button type="default" onClick={onClose}>
        关闭
      </Button>
      <Button type="primary" onClick={handleOk}>
        确认
      </Button>
    </Space>
  );

  return (
    <div className={classNames(className)} style={defaultTo(style, {})}>
      <Cron
        {...restProps}
        value={value}
        getCronFns={getCronFns}
        footer={footerContent()}
      />
    </div>
  );
});

export default BaseCronSelect;
