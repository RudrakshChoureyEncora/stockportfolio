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
    const initialStocks = [
      {
        stockId: "RELIANCE",
        name: "Reliance Industries",
        symbol: "RELIANCE",
        currentPrice: 2850.45,
        history: [
          { timeStamp: "2025-11-27T09:25:10Z", price: 2845.6 },
          { timeStamp: "2025-11-27T09:25:20Z", price: 2848.2 },
          { timeStamp: "2025-11-27T09:25:30Z", price: 2850.1 },
          { timeStamp: "2025-11-27T09:25:40Z", price: 2850.45 },

          // Added 28 more entries
          { timeStamp: "2025-11-27T09:25:50Z", price: 2851.0 },
          { timeStamp: "2025-11-27T09:26:00Z", price: 2850.7 },
          { timeStamp: "2025-11-27T09:26:10Z", price: 2852.3 },
          { timeStamp: "2025-11-27T09:26:20Z", price: 2853.0 },
          { timeStamp: "2025-11-27T09:26:30Z", price: 2852.6 },
          { timeStamp: "2025-11-27T09:26:40Z", price: 2853.4 },
          { timeStamp: "2025-11-27T09:26:50Z", price: 2854.1 },
          { timeStamp: "2025-11-27T09:27:00Z", price: 2855.2 },
          { timeStamp: "2025-11-27T09:27:10Z", price: 2854.7 },
          { timeStamp: "2025-11-27T09:27:20Z", price: 2853.9 },
          { timeStamp: "2025-11-27T09:27:30Z", price: 2854.3 },
          { timeStamp: "2025-11-27T09:27:40Z", price: 2854.9 },
          { timeStamp: "2025-11-27T09:27:50Z", price: 2855.5 },
          { timeStamp: "2025-11-27T09:28:00Z", price: 2856.0 },
          { timeStamp: "2025-11-27T09:28:10Z", price: 2856.3 },
          { timeStamp: "2025-11-27T09:28:20Z", price: 2855.8 },
          { timeStamp: "2025-11-27T09:28:30Z", price: 2855.2 },
          { timeStamp: "2025-11-27T09:28:40Z", price: 2856.1 },
          { timeStamp: "2025-11-27T09:28:50Z", price: 2857.0 },
          { timeStamp: "2025-11-27T09:29:00Z", price: 2857.4 },
          { timeStamp: "2025-11-27T09:29:10Z", price: 2858.2 },
          { timeStamp: "2025-11-27T09:29:20Z", price: 2857.9 },
          { timeStamp: "2025-11-27T09:29:30Z", price: 2858.7 },
          { timeStamp: "2025-11-27T09:29:40Z", price: 2859.3 },
          { timeStamp: "2025-11-27T09:29:50Z", price: 2858.8 },
          { timeStamp: "2025-11-27T09:30:00Z", price: 2859.5 },
          { timeStamp: "2025-11-27T09:30:10Z", price: 2860.1 },
          { timeStamp: "2025-11-27T09:30:20Z", price: 2860.4 },
          { timeStamp: "2025-11-27T09:30:30Z", price: 2861.0 },
          { timeStamp: "2025-11-27T09:30:40Z", price: 2861.3 },
        ],
      },

      {
        stockId: "TCS2",
        name: "Tata Consultancy Services",
        symbol: "TCS2",
        currentPrice: 3650.2,
        history: [
          {
            timeStamp: "2025-11-27T09:25:10Z",
            price: 3645.8,
          },
          {
            timeStamp: "2025-11-27T09:25:20Z",
            price: 3648.3,
          },
          {
            timeStamp: "2025-11-27T09:25:30Z",
            price: 3650.0,
          },
          {
            timeStamp: "2025-11-27T09:25:40Z",
            price: 3650.2,
          },
        ],
      },
      {
        stockId: "HDFCBANK",
        name: "HDFC Bank",
        symbol: "HDFCBANK",
        currentPrice: 1580.6,
        history: [
          {
            timeStamp: "2025-11-27T09:25:10Z",
            price: 1578.2,
          },
          {
            timeStamp: "2025-11-27T09:25:20Z",
            price: 1579.4,
          },
          {
            timeStamp: "2025-11-27T09:25:30Z",
            price: 1580.1,
          },
          {
            timeStamp: "2025-11-27T09:25:40Z",
            price: 1580.6,
          },
        ],
      },
      {
        stockId: "INFY",
        name: "Infosys",
        symbol: "INFY",
        currentPrice: 1420.35,
        history: [
          {
            timeStamp: "2025-11-27T09:25:10Z",
            price: 1418.7,
          },
          {
            timeStamp: "2025-11-27T09:25:20Z",
            price: 1419.5,
          },
          {
            timeStamp: "2025-11-27T09:25:30Z",
            price: 1420.1,
          },
          {
            timeStamp: "2025-11-27T09:25:40Z",
            price: 1420.35,
          },
        ],
      },
      {
        stockId: "BHARTIARTL",
        name: "Bharti Airtel",
        symbol: "BHARTIARTL",
        currentPrice: 1320.75,
        history: [
          {
            timeStamp: "2025-11-27T09:25:10Z",
            price: 1318.5,
          },
          {
            timeStamp: "2025-11-27T09:25:20Z",
            price: 1319.6,
          },
          {
            timeStamp: "2025-11-27T09:25:30Z",
            price: 1320.4,
          },
          {
            timeStamp: "2025-11-27T09:25:40Z",
            price: 1320.75,
          },
        ],
      },
    ];

    dispatch({ type: "SET_STOCKS", payload: initialStocks });

    initialStocks.forEach((stock) => {
      // startPriceUpdates(stock.symbol, stock.price);
    });
  };

  useEffect(() => {
    initializeDemoStocks();
  }, []); // runs only ONCE

  // // Fetch stocks on component mount
  // useEffect(() => {
  //   const fetchStocks = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8080/api/stocks");
  //       dispatch({ type: "SET_STOCKS", payload: response.data });
  //     } catch (error) {
  //       console.error("Error fetching stocks:", error);
  //     }
  //   };

  //   // Fetch immediately when component mounts
  //   fetchStocks();

  //   // Set interval to fetch every 60 seconds
  //   const intervalId = setInterval(fetchStocks, 6000);

  //   // Clear interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, []);

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
    // addStock,
    // removeStock,
    // updateShares,
    // clearPortfolio,

    // Computed values
    // getPortfolioValue,
    // getTotalInvested,
    // getPortfolioReturn,
  };
  return <StockCon.Provider value={value}>{children}</StockCon.Provider>;
};
