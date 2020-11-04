/* eslint-disable no-undef */
import React from 'react'
// import PropTypes from 'prop-types'
import {
  Form, Row, Input, Select, Col, Checkbox, Radio, Cascader, InputNumber, DatePicker, Divider, Button,
} from 'antd'
import moment from 'moment'
// import { FTitle } from 'components'
// eslint-disable-next-line import/no-cycle
import inputEnterSearchModal from './inputEnterSearch'
// import formFocus from './formFocus'

const { RangePicker } = DatePicker
const { TextArea } = Input
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
}

const listProps = {
  xs: { span: 24 },
  sm: { span: 12 },
  md: { span: 8 },
  lg: { span: 8 },
  xl: { span: 8 },
}
/**
 *
 *
 * @class BaseForm
 * @extends {React.PureComponent}
 * @param getChild 父组件获取子组件实例方法
 * @param onRef 父组件获取子组件实例方法
 * @param childInputs 子组件的类型实例（添加一些特有的方法和属性）
 * @param searchColums 组件遍历的数组
 * let searchColums = [
    {
      title: '厂商代码',
      dataIndex: 'orgCde',
      searchType: 'input',
    },
    {
      title: '厂商名称',
      dataIndex: 'orgName',
      searchType: 'input',
    },
    {
      title: '品牌',
      dataIndex: 'brandName',
      searchKey: 'brandId',
      searchType: 'inputEnterSearch',
      modalProps: {
        querylisteffect: `${namespace}/queryByBrandList1`, // * 弹层数据 list 查询的异步方法，该模块的 model 需要关联 commonSearchModel，
        dataSource: inputEnterSearchList, //* 弹层数据 list
        columns: [ // 弹层表头
          {
            title: '经营品牌ID',
            dataIndex: 'brandId',
            key: 'brandId',
          },
          {
            title: '经营品牌',
            dataIndex: 'brandName',
            key: 'brandName',
          },
        ],
        searchColums: [ // 弹层的搜索
          {
            title: '经营品牌',
            dataIndex: 'brandName',
            searchType: 'input',
          },
        ],
        width: 1200, // 弹层的宽度
      },
    },
  ]
 @param type 默认表单组件（无button）；值为 searchForm 是搜索组件
 @param readonly 展示扁担组件
 @param otherProps 其他的一些属性
 */
class BaseForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      childInputs: {},
      id: Math.random(),
    }
  }

  componentDidMount () {
    this.props.getChild && this.props.getChild(this)
    this.props.onRef && this.props.onRef(this)
  }

  // 设置 childInputs
  setInputState = (item, payload) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const newChildInputs = { ...this.state.childInputs }
    newChildInputs[item.dataIndex] = {
      id: item.dataIndex,
      ...newChildInputs[item.dataIndex],
      ...payload,
    }
    this.setState({ childInputs: newChildInputs })
  }

  // 获取表单的值
  validFields = () => {
    let obj = {}
    this.props.form.validateFieldsAndScroll((err, values) => {
      obj.err = err
      obj.values = values
      if (!err) {
        Object.keys(values).forEach((key) => {
          if (values[key] instanceof moment) {
            values[key] = values[key].format('YYYY-MM-DD')
          }
          if (key.endsWith('_copy')) {
            delete values[key]
          }
        })
      }
    })
    return obj
  }

  // 遍历 props 生成对应的 form 组件
  formFocus = (searchColums, form, otherProps = {}) => {
    const getFieldDecorator = typeof form === 'object' ? form.getFieldDecorator : form
    if (!searchColums || searchColums.length === 0 || !getFieldDecorator) return null
    const _listProps = !otherProps.listProps ? listProps : otherProps.listProps
    const _formItemLayout = !otherProps.formItemLayout ? formItemLayout : otherProps.formItemLayout
    // console.log(111111111111111111111111111)
    const ChildrenElements = searchColums.map((item, key) => {
      let ChildrenElement = null // 返回的组件
      let initialValue = item.value || '' // 初始值
      // console.log(item.value)
      let { rules } = item // 规则
      const props = item.props ? item.props : {} // 受控组件的props
      if (otherProps.disabled) {
        props.disabled = !!item.props
      }
      otherProps.getPopupContainer = this.state.id
      // console.log()
      switch (item.searchType) {
        case 'input':
          ChildrenElement = <Input {...props} />
          break
        case 'inputEnterSearch': {
          item.form = form
          const { dataIndex } = item
          const { childInputs } = this.state
          if (!(childInputs[dataIndex] && childInputs[dataIndex].id)) {
            const { searchKey, searchKeyParam } = item
            const keyy = searchKey || dataIndex
            // const searchKeyParam = searchKeyParam
            this.setInputState(item, {
              visible: false, type: item.searchType, key: keyy, searchKeyParam,
            })
          }
          item.inputEnterSearchProps = {
            visible: childInputs[dataIndex] && childInputs[dataIndex].visible,
            title: item.title,
            onModalCancel: () => {
              this.setInputState(item, { visible: false })
            },
            onModalOk: (selectItem) => {
              this.setInputState(item, { selectItem, type: item.searchType, visible: false })
            },
          }
          ChildrenElement = (<Input.Search allowClear readOnly enterButton onSearch={() => this.setInputState(item, { visible: true })} {...props} />)
          break
        }

        case 'inputPassword':
          ChildrenElement = <Input.Password {...props} />
          break

        case 'inputNumber':
          ChildrenElement = <InputNumber {...props} />
          break

        case 'select': {
          const formatter = (!item.formatter) ? { value: 'comCde', text: 'comDesc' } : item.formatter
          ChildrenElement = (
            <Select
              getPopupContainer={() => document.getElementById(otherProps.getPopupContainer || 'selectContainer')}
              {...props}
            >
              {item.selectOptions.map((index) => {
                const { value, text } = formatter
                return <Select.Option value={index[formatter.value]} key={index[value]}>{item.comDescToComCde ? index[value] : index[text]}</Select.Option>
              })}
            </Select>
          )
          break
        }

        case 'checkbox':
          ChildrenElement = <CheckboxGroup options={item.plainOptions} {...props} />
          break

        case 'radio':
          ChildrenElement = <RadioGroup options={item.plainOptions} {...props} />
          break

        case 'date-picker':
          initialValue = item.initialValue ? moment(item.initialValue) : undefined
          ChildrenElement = <DatePicker format="YYYY-MM-DD" getCalendarContainer={() => document.getElementById(otherProps.getPopupContainer || 'selectContainer')} {...props} />
          break

        case 'cascader':
          ChildrenElement = <Cascader options={item.plainOptions} getPopupContainer={() => document.getElementById(otherProps.getPopupContainer || 'selectContainer')} placeholder="" {...props} />
          break

        case 'textArea':
          ChildrenElement = <TextArea rows={4} {...props} />
          break

        case 'rangePicker':
          initialValue = []
          ChildrenElement = (
            <RangePicker getCalendarContainer={() => document.getElementById(otherProps.getPopupContainer || 'selectContainer')}
              ranges={{
                今天: [moment(), moment()], 一周内: [moment().subtract(1, 'week'), moment()], 一个月内: [moment().subtract(1, 'months'), moment()], 最近三个月: [moment().subtract(3, 'months'), moment()],
              }}
              placeholder=""
              {...props}
            />
          )
          break

        default:
          break
      }
      return (
        <React.Fragment key={key}>
          {item.nextline ? <Divider /> : null}
          <Col {..._listProps} key={key} style={{ display: item.hidden ? 'none' : 'block' }}>
            <FormItem {..._formItemLayout} label={`${item.title}`}>
              {otherProps.readonly ? initialValue : getFieldDecorator(item.dataIndex, {
                initialValue,
                rules,
              })(ChildrenElement)}
            </FormItem>
          </Col>
          {item.searchType === 'inputEnterSearch' ? <inputEnterSearchModal {...item} /> : null}
        </React.Fragment>
      )
    })
    return ChildrenElements
  }

   // 搜索按钮  根据输入内容 搜索
   handleInnerSearch = () => {
     const { validateFields } = this.props.form
     validateFields((err, values) => {
       const query = values
       const { childInputs } = this.state
       const vals = []
       if (!err) {
         for (let item in query) {
           // 对象字段转化成数组
           if (query.hasOwnProperty(item)) {
             if (query[item] instanceof moment) {
               query[item] = query[item].format('YYYY-MM-DD')
             }
             // 处理 inputEnterSearch
             if (childInputs[item] && childInputs[item].type === 'inputEnterSearch' && item === childInputs[item].id) {
               // 判断手动清空控件的值
               const flag = query[item] === ''
               delete query[item]
               if (flag) {
                 query[childInputs[item].key] = ''
               } else {
                 query[childInputs[item].key] = childInputs[item].selectItem ? childInputs[item].selectItem[0][childInputs[item].key] : ''
               }
               if (childInputs[item].searchKeyParam) {
                 values[childInputs[item].searchKeyParam] = query[childInputs[item].key] || ''
                 delete query[childInputs[item].key]
               }
             }
             if (query[item]) {
               const str = query[item]
               if (query[item] instanceof String) {
                 str.trim()
               }
               if (query[item] instanceof Array) {
                 if (query[item].length > 0) {
                   vals.push(item)
                 }
               } else {
                 query[item] = str.toString().trim()
                 vals.push(item)
               }
             }
           }
         }
         vals.length >= 0 && this.props.handleSearch(query)
       }
     })
   }

  // 重置按钮 清空输入框中的所有内容
  handleReset = () => {
    const { searchColums, form } = this.props
    const { resetFields } = form
    const { childInputs } = this.state
    // 处理 hidden input
    const hiddenInputs = searchColums.filter((searchColum) => searchColum.hidden)
    const hiddenInputsArr = []
    let inputsArr = []
    hiddenInputs.forEach((hiddenInput) => {
      hiddenInputsArr.push(hiddenInput.dataIndex)
    })
    searchColums.forEach((hiddenInput) => {
      inputsArr.push(hiddenInput.dataIndex)
    })
    // console.log(hiddenInputsArr)
    // console.log(inputsArr)
    hiddenInputsArr.forEach((item) => {
      inputsArr = inputsArr.filter((itemInner) => item !== itemInner)
    })
    // console.log(inputsArr)
    // 处理 inputEnterSearch
    for (let item in childInputs) {
      if (childInputs[item].type === 'inputEnterSearch') {
        const newChildInputs = {
          // eslint-disable-next-line react/no-access-state-in-setstate
          ...this.state.childInputs,
        }
        newChildInputs[item] = {
          ...this.state.childInputs[item],
          selectItem: null,
        }
        this.setState({ childInputs: newChildInputs })
      }
    }
    resetFields(inputsArr)
    // const obj = {}
    // searchColums.forEach((item) => {
    //   if (item.searchType === 'date-picker') {

    //     obj[item.dataIndex] = {
    //       value: '',
    //     }

    //     setFields({ obj })
    //   }
    // })
  }

  render () {
    // type baseForm || searchForm
    const {
      searchColums, type, readonly, otherProps = {}, form,
    } = this.props
    // const inputEl = useRef(null)
    const childInput = this.formFocus(searchColums, form, {
      formItemLayout,
      listProps,
      readonly,
      ...otherProps,
    })
    if (type === 'searchForm') {
      return (
        <>
          {/* <FTitle title="输入查询条件" /> */}
          <div id={this.state.id}>
            <Form onSubmit={this.handleInnerSearch}>
              <Row>
                {childInput}
              </Row>
            </Form>
          </div>

          <Row>
            <Col span={40} style={{ textAlign: 'center' }}>
              <Form.Item>
                <Button type="primary" htmlType="submit" onClick={this.handleInnerSearch}>搜索</Button>
                {' '}
&nbsp;&nbsp;&nbsp;
                <Button onClick={this.handleReset}>重置</Button>
              </Form.Item>
            </Col>
          </Row>
        </>
      )
    }
    return (
      <>
        {/* {this.props.title === false ? null : <FTitle title={this.props.title ? this.props.title : '基本信息'} />} */}
        <div id={this.state.id}>
          <Form>
            <Row>
              {childInput}
            </Row>
          </Form>
        </div>
      </>
    )
  }
}
BaseForm.propTypes = {
  getChild: PropTypes.func,
  onRef: PropTypes.func,
  handleSearch: PropTypes.func,
  type: PropTypes.string,
  form: PropTypes.object,
  otherProps: PropTypes.object,
  readonly: PropTypes.bool,
  title: PropTypes.any,
  searchColums: PropTypes.array,
}

export default Form.create({
  // name: 'dososs',
  // mapPropsToFields (props) {
  //   console.log(props)
  // },
  // onFieldsChange (props, changedFields, allFields) {
  //   console.log(changedFields)
  //   console.log(allFields)
  // },
  // onValuesChange (props, changedValues, allValues) {
  //   console.log(changedValues)
  //   // const { dispatch } = props
  //   // dispatch({
  //   //   // type: `${namespace}/update`
  //   // })
  //   console.log(allValues)
  // },
})(BaseForm)
