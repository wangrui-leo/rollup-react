import React from 'react'
import PropTypes from 'prop-types'
// import { connect } from 'dva'
import { Modal, Table } from 'antd'
// import { cloneDeep } from 'lodash'
// eslint-disable-next-line import/no-cycle
import SearchInner from './index'

class InputEnterSearch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
      fetchList: null, // 调用接口查询数据的方法
      child: null, // 子组件的实例
      selectedRowkeys: [this.props.value], // 表格选中值
      selectedRows: [],
      loading: false, // 表格 loading状态
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条·`,
        current: 1,
        total: 0,
      },
    }
  }

  componentDidMount () {
    const { modalProps } = this.props
    const fetchList = modalProps.fetchData()
    this.setState({ fetchList })
  }


  // innerModalProps
  get innerModalProps () {
    const {
      inputEnterSearchProps, dataIndex, form, searchKey,
    } = this.props
    const { selectedRows } = this.state
    if (!inputEnterSearchProps) return null
    let { onModalCancel, onModalOk } = inputEnterSearchProps
    return {
      ...inputEnterSearchProps,
      onOk: () => {
        if (selectedRows.length > 0) { // 未选中任何数据
          const filed = {}
          filed[dataIndex] = searchKey ? this.state.selectedRows[0][dataIndex] : this.state.selectedRowkeys[0]
          // console.log('form.setFieldsValue(filed)', filed)
          form.setFieldsValue(filed)
        }
        // 清空表单搜索
        this.state.child.props.form.resetFields()
        // 清除选中状态 清空表格数据
        this.setState({ selectedRowkeys: [], dataSource: [] })
        // 关闭弹层
        onModalOk(this.state.selectedRows)
        // 重置页脚
        this.resetPagination()
      },
      onCancel: () => {
        // 清空表单搜索
        this.state.child.props.form.resetFields()
        // 清除选中状态 清空表格数据
        this.setState({ selectedRowkeys: [], dataSource: [] })
        // 关闭弹层
        onModalCancel()
        // 重置页脚
        this.resetPagination()
      },
    }
  }

  // searchInnerProps
  get searchInnerProps () {
    const { modalProps } = this.props
    const { searchColums } = modalProps
    return {
      searchColums,
      handleSearch: this.handleSearch,
    }
  }

  // tableProps
  get tableProps () {
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: this.state.selectedRowkeys,
      onChange: (selectedRowkeys, selectedRows) => {
        this.setState({ selectedRowkeys, selectedRows })
      },
    }
    const { tableColums, tableRowKey } = this.props.modalProps
    const { loading, pagination } = this.state
    return {
      loading,
      bordered: true,
      rowKey: (record) => record[tableRowKey],
      rowSelection,
      columns: tableColums,
      dataSource: this.state.dataSource,
      pagination,
      onChange: (page) => {
        // console.log('表格翻页出发查询数据', page)
        this.handleSearch(page)
      },
    }
  }

  // 重置页脚
  resetPagination = () => {
    this.setState({
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条·`,
        current: 1,
        total: 0,
      },
    })
  }

  // 搜索组件
  handleSearch = ({ current = 1, pageSize = 10 }) => {
    // console.log('current debugger', current)
    const { form } = this.state.child.props
    const { getFieldsValue } = form
    const { fetchList, pagination } = this.state
    const params = { ...getFieldsValue(), page: current, pageSize }
    this.setState({ loading: true })
    // console.log('表格搜索按钮出发查询数据', params)
    fetchList(params, (res) => {
      // console.log(res)
      const { data, total } = res
      this.setState({
        loading: false,
        dataSource: data,
        pagination: {
          ...pagination,
          current,
          page: current,
          pageSize,
          total,
        },
      })
    })
  }

  render () {
    // const { pagination } = this.state
    // console.log(pagination)
    return (
      <>
        <Modal {...this.innerModalProps} width={1200}>
          {/* 搜索表单 */}
          <SearchInner getChild={(_child) => this.setState({ child: _child })} {...this.searchInnerProps} />
          <Table {...this.tableProps} />
        </Modal>
      </>
    )
  }
}

InputEnterSearch.propTypes = {
  loading: PropTypes.object,
  location: PropTypes.object,
  getChild: PropTypes.func,
  dispatch: PropTypes.func,
  modalOnOk: PropTypes.func,
  modalProps: PropTypes.object,
  model: PropTypes.object,
  form: PropTypes.any,
  inputEnterSearchProps: PropTypes.object,
  title: PropTypes.string,
  dataIndex: PropTypes.string,
  value: PropTypes.string,
  searchKey: PropTypes.string,
}

export default InputEnterSearch
