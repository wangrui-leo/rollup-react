/* eslint-disable react/prop-types */
import React from 'react'
import moment from 'moment'
import {
  Input, Select, InputNumber, Checkbox, DatePicker, Cascader, Radio,
} from 'antd'

const { RangePicker } = DatePicker
const { TextArea } = Input
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group

// 接收的是一个class作为参数，返回一个class
export const addNewProps = function (WrappedComponent, newProps) {
  return class WrappingComponent extends React.Component {
    render () {
      const props = { ...this.props, ...newProps }
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <WrappedComponent {...props} />
    }
  }
}
export const formItemTypes = {
  input: ({ props }) => <Input {...props} />,
  inputEnterSearch: ({ props, onSearch }) => {
    return (<Input.Search allowClear readOnly enterButton onSearch={onSearch} {...props} />)
  },
  textArea: ({ props }) => <TextArea {...props} />,
  inputNumber: ({ props }) => <InputNumber {...props} />,
  checkbox: ({ selectOptions, props }) => {
    return (<CheckboxGroup options={selectOptions} {...props} />)
  },
  radio: ({ selectOptions, props }) => {
    return (<RadioGroup options={selectOptions} {...props} />)
  },
  datePicker: ({ props }) => {
    return (<DatePicker {...props} />)
  },
  rangePicker: ({ props }) => {
    if (!props.ranges) {
      props.ranges = {
        今天: [moment(), moment()],
        一周内: [moment().subtract(1, 'week'), moment()],
        一个月内: [moment().subtract(1, 'months'), moment()],
        最近三个月: [moment().subtract(3, 'months'), moment()],
      }
    }
    return (<RangePicker {...props} />)
  },
  cascader: ({ selectOptions, props }) => {
    return (<Cascader options={selectOptions} {...props} />)
  },
  select: ({ selectOptions, props }) => {
    return (
      <Select {...props}>
        {selectOptions.map((selectOption) => <Select.Option value={selectOption.value} key={selectOption.value}>{selectOption.text}</Select.Option>)}
      </Select>
    )
  },
}
