// src/con/StockCon.js
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import axios from "axios";

const StockCon = createContext();
export const useStock = () => {
  const con = useContext(StockCon);
  if (!con) {
    throw new Error("useStock must be used within a StockProvider");
  }
  return con;
};

const stockReducer = (state, action) => {
  switch (action.type) {
    case "SET_STOCKS":
      return { ...state, stocks: action.payload };
    case "UPDATE_PRICE":
      return {
        ...state,
        stocks: state.stocks.map((stock) =>
          stock.symbol === action.payload.symbol
            ? {
                ...stock,
                price: action.payload.price,
                history: [
                  ...(stock.history || []),
                  {
                    price: action.payload.price,
                    timestamp: new Date(),
                  },
                ].slice(-50),
              }
            : stock
        ),
      };
    case "ADD_STOCK":
      const newStock = {
        ...action.payload,
        history: [{ price: action.payload.price, timestamp: new Date() }],
      };
      return { ...state, stocks: [...state.stocks, newStock] };
    case "REMOVE_STOCK":
      return {
        ...state,
        stocks: state.stocks.filter((stock) => stock.symbol !== action.payload),
      };
    case "UPDATE_SHARES":
      return {
        ...state,
        stocks: state.stocks.map((stock) =>
          stock.symbol === action.payload.symbol
            ? { ...stock, shares: action.payload.shares }
            : stock
        ),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const initialState = {
  stocks: [],
  loading: false,
};

export const StockProvider = ({ children }) => {
  const [state, dispatch] = useReducer(stockReducer, initialState);
  const intervals = useRef({});
  // // Load from localStorage on mount
  // useEffect(() => {
  //   const savedStocks = localStorage.getItem("portfolioStocks");
  //   if (savedStocks) {
  //     try {
  //       const stocks = JSON.parse(savedStocks);
  //       dispatch({ type: "SET_STOCKS", payload: stocks });

  //       // Start price updates for saved stocks
  //       stocks.forEach((stock) => {
  //         startPriceUpdates(stock.symbol, stock.price);
  //       });
  //     } catch (error) {
  //       console.error("Error loading saved stocks:", error);
  //       initializeDemoStocks();
  //     }
  //   } else {
  //     initializeDemoStocks();
  //   }
  // }, []);

  const initializeDemoStocks = () => {
    const initialStocks = [];

    dispatch({ type: "SET_STOCKS", payload: initialStocks });

    initialStocks.forEach((stock) => {
      // startPriceUpdates(stock.symbol, stock.price);
    });
  };

  useEffect(() => {
    initializeDemoStocks();
  }, []); // runs only ONCE

  // Fetch stocks on component mount
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/stocks");
        dispatch({ type: "SET_STOCKS", payload: response.data });
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };

    // Fetch immediately when component mounts
    fetchStocks();

    // Set interval to fetch every 60 seconds
    const intervalId = setInterval(fetchStocks, 2000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // // Save to localStorage when stocks change
  // useEffect(() => {
  //   if (state.stocks.length > 0) {
  //     localStorage.setItem("portfolioStocks", JSON.stringify(state.stocks));
  //   }
  // }, [state.stocks]);
  //---------------------------------------------------------------------------------------------------------------------------------------------
  const startPriceUpdates = (symbol, currentPrice) => {
    // Clear existing interval for this stock
    if (intervals.current[symbol]) {
      clearInterval(intervals.current[symbol]);
    }

    // Start new price simulation
    intervals.current[symbol] = setInterval(() => {
      // Make a rest api call for get and update the stocks
      // dispatch({
      //   type: "UPDATE_PRICE",
      //   payload: { symbol, price: parseFloat(newPrice.toFixed(2)) },
      // });
    }, 10000);
  };

  // -----------------------------------------------------------------------------------------------------------------------------------
  const addStock = (symbol, name, shares, price = 100) => {
    const newStock = {
      symbol: symbol.toUpperCase(),
      name,
      price: parseFloat(price),
      shares: parseInt(shares),
      history: [],
    };
    dispatch({ type: "ADD_STOCK", payload: newStock });
    startPriceUpdates(symbol.toUpperCase(), price);
  };

  // ------------------------------------------------------------------------------------------------------------------------------------
  const removeStock = (symbol) => {
    dispatch({ type: "REMOVE_STOCK", payload: symbol });
    if (intervals.current[symbol]) {
      clearInterval(intervals.current[symbol]);
      delete intervals.current[symbol];
    }
  };

  // ------------------------------------------------------------------------------------------------------------------------------------
  const updateShares = (symbol, shares) => {
    if (shares > 0) {
      dispatch({
        type: "UPDATE_SHARES",
        payload: { symbol, shares: parseInt(shares) },
      });
    }
  };

  // ------------------------------------------------------------------------------------------------------------------------------------
  const clearPortfolio = () => {
    Object.values(intervals.current).forEach(clearInterval);
    intervals.current = {};
    dispatch({ type: "SET_STOCKS", payload: [] });
    localStorage.removeItem("portfolioStocks");
  };

  // ------------------------------------------------------------------------------------------------------------------------------------
  // Calculate portfolio statistics
  const getPortfolioValue = () => {
    return state.stocks.reduce(
      (total, stock) => total + stock.price * stock.shares,
      0
    );
  };

  // ------------------------------------------------------------------------------------------------------------------------------------
  const getTotalInvested = () => {
    return state.stocks.reduce((total, stock) => {
      const initialPrice =
        stock.history && stock.history[0]
          ? stock.history[0].price
          : stock.price * 0.9;
      return total + initialPrice * stock.shares;
    }, 0);
  };

  // ------------------------------------------------------------------------------------------------------------------------------------
  const getPortfolioReturn = () => {
    const currentValue = getPortfolioValue();
    const invested = getTotalInvested();
    if (invested === 0) return 0;
    return ((currentValue - invested) / invested) * 100;
  }; // FIXED: Proper value object with all required properties

  // ------------------------------------------------------------------------------------------------------------------------------------
  const value = {
    // State
    stocks: state.stocks,
    loading: state.loading,

    // Actions
    addStock,
    removeStock,
    updateShares,
    clearPortfolio,

    // Computed values
    getPortfolioValue,
    getTotalInvested,
    getPortfolioReturn,
  };
  return <StockCon.Provider value={value}>{children}</StockCon.Provider>;
};
