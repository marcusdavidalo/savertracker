import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./main.png";

const currencySymbols = {
  PHP: "₱",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
  CHF: "Fr.",
  CNY: "¥",
  INR: "₹",
};

const intervals = ["Daily", "Weekly", "Monthly", "Yearly", "Custom"];

const App = () => {
  const [currency, setCurrency] = useState("PHP");
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("income");
  const [modalAmount, setModalAmount] = useState("");
  const [modalItemName, setModalItemName] = useState("");
  const [modalInterval, setModalInterval] = useState("Monthly");
  const [modalCustomInterval, setModalCustomInterval] = useState(1);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    const savedIncome = JSON.parse(localStorage.getItem("income")) || [];
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const savedTaxRate = localStorage.getItem("taxRate");

    if (savedCurrency) setCurrency(savedCurrency);
    if (savedTaxRate) setTaxRate(savedTaxRate);
    setIncome(savedIncome);
    setExpenses(savedExpenses);
  }, []);

  useEffect(() => {
    localStorage.setItem("currency", currency);
    localStorage.setItem("taxRate", taxRate);
    localStorage.setItem("income", JSON.stringify(income));
    localStorage.setItem("expenses", JSON.stringify(expenses));

    const calculateSavings = () => {
      const calculateTotal = (items) => {
        return items.reduce((total, item) => {
          let amount = parseFloat(item.amount);
          switch (item.interval) {
            case "Daily":
              amount *= 30;
              break;
            case "Weekly":
              amount *= 4;
              break;
            case "Yearly":
              amount /= 12;
              break;
            case "Custom":
              amount *= item.customInterval;
              break;
            default:
              break;
          }
          return total + amount;
        }, 0);
      };

      const totalIncome = calculateTotal(income);
      const totalExpenses = calculateTotal(expenses);
      const savings =
        totalIncome - totalExpenses - (totalIncome * taxRate) / 100;
      setMonthlySavings(savings.toFixed(2));
    };

    calculateSavings();
  }, [currency, taxRate, income, expenses]);

  const handleCurrencyChange = (event) => setCurrency(event.target.value);
  const handleTaxRateChange = (event) => setTaxRate(event.target.value);
  const toggleModal = () => setModalOpen(!modalOpen);

  const handleAddOrUpdateItem = () => {
    const newItem = {
      amount: parseFloat(modalAmount),
      itemName: modalItemName,
      interval: modalInterval,
      customInterval: modalCustomInterval,
    };

    if (editingItem) {
      if (modalType === "income") {
        setIncome(
          income.map((item) => (item === editingItem ? newItem : item))
        );
      } else {
        setExpenses(
          expenses.map((item) => (item === editingItem ? newItem : item))
        );
      }
    } else {
      if (modalType === "income") {
        setIncome([...income, newItem]);
      } else {
        setExpenses([...expenses, newItem]);
      }
    }

    resetModal();
  };

  const handleEditItem = (item, type) => {
    setModalType(type);
    setModalAmount(item.amount.toString());
    setModalItemName(item.itemName);
    setModalInterval(item.interval);
    setModalCustomInterval(item.customInterval || 1);
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    if (income.includes(item)) {
      setIncome(income.filter((i) => i !== item));
    } else {
      setExpenses(expenses.filter((i) => i !== item));
    }
  };

  const resetModal = () => {
    setModalOpen(false);
    setModalType("income");
    setModalAmount("");
    setModalItemName("");
    setModalInterval("Monthly");
    setModalCustomInterval(1);
    setEditingItem(null);
  };

  const renderItem = (item, index, type) => (
    <li
      key={`${type}-${index}`}
      className="flex justify-between items-center p-2 mb-2 border-b border-gray-600"
    >
      <span className="flex-1">
        {type === "income" ? "💰" : "💸"} {item.itemName}:{" "}
        {currencySymbols[currency]} {Math.abs(item.amount).toFixed(2)} (
        {item.interval})
      </span>
      <button
        className="bg-gray-500 hover:bg-gray-600 px-2 py-1 rounded ml-2"
        onClick={() => handleEditItem(item, type)}
      >
        Edit
      </button>
      <button
        className="bg-gray-500 hover:bg-gray-600 px-2 py-1 rounded ml-2"
        onClick={() => handleDeleteItem(item)}
      >
        Delete
      </button>
    </li>
  );

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex items-center justify-center font-sans">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Saver Tracker</h1>
          <a
            href="https://github.com/marcusdavidalo/savertracker"
            className="w-10"
          >
            <img src={logo} alt="Logo" className="w-full h-full" />
          </a>
        </div>
        <p className="text-gray-400 mb-4">
          A simple savings tracker app built with React. Data is stored in your
          browser's local storage.
        </p>
        <div className="mb-4">
          <label htmlFor="currency" className="mr-2">
            Currency:
          </label>
          <select
            id="currency"
            className="bg-gray-700 border border-gray-600 p-2 rounded"
            value={currency}
            onChange={handleCurrencyChange}
          >
            {Object.keys(currencySymbols).map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="taxRate" className="mr-2">
            Tax Rate (%):
          </label>
          <input
            id="taxRate"
            className="bg-gray-700 border border-gray-600 p-2 rounded"
            type="number"
            value={taxRate}
            onChange={handleTaxRateChange}
          />
        </div>
        <p className="mb-4">
          Income: {currencySymbols[currency]}{" "}
          {income.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
        </p>
        <p className="mb-4">
          Expenses: {currencySymbols[currency]}{" "}
          {expenses.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
        </p>
        <p className="mb-4">
          Monthly Savings: {currencySymbols[currency]} {monthlySavings}
        </p>
        <div className="mb-4">
          <button
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
            onClick={() => {
              setModalType("income");
              toggleModal();
            }}
          >
            + Add Income
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded ml-2"
            onClick={() => {
              setModalType("expense");
              toggleModal();
            }}
          >
            - Add Expense
          </button>
        </div>
        <h2 className="text-xl font-bold mb-2">Income</h2>
        <ul>
          {income.map((item, index) => renderItem(item, index, "income"))}
        </ul>
        <h2 className="text-xl font-bold mb-2">Expenses</h2>
        <ul>
          {expenses.map((item, index) => renderItem(item, index, "expense"))}
        </ul>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingItem ? "Edit" : "Add"}{" "}
              {modalType === "income" ? "Income" : "Expense"}
            </h2>
            <div className="mb-4">
              <input
                type="radio"
                id="income"
                value="income"
                checked={modalType === "income"}
                onChange={() => setModalType("income")}
                className="mr-2"
              />
              <label htmlFor="income" className="mr-4">
                Income
              </label>
              <input
                type="radio"
                id="expense"
                value="expense"
                checked={modalType === "expense"}
                onChange={() => setModalType("expense")}
                className="mr-2"
              />
              <label htmlFor="expense">Expense</label>
            </div>
            <input
              className="bg-gray-700 border border-gray-600 p-2 rounded w-full mb-4"
              type="text"
              placeholder="Item Name"
              value={modalItemName}
              onChange={(e) => setModalItemName(e.target.value)}
            />
            <input
              className="bg-gray-700 border border-gray-600 p-2 rounded w-full mb-4"
              type="number"
              placeholder="Amount"
              value={modalAmount}
              onChange={(e) => setModalAmount(e.target.value)}
            />
            <div className="mb-4">
              <label htmlFor="interval" className="mr-2">
                Interval:
              </label>
              <select
                id="interval"
                className="bg-gray-700 border border-gray-600 p-2 rounded w-full mb-4"
                value={modalInterval}
                onChange={(e) => setModalInterval(e.target.value)}
              >
                {intervals.map((interval) => (
                  <option key={interval} value={interval}>
                    {interval}
                  </option>
                ))}
              </select>
            </div>
            {modalInterval === "Custom" && (
              <input
                className="bg-gray-700 border border-gray-600 p-2 rounded w-full mb-4"
                type="number"
                placeholder="Custom Interval (in months)"
                value={modalCustomInterval}
                onChange={(e) => setModalCustomInterval(e.target.value)}
              />
            )}
            <div className="flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded mr-2"
                onClick={resetModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                onClick={handleAddOrUpdateItem}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
