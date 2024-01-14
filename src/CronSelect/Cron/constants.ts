import { CronFieldValues } from './types';
import { CronFieldName } from './utils';
const { SECOND, MINUTE, HOUR, DAY, MONTH, WEEK, YEAR } = CronFieldName;

export const prefixCls = 'react-cron-select';

export const DEFAULTS: CronFieldValues = {
  [SECOND]: '*',
  [MINUTE]: '*',
  [HOUR]: '*',
  [DAY]: '*',
  [MONTH]: '*',
  [WEEK]: '?',
  [YEAR]: '*',
};
