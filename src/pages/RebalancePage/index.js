import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Switch, Form, InputNumber, Empty, Space } from 'antd';

import { apiGetStock } from 'api';
import * as actions from 'store/actions';
import { formatPortfolioData } from 'utils';
import Record from 'components/rebalance/Record';

import 'pages/RebalancePage/index.scss';

const RebalancePage = props => {
  const [isAddNewFund, setIsAddNewFund] = useState(false);
  const [newFund, setNewFund] = useState(0);
  const [isExpandAll, setIsExpandAll] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      props.getLocalData('portfolio');
      if (props.savedPortfolio) {
        props.setTableLoading({ tableLoading: true });
        await onClickReload();
        props.setTableLoading({ tableLoading: false });
      }
    };
    fetchPortfolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickReload = async () => {
    const { portfolio, onSavePortfolio } = props;
    const delayIncrement = 200;
    let delay = 0;

    if (portfolio.length === 0) return;

    let promiseArr = portfolio.map(async stock => {
      delay += delayIncrement;
      return new Promise(resolve => setTimeout(resolve, delay)).then(() =>
        apiGetStock(stock.symbol)
      );
    });

    try {
      const res = await Promise.all(promiseArr);
      res.forEach(({ data }) => {
        let matchStock = portfolio.find(
          stock => stock.symbol === data.quote.symbol
        );

        let quantity = matchStock ? matchStock.quantity : null;
        let defaultPrecent = matchStock ? matchStock.defaultPrecent : null;
        onSavePortfolio(
          formatPortfolioData({ ...data, quantity, defaultPrecent })
        );
      });
    } catch (error) {
      console.log('error: ', error);
    }
  };

  if (!props.portfolio || props.portfolio.length === 0) {
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
      <Record
        isAddNewFund={isAddNewFund}
        isExpandAll={isExpandAll}
        newFund={newFund}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return { portfolio: state.portfolio.stocks };
};

export default connect(mapStateToProps, actions)(RebalancePage);
