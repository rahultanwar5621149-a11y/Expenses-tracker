import React, { useState } from "react";

export default function App() {
  const [funds, setFunds] = useState({
    Medical: 0,
    Education: 0,
    Home: 0,
    Petrol: 0,
    Debt: 0,
    Personal: 0,
    Unexpected: 0,
    Miscellaneous: 0,
    Others: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Medical");
  const [date, setDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = Object.keys(funds);

  // Assign colors per category
  const categoryColors = {
    Medical: "bg-red-100 text-red-700",
    Education: "bg-blue-100 text-blue-700",
    Home: "bg-green-100 text-green-700",
    Petrol: "bg-yellow-100 text-yellow-700",
    Debt: "bg-purple-100 text-purple-700",
    Personal: "bg-pink-100 text-pink-700",
    Unexpected: "bg-orange-100 text-orange-700",
    Miscellaneous: "bg-gray-100 text-gray-700",
    Others: "bg-teal-100 text-teal-700",
  };

  // Allocate income
  const addIncome = () => {
    if (!amount || !date) return alert("Enter amount & date");
    const amt = parseFloat(amount);

    const newFunds = { ...funds, [category]: funds[category] + amt };
    setFunds(newFunds);

    setTransactions([
      {
        id: Date.now(),
        type: "income",
        category,
        amount: amt,
        date,
      },
      ...transactions,
    ]);

    setAmount("");
    setDate("");
  };

  // Add expense
  const addExpense = () => {
    if (!amount || !date) return alert("Enter amount & date");
    const amt = parseFloat(amount);
    if (amt > funds[category])
      return alert("Not enough funds in this category");

    const newFunds = { ...funds, [category]: funds[category] - amt };
    setFunds(newFunds);

    setTransactions([
      {
        id: Date.now(),
        type: "expense",
        category,
        amount: amt,
        date,
      },
      ...transactions,
    ]);

    setAmount("");
    setDate("");
  };

  // Delete a transaction
  const deleteTransaction = (id) => {
    const transactionToDelete = transactions.find((t) => t.id === id);

    if (!transactionToDelete) return;

    const { type, category, amount } = transactionToDelete;
    let updatedFunds = { ...funds };

    // Reverse the effect of the transaction
    if (type === "income") {
      updatedFunds[category] -= amount;
    } else {
      updatedFunds[category] += amount;
    }

    setFunds(updatedFunds);
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const totalBalance = Object.values(funds).reduce((a, b) => a + b, 0);

  // Filter transactions
  const filteredTransactions =
    filterCategory === "All"
      ? transactions
      : transactions.filter((t) => t.category === filterCategory);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        🎨 Fund-Based Expense Tracker
      </h1>

      {/* Input Section */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={addIncome}
            className="bg-green-500 text-white px-4 py-2 rounded shadow"
          >
            + Add Income
          </button>

          <button
            onClick={addExpense}
            className="bg-red-500 text-white px-4 py-2 rounded shadow"
          >
            - Add Expense
          </button>
        </div>
      </div>

      {/* Fund Balances with Colors */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <h2 className="text-lg font-bold mb-4">📦 Fund Balances</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div
              key={c}
              className={`p-4 rounded-xl shadow font-bold text-center ${categoryColors[c]}`}
            >
              {c}: ₹{funds[c]}
            </div>
          ))}
        </div>
        <p className="mt-4 font-bold text-center">
          💵 Total Balance: ₹{totalBalance}
        </p>
      </div>

      {/* Transaction Filter */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <label className="font-bold mr-2">Filter by Category:</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
        <h2 className="text-lg font-bold mb-4">📊 Transactions</h2>
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2">Date</th>
              <th className="border border-gray-400 p-2">Category</th>
              <th className="border border-gray-400 p-2">Type</th>
              <th className="border border-gray-400 p-2">Amount</th>
              <th className="border border-gray-400 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id}>
                <td className="border border-gray-400 p-2">{t.date}</td>
                <td
                  className={`border border-gray-400 p-2 font-bold ${
                    categoryColors[t.category]
                  }`}
                >
                  {t.category}
                </td>
                <td className="border border-gray-400 p-2">{t.type}</td>
                <td
                  className={`border border-gray-400 p-2 font-bold ${
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{t.amount}
                </td>
                <td className="border border-gray-400 p-2 text-center">
                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded shadow"
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filterCategory !== "All" && (
          <p className="mt-4 font-bold text-center">
            🔍 Current Balance in {filterCategory}: ₹{funds[filterCategory]}
          </p>
        )}
      </div>
    </div>
  );
}
