import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import 'antd/lib/style/index.css'
import 'antd/dist/antd.css'
import './index.less'


const FTitle = ({ title }) => {
  return (
    <h3 className="fTitle">
      <span>
        <Icon type="down-square-o" />
        &nbsp;&nbsp;
        {title}
      </span>
    </h3>
  )
}
const DTitle = ({ title }) => {
  return (
    <h3 className="dTitle">
      <span>
        <Icon type="down-square-o" />
        &nbsp;&nbsp;
        {title}
      </span>
    </h3>
  )
}
FTitle.propTypes = {
  title: PropTypes.string,
}

DTitle.propTypes = {
  title: PropTypes.string,
}
export {
  FTitle,
  DTitle,
}
