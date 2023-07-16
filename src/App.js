import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [currency, setCurrency] = useState("PHP");
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("income");
  const [modalAmount, setModalAmount] = useState("");
  const [modalItemName, setModalItemName] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    const savedIncome = localStorage.getItem("income");
    const savedExpenses = localStorage.getItem("expenses");

    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
    if (savedIncome && savedIncome !== "") {
      setIncome(JSON.parse(savedIncome));
    }
    if (savedExpenses && savedExpenses !== "") {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  const sortedIncome = [...income].sort((a, b) => b.amount - a.amount);
  const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  useEffect(() => {
    const calculateSavings = () => {
      let incomeValue = 0;
      let expensesValue = 0;

      income.forEach((item) => {
        incomeValue += parseFloat(item.amount);
      });

      expenses.forEach((item) => {
        expensesValue += parseFloat(item.amount);
      });

      if (!isNaN(incomeValue) && !isNaN(expensesValue)) {
        const savings = incomeValue - expensesValue;
        setMonthlySavings(savings.toFixed(2));
      } else {
        setMonthlySavings(0);
      }
    };

    localStorage.setItem("income", JSON.stringify(income));
    calculateSavings();
  }, [expenses, income]);

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalType("income");
    setModalAmount("");
    setModalItemName("");
    setEditingItem(null);
  };

  const handleModalTypeChange = (event) => {
    setModalType(event.target.value);
  };

  const handleModalAmountChange = (event) => {
    setModalAmount(event.target.value);
  };

  const handleModalItemNameChange = (event) => {
    setModalItemName(event.target.value);
  };

  const handleAddItem = () => {
    if (modalAmount !== "" && modalItemName !== "") {
      const newItem = {
        amount: parseFloat(modalAmount) * (modalType === "income" ? 1 : 1),
        itemName: modalItemName,
      };

      if (editingItem) {
        if (modalType === "income") {
          const updatedIncome = income.map((item) =>
            item === editingItem ? newItem : item
          );
          setIncome(updatedIncome);
        } else {
          const updatedExpenses = expenses.map((item) =>
            item === editingItem ? newItem : item
          );
          setExpenses(updatedExpenses);
        }
        setEditingItem(null);
      } else {
        if (modalType === "income") {
          setIncome([...income, newItem]);
        } else {
          setExpenses([...expenses, newItem]);
        }
      }
    }

    handleModalClose();
  };

  const handleEditItem = (item) => {
    setModalType(item.amount >= 0 ? "income" : "expense");
    setModalAmount(Math.abs(item.amount).toString());
    setModalItemName(item.itemName);
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    if (income.includes(item)) {
      const updatedIncome = income.filter((i) => i !== item);
      setIncome(updatedIncome);
    } else {
      const updatedExpenses = expenses.filter((i) => i !== item);
      setExpenses(updatedExpenses);
    }
  };

  useEffect(() => {
    localStorage.setItem("income", JSON.stringify(income));
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [income, expenses]);

  return (
    <div className="bg-slate-900 text-white flex items-center justify-center h-screen">
      <div className="bg-white/20 border-slate-400/80 border rounded-md shadow-lg p-6 max-w-md">
        <h1 className="text-3xl font-bold mb-2">Saver Tracker</h1>
        <div className="mb-6">
          <p className="text-gray-400 max-w-sm">
            This is a simple savings tracker app built with React. This web app
            only stores the data on your browser's local storage.
          </p>
        </div>
        <div className="mb-6">
          <label htmlFor="currency" className="text-lg font-medium mr-2">
            Select Currency:
          </label>
          <select
            id="currency"
            className="bg-slate-800/40 text-gray-200 border rounded-lg py-2 px-4"
            value={currency}
            onChange={handleCurrencyChange}
          >
            <option value="PHP">PHP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div className="mb-6">
          <p className="text-lg font-medium">
            Monthly Income:
            <span className="mx-1 px-2 py-1 rounded-md bg-green-500">
              {currency}{" "}
              {Array.isArray(income)
                ? income
                    .reduce((total, item) => total + parseFloat(item.amount), 0)
                    .toFixed(2)
                : 0}
            </span>
          </p>
        </div>
        <div className="mb-6">
          <p className="text-lg font-medium">
            Monthly Expenses:
            <span className="mx-1 px-2 py-1 rounded-md bg-red-500">
              {currency}{" "}
              {Array.isArray(expenses)
                ? expenses
                    .reduce((total, item) => total + parseFloat(item.amount), 0)
                    .toFixed(2)
                : 0}
            </span>
          </p>
        </div>
        <div className="mb-6">
          <p className="text-lg font-medium">
            Potential Monthly Savings:{" "}
            <span className="mx-1 px-2 py-1 rounded-md bg-green-500">
              {currency} {monthlySavings}
            </span>
          </p>
        </div>
        <div className="mb-6">
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            onClick={handleModalOpen}
          >
            Add Income/Expense
          </button>
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">Items:</h2>
          <ul className="rounded-lg p-2 mt-2">
            <li className="text-lg font-semibold mb-2">Income:</li>
            {sortedIncome.map((item, index) => (
              <li
                key={`income-${index}`}
                className={`bg-green-500 bg-opacity-50 hover:bg-opacity-75 rounded-lg p-2 mb-2 flex justify-between items-center`}
              >
                <span className="text-lg font-semibold">{item.itemName}:</span>{" "}
                {currency} {Math.abs(item.amount).toFixed(2)}{" "}
                <button
                  className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md font-semibold text-gray-200 ml-2"
                  onClick={() => handleDeleteItem(item)}
                >
                  Delete
                </button>
              </li>
            ))}
            <li className="text-lg font-semibold my-2">Expenses:</li>
            {sortedExpenses.map((item, index) => (
              <li
                key={`expense-${index}`}
                className={`bg-red-500 bg-opacity-50 hover:bg-opacity-75 rounded-lg p-2 mb-2 flex justify-between items-center`}
              >
                <span className="text-lg font-semibold">{item.itemName}:</span>{" "}
                {currency} {Math.abs(item.amount).toFixed(2)}{" "}
                <button
                  className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-md font-semibold text-gray-200 ml-2"
                  onClick={() => handleEditItem(item)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md font-semibold text-gray-200 ml-2"
                  onClick={() => handleDeleteItem(item)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          {/* Footer */}
          <footer className="mt-6 flex items-center bg-slate-600 px-4 py-2 rounded-md">
            <p className="text-gray-400">Created by Marcus David Alo</p>
            <a
              href="https://github.com/marcusdavidalo"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
            >
              <svg
                className="h-6 w-6 text-gray-200 hover:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-github"
                viewBox="0 0 16 16"
              >
                {" "}
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />{" "}
              </svg>
            </a>
          </footer>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900 opacity-50 -z-10"></div>
          <div className="bg-slate-800/50 border-slate-400/80 border backdrop-blur-md rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Add Income/Expense</h2>
            <div className="flex items-center mb-4">
              <input
                id="income-type"
                type="radio"
                value="income"
                checked={modalType === "income"}
                onChange={handleModalTypeChange}
              />
              <label htmlFor="income-type" className="ml-2 mr-4">
                Income
              </label>
              <input
                id="expense-type"
                type="radio"
                value="expense"
                checked={modalType === "expense"}
                onChange={handleModalTypeChange}
              />
              <label htmlFor="expense-type" className="ml-2">
                Expense
              </label>
            </div>
            <div className="mb-4">
              <input
                id="modal-item-name"
                className="border rounded-lg py-2 px-4 bg-slate-800/40"
                type="text"
                placeholder="Item Name"
                value={modalItemName}
                onChange={handleModalItemNameChange}
              />
            </div>
            <div className="mb-4">
              <input
                id="modal-amount"
                className="border rounded-lg py-2 px-4 bg-slate-800/40"
                type="number"
                placeholder="Amount"
                value={modalAmount}
                onChange={handleModalAmountChange}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded ml-4"
                onClick={handleAddItem}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
