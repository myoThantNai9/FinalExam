"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";

export default function CustomerPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const [customerList, setCustomerList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  // DataGrid columns
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 180,
      renderCell: (params) => (
        <a
          href={`/customer/${params.row._id}`}
          className="text-blue-600 underline font-medium"
        >
          {params.value}
        </a>
      ),
    },
    { field: "dateOfBirth", headerName: "Date of Birth", width: 180 },
    { field: "memberNumber", headerName: "Member Number", width: 180 },
    { field: "interests", headerName: "Interests", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button onClick={() => startEditMode(params.row)}>📝</button>
          <button onClick={() => deleteCustomer(params.row)}>🗑️</button>
        </div>
      ),
    },
  ];

  // Fetch all customers
  async function fetchCustomer() {
    const res = await fetch(`${API_BASE}/customer`);
    const data = await res.json();
    const mapped = data.map((customer) => ({
      ...customer,
      id: customer._id, // required by DataGrid
      dateOfBirth: customer.dateOfBirth
        ? new Date(customer.dateOfBirth).toISOString().split("T")[0]
        : "",
    }));
    setCustomerList(mapped);
  }

  useEffect(() => {
    fetchCustomer();
  }, []);

  // Form submit (Add / Update)
  function handleCustomerFormSubmit(data) {
    if (editMode) {
      fetch(`${API_BASE}/customer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(() => {
        stopEditMode();
        fetchCustomer();
      });
      return;
    }

    // Create new customer
    fetch(`${API_BASE}/customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(() => fetchCustomer());
  }

  // Start edit mode
  function startEditMode(customer) {
    reset(customer);
    setEditMode(true);
  }

  // Stop edit mode
  function stopEditMode() {
    reset({
      name: "",
      dateOfBirth: "",
      memberNumber: "",
      interests: "",
    });
    setEditMode(false);
  }

  // Delete customer
  async function deleteCustomer(customer) {
    if (!confirm(`Are you sure to delete [${customer.name}]`)) return;
    await fetch(`${API_BASE}/customer/${customer._id}`, { method: "DELETE" });
    fetchCustomer();
  }

  return (
    <main>
      {/* Form */}
      <form onSubmit={handleSubmit(handleCustomerFormSubmit)}>
        <div className="grid grid-cols-2 gap-4 w-fit m-4 border border-gray-800 p-2">
          <div>Name:</div>
          <div>
            <input
              name="name"
              type="text"
              {...register("name", { required: true })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>

          <div>Date of Birth:</div>
          <div>
            <input
              name="dateOfBirth"
              type="date"
              {...register("dateOfBirth", { required: true })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>

          <div>Member Number:</div>
          <div>
            <input
              name="memberNumber"
              type="number"
              {...register("memberNumber", { required: true })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>

          <div>Interests:</div>
          <div>
            <input
              name="interests"
              type="text"
              {...register("interests")}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>

          <div className="col-span-2 text-right">
            {editMode ? (
              <>
                <input
                  type="submit"
                  value="Update"
                  className="italic bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                />{" "}
                <button
                  type="button"
                  onClick={() => stopEditMode()}
                  className="italic bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Cancel
                </button>
              </>
            ) : (
              <input
                type="submit"
                value="Add"
                className="w-20 italic bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              />
            )}
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="mx-4">
        <DataGrid rows={customerList} columns={columns} autoHeight />
      </div>
    </main>
  );
}