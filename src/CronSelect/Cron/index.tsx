/**
 * Cron 底层组件
 */
import { useDeepCompareEffect, useSetState, useUpdateEffect } from 'ahooks';
import type { TabsProps } from 'antd';
import { Button, Card, Space, Tabs } from 'antd';
import classNames from 'classnames';
import { compact, defaultTo, map, zipObject } from 'lodash';
import React, { useMemo, useState } from 'react';
import { ContextProvider } from './Context';
import DayPane from './components/DayPane';
import HourPane from './components/HourPane';
import MinutePane from './components/MinutePane';
import MonthPane from './components/MonthPane';
import SecondPane from './components/SecondPane';
import WeekPane from './components/WeekPane';
import YearPane from './components/YearPanel';
import { prefixCls } from './constants';
import './index.less';
import type { CronFieldValues, CronProps } from './types';
import {
  CronFieldName,
  getOptionsWithDefaultValue,
  validateCronField,
} from './utils';

const { SECOND, MINUTE, HOUR, DAY, MONTH, WEEK, YEAR } = CronFieldName;

const Footer = React.memo<{ children: React.ReactNode }>(({ children }) => (
  <footer className="footer">{children}</footer>
));

const Cron = React.memo<CronProps>((props) => {
  const {
    className,
    style,
    value: propsValue,
    onOk,
    footer,
    getCronFns,
    options: propsOptions,
  } = props;

  const options = getOptionsWithDefaultValue(propsOptions);
  const { defaultTab, panelTitle, panesShow, showFooter } = options;

  const [currentTab, setCurrentTab] = useState<`${CronFieldName}`>(defaultTab);

  const [state, setState] = useSetState<CronFieldValues>({
    second: '*',
    minute: '*',
    hour: '*',
    day: '*',
    month: '*',
    week: '?',
    year: '*',
  });

  const { second, minute, hour, day, month, week, year } = state;

  const finalValue = useMemo(
    () => [second, minute, hour, day, month, week, year].join(' '),
    [second, minute, hour, day, month, week, year],
  );

  const parseValueToView = async () => {
    if (!propsValue) return {};

    const cronFields = [SECOND, MINUTE, HOUR, DAY, MONTH, WEEK, YEAR];
    const defaults = ['*', '*', '*', '*', '*', '?', '*'];
    const values = propsValue.split(' ');

    const validatedValues = map(values, (val, index) =>
      validateCronField(val, cronFields[index]) ? val : defaults[index],
    );

    // 处理 week 字段的特殊情况，如果 day 字段不是 '*'，week 字段应为 '?'
    if (validatedValues[3] !== '*' && validatedValues[5] === '*') {
      validatedValues[5] = '?';
    }

    const result = zipObject(cronFields, validatedValues);

    setState(result as CronFieldValues);

    return { propsValue, ...result };
  };

  useUpdateEffect(() => {
    getCronFns?.({
      onParse: parseValueToView,
      getValue: () => finalValue,
    });
  }, [finalValue]);

  useDeepCompareEffect(() => {
    parseValueToView();
  }, [propsValue]);

  const handleTabsChange: TabsProps['onChange'] = (activeKey) => {
    setCurrentTab(activeKey as `${CronFieldName}`);
  };

  const handleChange = (value: string, type: `${CronFieldName}`) => {
    if (type === 'day') {
      const values = value !== '?' ? { week: '?' } : { week };
      setState({
        day: value,
        week: values.week,
      });
    }

    if (type === 'week') {
      const values = value !== '?' ? { day: '?' } : { day };
      setState({
        week: value,
        day: values.day,
      });
    }

    const newValue = {
      [type]: value,
    } as CronFieldValues;

    setState(newValue);
  };

  const handleGenerate = () => {
    onOk?.(finalValue);
  };

  const renderDefaultFooter = () => {
    if (!showFooter) return null;
    return (
      <Space>
        <Button type="default" onClick={parseValueToView}>
          解析到UI
        </Button>
        <Button type="primary" onClick={handleGenerate}>
          生成
        </Button>
      </Space>
    );
  };

  const renderPane = (
    Component: React.ComponentType<any>,
    v: string | undefined,
    key: `${CronFieldName}`,
  ) => (
    <Component
      value={v}
      onChange={(v: string) => handleChange(v, key)}
      key={key}
    />
  );

  const getTabItems = (): TabsProps['items'] => {
    const items: TabsProps['items'] = compact([
      panesShow.second && {
        label: '秒',
        key: SECOND,
        value: SECOND,
        children: renderPane(SecondPane, second, SECOND),
      },
      panesShow.minute && {
        label: '分',
        key: MINUTE,
        value: MINUTE,
        children: renderPane(MinutePane, minute, MINUTE),
      },
      panesShow.hour && {
        label: '时',
        key: HOUR,
        value: HOUR,
        children: renderPane(HourPane, hour, HOUR),
      },
      panesShow.day && {
        label: '日',
        key: DAY,
        value: DAY,
        children: renderPane(DayPane, day, DAY),
      },
      panesShow.month && {
        label: '月',
        key: MONTH,
        value: MONTH,
        children: renderPane(MonthPane, month, MONTH),
      },
      panesShow.week && {
        label: '周',
        key: WEEK,
        value: WEEK,
        children: renderPane(WeekPane, week, WEEK),
      },
      panesShow.year && {
        label: '年',
        key: YEAR,
        value: YEAR,
        children: renderPane(YearPane, year, YEAR),
      },
    ]);
    return items;
  };

  return (
    <Card
      className={classNames(prefixCls, className)}
      style={defaultTo(style, { width: 630 })}
      bodyStyle={{ padding: '4px 24px 0' }}
      title={panelTitle}
    >
      {/* 配置面板选项 */}
      <Tabs
        activeKey={currentTab}
        items={getTabItems()}
        onChange={handleTabsChange}
      />

      {/* 配置面板页脚 */}
      <Footer>{footer ? footer : renderDefaultFooter()}</Footer>
    </Card>
  );
});

const withContextComponentWrapper = (props: CronProps) => (
  // options 配置注入 Context 中共享到上下文, 方便后续组件维护
  // 根组件直接消费 props => options 即可, Context 中的数据主要应用于 Child Compoennt 中
  <ContextProvider value={props?.options}>
    <Cron {...props} />
  </ContextProvider>
);
withContextComponentWrapper.displayName = 'Cron';

export default withContextComponentWrapper;
