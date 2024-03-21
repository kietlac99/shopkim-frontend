import { ADD_TO_CART, 
    SAVE_SHIPPING_INFO, 
    REMOVE_ITEM_CART,
    FETCH_PROVINCES_REQUEST,
    FETCH_PROVINCES_SUCCESS,
    FETCH_PROVINCES_FAIL,
    FETCH_DISTRICTS_REQUEST,
    FETCH_DISTRICTS_SUCCESS,
    FETCH_DISTRICTS_FAIL,
    FETCH_WARDS_REQUEST,
    FETCH_WARDS_SUCCESS,
    FETCH_WARDS_FAIL,
    CLEAR_DISTRICTS_AND_WARDS,
    CLEAR_CART,
    CLEAR_ERRORS, 
    CLEAR_WARDS} from '../constants/cartConstants';

export const cartReducer = (state = { cartItems: [], shippingInfo: {} }, action) => {
    switch (action.type) {

        case ADD_TO_CART:
            const item = action.payload;

            const isItemExist = state.cartItems.find(i => i.product === item.product);

            if (isItemExist) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(i => i.product === item.product ? item : i)
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }

        case REMOVE_ITEM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter(i => i.product !== action.payload)
            }

        case CLEAR_CART:
            return {
              ...state,
              cartItems: [],
              shippingInfo: {}
            }

        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload
            }

        default:
            return state;
    }
}

export const locationReducer = (state = { provinces: [], districts: [], wards: [] }, action) => {
    switch (action.type) {
      // FETCH_PROVINCES_REQUEST: Khởi động yêu cầu lấy dữ liệu các tỉnh thành
      case FETCH_PROVINCES_REQUEST:
        return {
          ...state,
          loading: true
        };
      // FETCH_PROVINCES_SUCCESS: Nhận dữ liệu tỉnh thành thành công
      case FETCH_PROVINCES_SUCCESS:
        return {
          ...state,
          loading: false,
          provinces: action.payload
        };
      // FETCH_PROVINCES_FAIL: Lỗi khi lấy dữ liệu tỉnh thành
      case FETCH_PROVINCES_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
  
      // Tương tự với các action khác: FETCH_DISTRICTS_REQUEST, FETCH_DISTRICTS_SUCCESS, FETCH_DISTRICTS_FAIL, FETCH_WARDS_REQUEST, FETCH_WARDS_SUCCESS, FETCH_WARDS_FAIL
      case FETCH_DISTRICTS_REQUEST:
        return {
          ...state,
          loading: true
        };
      case FETCH_DISTRICTS_SUCCESS:
        return {
          ...state,
          loading: false,
          districts: action.payload
        };
      case FETCH_DISTRICTS_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
  
      case FETCH_WARDS_REQUEST:
        return {
          ...state,
          loading: true
        };
      case FETCH_WARDS_SUCCESS:
        return {
          ...state,
          loading: false,
          wards: action.payload
        };
      case FETCH_WARDS_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };

      case CLEAR_WARDS:
        return {
          ...state,
          loading: false,
          wards: []
        }

      case CLEAR_DISTRICTS_AND_WARDS:
        return {
          ...state,
          loading: false,
          wards: [],
          districts: [],
          error: null
        }

      case CLEAR_ERRORS:
        return {
          ...state,
          error: null
        }
  
      default:
        return state;
    }
};
