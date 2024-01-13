# Cron 表达式生成器

## Cron

底层组件测试

```tsx
import React, { useState } from 'react';
import Cron from '../CronSelect/Cron';

const Demo = () => {
  const [value, setValue] = useState('');
  return (
    <div>
      <Cron value={value} onChange={setValue} />
    </div>
  );
};

export default Demo;
```

## BaseCronSelect

这是一个基础组件，可结合此组件封装一些自定义的使用场景

```tsx
import React, { useState } from 'react';
import { Space } from 'antd';
import BaseCronSelect from './BaseCronSelect';

const ShowFormValues = ({ value }: { value: string }) => (
  <Space>
    <h4>测试组件提交: </h4>
    <span>{value}</span>
  </Space>
);

const Demo = () => {
  const [value, setValue] = useState('');
  return (
    <>
      <ShowFormValues value={value} />
      <BaseCronSelect value={value} onChange={setValue} />
    </>
  );
};

export default Demo;
```

## CronSelect

基于 BaseCronSelect 封装为一个输入框形式来使用

```tsx
import React, { useState } from 'react';
import { Space } from 'antd';
import CronSelect from './CronSelect';

const ShowFormValues = ({ value }: { value: string }) => (
  <Space>
    <h4>测试组件提交: </h4>
    <span>{value}</span>
  </Space>
);

const Demo = () => {
  const [value, setValue] = useState('');
  return (
    <>
      <ShowFormValues value={value} />
      <br />
      <CronSelect
        inputProps={{ style: { width: 390 } }}
        value={value}
        onChange={setValue}
      />
    </>
  );
};

export default Demo;
```

## 在 Form 表单中如何使用

```tsx
import React, { useState } from 'react';
import { Form, Input, Button, Space } from 'antd';
import CronSelect from './CronSelect';

import type { FormProps } from 'antd';

const ShowFormValues = ({ value }: { value: string }) => (
  <Space>
    <h4>测试组件提交: </h4>
    <span>{value}</span>
  </Space>
);

const Demo = () => {
  const [form] = Form.useForm();
  const [formDataStr, setFormDataStr] = useState('{}');

  const handleReset = () => {
    form.resetFields();
  };

  const handleSubmit: FormProps['onFinish'] = (values) => {
    console.log('values: ', values, form);
    setFormDataStr(JSON.stringify(values, null, 2));
  };

  return (
    <div>
      <ShowFormValues value={formDataStr} />
      <Form form={form} onFinish={handleSubmit} autoComplete="off">
        <Form.Item
          label="Cron表达式"
          name="cron"
          rules={[{ required: true, message: '请输入!' }]}
        >
          <CronSelect
            inputProps={{ style: { width: 300 } }}
            placeholder="请输入!"
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              提交表单
            </Button>
            <Button type="default" onClick={handleReset}>
              重置表单
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Demo;
```
