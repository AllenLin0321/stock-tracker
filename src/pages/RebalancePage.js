import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Switch, Form, InputNumber, Empty, Space } from 'antd';

import RebalanceRecord from 'components/rebalance/RebalanceRecord';

const RebalancePage = () => {
  const [isAddNewFund, setIsAddNewFund] = useState(false);
  const [newFund, setNewFund] = useState(0);
  const [isExpandAll, setIsExpandAll] = useState(false);
  const portfolio = useSelector(state => state.portfolio.stocks);

  if (!portfolio || portfolio.length === 0) {
    return <Empty />;
  }

  return (
    <div className="rebalance__wrapper">
      <Form>
        <Space>
          <Form.Item label="是否再平衡" name="isAddNewFund">
            <Switch
              checked={isAddNewFund}
              onChange={isAddNewFund => {
                setIsAddNewFund(isAddNewFund);
              }}
            />
          </Form.Item>
          {isAddNewFund && (
            <Form.Item label="是否全部展開" name="isExpandAll">
              <Switch
                checked={isExpandAll}
                checkedChildren="展開"
                unCheckedChildren="關閉"
                onChange={isExpandAll => {
                  setIsExpandAll(isExpandAll);
                }}
              />
            </Form.Item>
          )}
        </Space>
        {isAddNewFund && (
          <>
            <Form.Item label="注資金額" name="newFund">
              <InputNumber
                defaultValue={0}
                value={newFund}
                formatter={value =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={newFund => {
                  setNewFund(newFund);
                }}
              />
            </Form.Item>
          </>
        )}
      </Form>
      <RebalanceRecord
        isAddNewFund={isAddNewFund}
        isExpandAll={isExpandAll}
        newFund={newFund}
      />
    </div>
  );
};

export default RebalancePage;
