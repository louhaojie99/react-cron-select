// TODO: 开源社区Cory过来的，待重构
import { Checkbox, Col, InputNumber, Radio, Row } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStateContext } from '../Context';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const radioStyle = {
  display: 'block',
  paddingBottom: '6px',
};

function YearPane(props) {
  const { state } = useStateContext();
  const { minYear, maxYear } = state;

  // 初始年
  const startY = minYear || new Date().getFullYear();
  // 结束年
  const endY = maxYear || startY + 60;

  const { value, onChange } = props;
  const [currentRadio, setCurrentRadio] = useState(1);
  const [from, setFrom] = useState(startY);
  const [to, setTo] = useState(endY);
  const [offsetFrom, setOffsetFrom] = useState(startY);
  const [offset, setOffset] = useState(1);
  const [selected, setSelected] = useState([startY]);

  const isFirstRender = React.useRef();
  if (isFirstRender.current !== false) {
    isFirstRender.current = true;
  }
  // console.log(value)
  useEffect(() => {
    if (value === '*') {
      setCurrentRadio(1);
    } else if (value === '?') {
      setCurrentRadio(2);
    } else if (value.indexOf('-') > -1) {
      setCurrentRadio(3);
      const [defaultFrom, defaultTo] = value.split('-');
      setFrom(parseInt(defaultFrom, 10));
      setTo(parseInt(defaultTo, 10));
    } else if (value.indexOf('/') > -1) {
      setCurrentRadio(4);
      const [defaultOffsetFrom, defaultOffset] = value.split('/');
      setOffsetFrom(parseInt(defaultOffsetFrom, 10));
      setOffset(parseInt(defaultOffset, 10));
    } else {
      setCurrentRadio(5);
      setSelected(value ? value.split(',') : [startY]);
    }
  }, [value]);

  useEffect(() => {
    if (!isFirstRender.current) {
      switch (currentRadio) {
        case 1:
          onChange('*');
          break;
        case 2:
          onChange('?');
          break;
        case 3:
          onChange(`${from}-${to}`);
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
  }, [currentRadio, from, to, offsetFrom, offset, selected]);

  const onChangeRadio = useCallback((e) => {
    setCurrentRadio(e.target.value);
  }, []);

  const onChangeFrom = useCallback((v) => {
    setFrom(v || startY);
  }, []);

  const onChangeTo = useCallback((v) => {
    setTo(v || endY);
  }, []);

  const onChangeOffsetFrom = useCallback((v) => {
    setOffsetFrom(v || startY);
  }, []);

  const onChangeOffset = useCallback((v) => {
    setOffset(v || 1);
  }, []);

  const onChangeSelected = useCallback((v) => {
    setSelected(v.length !== 0 ? v : [startY]);
  }, []);

  const checkList = useMemo(() => {
    const disabled = currentRadio !== 5;
    const checks = [];
    for (let i = startY; i < endY; i++) {
      checks.push(
        <Col key={i} span={4}>
          <Checkbox disabled={disabled} value={i.toString()}>
            {i}
          </Checkbox>
        </Col>,
      );
    }
    return checks;
  }, [currentRadio, selected]);
  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  const aTobA = (
    <InputNumber
      disabled={currentRadio !== 3}
      min={startY}
      max={endY}
      value={from}
      size="small"
      onChange={onChangeFrom}
      style={{ width: 100 }}
    />
  );

  const aTobB = (
    <InputNumber
      disabled={currentRadio !== 3}
      min={startY}
      max={endY}
      value={to}
      size="small"
      onChange={onChangeTo}
      style={{ width: 100 }}
    />
  );

  const aStartTobA = (
    <InputNumber
      disabled={currentRadio !== 4}
      min={startY}
      max={endY}
      value={offsetFrom}
      size="small"
      onChange={onChangeOffsetFrom}
      style={{ width: 100 }}
    />
  );
  const aStartTobB = (
    <InputNumber
      disabled={currentRadio !== 4}
      min={1}
      max={10}
      value={offset}
      size="small"
      onChange={onChangeOffset}
      style={{ width: 100 }}
    />
  );

  return (
    <RadioGroup name="radiogroup" value={currentRadio} onChange={onChangeRadio}>
      <Radio style={radioStyle} value={1}>
        {'每年'}
      </Radio>

      <Radio style={radioStyle} value={2}>
        {'不指定'}
      </Radio>

      <Radio style={radioStyle} value={3}>
        <>
          从&nbsp;
          {aTobA}
          &nbsp;-&nbsp;
          {aTobB}
          &nbsp;年，每年执行一次
        </>
      </Radio>

      <Radio style={radioStyle} value={4}>
        <>
          从&nbsp;
          {aStartTobA}
          &nbsp;年开始， 每&nbsp;
          {aStartTobB}
          &nbsp;年执行一次
        </>
      </Radio>

      <Radio style={radioStyle} value={5}>
        {'指定'}
        <br />
        <CheckboxGroup value={selected} onChange={onChangeSelected}>
          <Row> {checkList}</Row>
        </CheckboxGroup>
      </Radio>
    </RadioGroup>
  );
}

export default YearPane;
