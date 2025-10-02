"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CustomerDetail() {
  const params = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    async function fetchCustomer() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/${params.id}`
      );
      const data = await res.json();
      setCustomer(data);
    }
    if (params.id) {
      fetchCustomer();
    }
  }, [params.id]);

  if (!customer) {
    return <p className="m-4">Loading customer details...</p>;
  }

  return (
    <main className="m-6 p-6 border border-gray-800 rounded-lg max-w-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-purple-900">
        Customer Details
      </h1>
      <div className="space-y-3 text-gray-800">
        <p>
          <strong>Name:</strong> {customer.name}
        </p>
        <p>
          <strong>Date of Birth:</strong>{" "}
          {customer.dateOfBirth
            ? new Date(customer.dateOfBirth).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <strong>Member Number:</strong> {customer.memberNumber}
        </p>
        <p>
          <strong>Interests:</strong> {customer.interests}
        </p>
      </div>

      <div className="mt-6">
        <a
          href="/customer"
          className="italic bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
        >
          ← Back to Customers
        </a>
      </div>
    </main>
  );
}