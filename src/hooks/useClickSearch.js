import { message } from 'antd';
import { apiGetStock } from 'api';
import { useDispatch } from 'react-redux';

const useClickSearch = props => {
  const dispatch = useDispatch();

  const onClickSearch = async symbol => {
    if (symbol === '') return;
    let res = { isSuccess: false };

    try {
      const { data } = await apiGetStock(symbol);
      data.quote && dispatch(props.dispatchMethod(data));
      res.isSuccess = true;
    } catch (error) {
      if (error.response) {
        message.error(error.response.data);
      }
    } finally {
      return res;
    }
  };

  return onClickSearch;
};

export default useClickSearch;
