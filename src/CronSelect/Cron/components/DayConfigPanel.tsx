// TODO: 开源社区Cory过来的，待重构
// @ts-nocheck
import type { InputNumberProps } from 'antd';
import { Checkbox, InputNumber, Radio, Space } from 'antd';
import { isEmpty, range } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { BaseConfigProps } from '../types';

const commonInputNumberProps: InputNumberProps = {
  size: 'small',
  min: 1,
  max: 31,
  style: { width: 100 },
};

const DayConfigPanel = React.memo<BaseConfigProps>((props) => {
  const { value, onChange } = props;
  const [currentRadioValue, setCurrentRadioValue] = useState(1);
  const [fromValue, setFromValue] = useState(1);
  const [toValue, setToValue] = useState(10);
  const [offsetFrom, setOffsetFrom] = useState(1);
  const [offset, setOffset] = useState(1);
  const [selected, setSelected] = useState(['1']);

  const isFirstRender = React.useRef();
  if (isFirstRender.current !== false) {
    isFirstRender.current = true;
  }

  useEffect(() => {
    if (value === '*') {
      setCurrentRadioValue(1);
    } else if (value === '?') {
      setCurrentRadioValue(2);
    } else if (value.indexOf('-') > -1) {
      setCurrentRadioValue(3);
      const [defaultFrom, defaultTo] = value.split('-');
      setFromValue(parseInt(defaultFrom, 10));
      setToValue(parseInt(defaultTo, 10));
    } else if (value.indexOf('/') > -1) {
      setCurrentRadioValue(4);
      const [defaultOffsetFrom, defaultOffset] = value.split('/');
      setOffsetFrom(parseInt(defaultOffsetFrom, 10));
      setOffset(parseInt(defaultOffset, 10));
    } else {
      setCurrentRadioValue(5);
      setSelected(value ? value.split(',') : ['1']);
    }
  }, [value]);

  useEffect(() => {
    if (!isFirstRender.current) {
      switch (currentRadioValue) {
        case 1:
          onChange('*');
          break;
        case 2:
          onChange('?');
          break;
        case 3:
          onChange(`${fromValue}-${toValue}`);
          break;
        case 4:
          onChange(`${offsetFrom}/${offset}`);
          break;
        case 5:
          onChange(selected.join(','));
          break;
        default:
          break;
      }
    }
  }, [currentRadioValue, fromValue, toValue, offsetFrom, offset, selected]);

  const onChangeRadio = useCallback((e) => {
    setCurrentRadioValue(e.target.value);
  }, []);

  const onChangeFrom = useCallback((v) => {
    setFromValue(v || 1);
  }, []);

  const onChangeTo = useCallback((v) => {
    setToValue(v || 1);
  }, []);

  const onChangeOffsetFrom = useCallback((v) => {
    setOffsetFrom(v || 1);
  }, []);

  const onChangeOffset = useCallback((v) => {
    setOffset(v || 1);
  }, []);

  const handleCheckboxChange = (list: any | string[]) => {
    setSelected(!isEmpty(list) ? list : ['1']);
  };

  const options = useMemo(
    () =>
      range(31).map((_item, index) => ({
        label: (
          <span style={{ display: 'inline-block', width: 20 }}>{index}</span>
        ),
        value: `${index}`,
      })),
    [],
  );

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return (
    <Radio.Group value={currentRadioValue} onChange={onChangeRadio}>
      <Space direction="vertical">
        <Radio value={1}>每一日</Radio>
        <Radio value={2}>不指定</Radio>
        <Radio value={3}>
          <Space>
            <span>从</span>
            <InputNumber
              {...commonInputNumberProps}
              disabled={currentRadioValue !== 3}
              value={fromValue}
              onChange={onChangeFrom}
            />
            <span>至</span>
            <InputNumber
              {...commonInputNumberProps}
              disabled={currentRadioValue !== 3}
              value={toValue}
              onChange={onChangeTo}
            />
            <span>日，每日执行一次</span>
          </Space>
        </Radio>
        <Radio value={4}>
          <Space>
            <span>从</span>
            <InputNumber
              {...commonInputNumberProps}
              disabled={currentRadioValue !== 4}
              value={offsetFrom}
              onChange={onChangeOffsetFrom}
            />
            <span>日开始， 每</span>
            <InputNumber
              {...commonInputNumberProps}
              disabled={currentRadioValue !== 4}
              value={offset}
              onChange={onChangeOffset}
            />
            <span>日执行一次</span>
          </Space>
        </Radio>
        <Space direction="vertical">
          <Radio value={5}>指定</Radio>
          <Checkbox.Group
            value={selected}
            options={options}
            disabled={!(currentRadioValue === 5)}
            onChange={handleCheckboxChange}
          />
        </Space>
      </Space>
    </Radio.Group>
  );
});

export default DayConfigPanel;
