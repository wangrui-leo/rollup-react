/* eslint-disable no-undef */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  Form, Row, Col, Button,
} from 'antd'
import { formItemTypes } from './utils'
import { DTitle } from '../Title'
// eslint-disable-next-line import/no-cycle
import InputEnterSearch from './inputEnterSearch'
// import 'antd/lib/style/index.css'
// import 'antd/dist/antd.css'
import './index.less'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
}

const listProps = {
  xs: { span: 12 },
  sm: { span: 12 },
  md: { span: 8 },
  lg: { span: 6 },
  xl: { span: 6 },
}

class RenderForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      popupContainer: Math.random(), // 弹出式组件所在的 container
      // formItemElements: [], // form item element
      searchInputs: {}, // 弹层搜索组件
    }
  }

  componentDidMount () {
    const { searchColums } = this.props
    this.props.getChild && this.props.getChild(this)
    searchColums.forEach((searchColum) => {
      // initialValue     初始值
      // rules            form表单的校验规则
      // props            form表单控件的 props 属性
      // dataIndex        form表单控件对应的字段
      // label            form表单控件对应的名称
      // searchType       form表单控件对应的组件的类型
      let { dataIndex = '', label, searchType } = searchColum
      // 设置不同的form控件)
      // inputEnterSearch modalProps
      if (searchType === 'inputEnterSearch') {
        const { modalProps } = searchColum
        // onModalOkCallback
        const onModalOkCallback = (selectItem) => {
          // console.log(selectItem)
          this.setInputState(searchColum, { selectItem, type: searchType, visible: false })
        }
        if (!this.state.searchInputs[dataIndex]) {
          const _modalProps = {
            visible: false,
            searchKey: searchColum.searchKey || dataIndex,
            title: modalProps.title || label,
            onModalOk: (selectItem) => { // 弹层ok
              const { searchInputs } = this.state
              if (modalProps.onModalOk) modalProps.onModalOk(() => onModalOkCallback(selectItem), searchInputs[dataIndex].selectItem, selectItem)
              else onModalOkCallback(selectItem)
            },
            onModalCancel: () => { // 弹层cancel
              this.setInputState(searchColum, { visible: false })
            },
          }
          this.setInputState(searchColum, _modalProps)
        }
      }
    })
  }

  // handleInnerSearch
  handleInnerSearch = (_callBack) => {
    const { searchInputs } = this.state
    const { form: { validateFieldsAndScroll }, handleSearch, searchColums } = this.props
    validateFieldsAndScroll((err, values) => {
      console.log(values)
      Object.keys(values).forEach((key) => {
        // moment 类型的值
        if (values[key] instanceof moment) {
          const momentSearchColum = searchColums.find((item) => key === item.dataIndex)
          values[key] = values[key].format(momentSearchColum.props.format || 'YYYY-MM-DD')
        }
        // inputEnterSearch
        if (searchInputs[key] && searchInputs[key].type === 'inputEnterSearch' && key === searchInputs[key].id) {
          // 判断手动清空控件的值
          const flag = values[key] === ''
          delete values[key]
          if (flag) {
            values[searchInputs[key].searchKey] = ''
          } else {
            values[searchInputs[key].searchKey] = searchInputs[key].selectItem ? searchInputs[key].selectItem[0][searchInputs[key].searchKey] : ''
          }
        }
      })
      Object.keys(values).forEach((key) => {
        // 去除 undefined 参数
        if (values[key] === undefined) delete values[key]
      })
      handleSearch && handleSearch({ err, values })
      _callBack && typeof _callBack === 'function' && _callBack({ err, values })
    })
  }

  // 设置 searchInputs
  setInputState = (item, payload) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const newChildInputs = { ...this.state.searchInputs }
    newChildInputs[item.dataIndex] = {
      id: item.dataIndex,
      ...newChildInputs[item.dataIndex],
      ...payload,
    }
    // console.log('newChildInputs', newChildInputs)
    this.setState({ searchInputs: newChildInputs })
  }

  // get unhidden input dataIndex object
  getUnhiddenSearchColums = (searchColums) => {
    // 处理 hidden input
    const unHiddenSearchColums = searchColums.filter((searchColum) => !searchColum.hidden)
    let unhiddenDataIndexArr = []
    unHiddenSearchColums.forEach((item) => {
      unhiddenDataIndexArr.push(item.dataIndex)
    })
    return unhiddenDataIndexArr
  }

  // 重置 inputEnterSearch 属性控件
  resetInputEnterSearch = (searchInputs) => {
    for (let item in searchInputs) {
      if (searchInputs[item].type === 'inputEnterSearch') {
        const newChildInputs = { ...searchInputs }
        newChildInputs[item] = {
          ...searchInputs[item],
          selectItem: null,
        }
        this.setState({ searchInputs: newChildInputs })
      }
    }
  }

  /**
   *
   * 获取非隐藏的 （hidden： fasle）的组件
   * @memberof RenderForm
   * @return 返回非隐藏的 （hidden： fasle）的组件 dataIndex 数组 [] string
   */
  getUnhiddenDataIndexArr = (searchColums) => {
    return searchColums.filter((colums) => !colums.hidden).map((item) => item.dataIndex)
  }

  // handleReset
  handleReset = () => {
    const { form: { resetFields }, searchColums, handleResetSearch } = this.props
    const { searchInputs } = this.state
    // 重置 inputEnterSearch selectItem 为 null
    this.resetInputEnterSearch(searchInputs)
    // 重置功能不重置hidden属性的控件
    const unhiddenDataIndexArr = this.getUnhiddenDataIndexArr(searchColums)
    // console.log('unhiddenDataIndexArr', unhiddenDataIndexArr)
    // console.log('resetFields', resetFields)
    resetFields(unhiddenDataIndexArr)
    handleResetSearch && handleResetSearch()
  }

  // renderForm
  renderForm = (searchColums, otherProps) => {
    const { popupContainer } = this.state
    const { form, view = false } = this.props
    const { getFieldDecorator } = form
    const _listProps = !otherProps.listProps ? listProps : otherProps.listProps
    const _formItemLayout = !otherProps.formItemLayout ? formItemLayout : otherProps.formItemLayout
    const formItemElements = searchColums.map((searchColum, key) => {
      // initialValue     初始值
      // rules            form表单的校验规则
      // props            form表单控件的 props 属性
      // dataIndex        form表单控件对应的字段
      // label            form表单控件对应的名称
      // searchType       form表单控件对应的组件的类型
      // selectOptions    下拉控件的选项数据
      let {
        initialValue = '', rules = [], dataIndex = '', label, searchType, formItemProps = {}
      } = searchColum
      // 设置不同的form控件
      // const Element = addNewProps(formItemTypes[searchColum.searchType], { placeholder: 'nihao' })
      searchColum.getCalendarContainer = () => document.getElementById(popupContainer)
      searchColum.getCalendarContainer = () => document.getElementById(popupContainer)
      // inputEnterSearch modalProps
      if (searchType === 'inputEnterSearch') {
        // onSearchCallback
        const onSearchCallback = () => {
          this.setInputState(searchColum, { visible: true })
        }
        // enter button
        searchColum.onSearch = () => {
          // 点击展示弹窗之前需要执行的逻辑
          const { searchInputs } = this.state
          if (searchColum.enterButtonSearch) searchColum.enterButtonSearch(onSearchCallback, searchInputs)
          else onSearchCallback()
        }
        // 设置弹层组件的属性
        searchColum.inputEnterSearchProps = this.state.searchInputs[dataIndex]
        searchColum.form = form
      }
      // 返回对应的子控件
      const Element = formItemTypes[searchColum.searchType](searchColum)
      // 处理 初始值
      // eslint-disable-next-line no-nested-ternary
      initialValue = searchType === 'datePicker' ? (!initialValue ? undefined : initialValue) : initialValue
      // 下拉选择的 view 初始值问题修复
      if (searchType === 'select' && initialValue !== '') {
        initialValue = searchColum.selectOptions.find((item) => item.value === initialValue)[view ? 'text' : 'value']
      }
      // initialValue =  ? searchColum.selectOptions.find((item) => item.value === initialValue).value : initialValue
      // console.log('searchColum', searchColum)
      return (
        <React.Fragment key={key}>
          <Col {..._listProps} style={{ display: searchColum.hidden ? 'none' : 'block' }}>
            <FormItem {..._formItemLayout} {...formItemProps} label={label}>
              {
                // 表单查看时显示的布局
                view ? initialValue : getFieldDecorator((dataIndex), {
                  initialValue,
                  rules,
                })(Element)
              }
            </FormItem>
          </Col>
          {searchType === 'inputEnterSearch' && <InputEnterSearch {...searchColum} />}
        </React.Fragment>
      )
    })
    return formItemElements
  }

  render () {
    const {
      searchColums, title = '', otherProps = {}, handleResetSearch, handleSearch, handleSearchText = '搜索', footerBtns = [],
    } = this.props
    const showBtns = ((!handleSearch && typeof handleSearch === 'boolean') && (!handleResetSearch && typeof handleResetSearch === 'boolean') && footerBtns.length === 0)
    return (
      <>
        {title && <DTitle title={title} />}
        <Form id={this.state.popupContainer}>
          <Row>
            {this.renderForm(searchColums, otherProps)}
          </Row>
        </Form>
        {!showBtns ? (
          <>
            <Row>
              <Col span={40} style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                {!handleSearch && typeof handleSearch === 'boolean' ? '' : <Button type="primary" onClick={this.handleInnerSearch}>{handleSearchText}</Button>}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                {!handleResetSearch && typeof handleResetSearch === 'boolean' ? '' : <Button onClick={this.handleReset}>重置</Button>}
                {footerBtns.map((item, key) => (
                  <React.Fragment key={key}>
                &nbsp;&nbsp;&nbsp;&nbsp;
                    {item}
                  </React.Fragment>
                ))}
              </Col>
            </Row>
            <br />
          </>
        ) : null}
      </>
    )
  }
}

RenderForm.propTypes = {
  searchColums: PropTypes.array,
  footerBtns: PropTypes.array,
  title: PropTypes.string,
  handleSearchText: PropTypes.string,
  form: PropTypes.object,
  otherProps: PropTypes.object,
  view: PropTypes.bool,
  getChild: PropTypes.func,
  handleResetSearch: PropTypes.any,
  handleSearch: PropTypes.any,
}

export default Form.create()(RenderForm)
