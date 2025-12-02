// src/services/PortfolioCalculatorService.js

export const calculatePortfolioSummary = (userStocks, stocks) => {
  if (!userStocks || !stocks || userStocks.length === 0) {
    return {
      totalValue: 0,
      totalInvested: 0,
      totalReturn: 0,
      absoluteReturn: 0,
      stocksCount: 0,
      topPerformer: null,
    };
  }

  // Create a map with StockId as key (case-sensitive)
  const stocksMap = new Map(stocks.map((stock) => [stock.StockId, stock]));

  const totalValue = userStocks.reduce((sum, userStock) => {
    const stock = stocksMap.get(userStock.stockId);
    if (stock && userStock) {
      return sum + stock.CurrentPrice * userStock.quantity;
    }
    return sum;
  }, 0);

  const totalInvestedToCalc = userStocks.reduce((sum, userStock) => {
    return sum + (userStock.investedAmount || 0);
  }, 0);

  const totalInvested = userStocks
    .filter((stock) => stock.quantity > 0)
    .reduce((sum, stock) => sum + (stock.investedAmount || 0), 0);

  // const absoluteReturn = totalValue - totalInvestedToCalc;
  const absoluteReturn = totalValue - totalInvested;
  // console.log("this is in calc");
  // console.log(totalInvestedToCalc);
  // console.log(absoluteReturn);
  // Update totalReturn to use totalInvestedToCalc for denominator
  // const totalReturn =
  //   Math.abs(totalInvestedToCalc) > 0
  //     ? (absoluteReturn / Math.abs(totalInvestedToCalc)) * 100
  //     : 0;
  const totalReturn =
    Math.abs(totalInvested) > 0
      ? (absoluteReturn / Math.abs(totalInvested)) * 100
      : 0;
  // console.log(totalReturn);
  const stocksCount = userStocks.filter((stock) => stock.quantity > 0).length;

  const topPerformer = userStocks.reduce(
    (top, userStock) => {
      const stock = stocksMap.get(userStock.stockId);
      if (!stock || !stock.history || stock.history.length < 2) return top;
      const initialPrice = stock.history[0].price;
      const currentPrice = stock.CurrentPrice;
      const stockReturn = ((currentPrice - initialPrice) / initialPrice) * 100;
      return stockReturn > top.return
        ? { symbol: stock.symbol, return: stockReturn }
        : top;
    },
    { symbol: "", return: -Infinity }
  );

  return {
    totalValue,
    totalInvested,
    totalReturn,
    absoluteReturn,
    stocksCount,
    topPerformer,
  };
};
