import {
  deletePaymentProof,
  getSinglePaymentProofDetail,
  updateProofStatus,
} from "@/store/slices/superAdminSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentProofs = () => {
  const { paymentProofs, singlePaymentProof } = useSelector(
    (state) => state.superAdmin
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useDispatch();

  const handlePaymentProofDelete = (id) => {
    dispatch(deletePaymentProof(id));
  };

  const handleFetchPaymentDetail = (id) => {
    dispatch(getSinglePaymentProofDetail(id));
  };

  useEffect(() => {
    if (singlePaymentProof && Object.keys(singlePaymentProof).length > 0) {
      setOpenDrawer(true);
    }
  }, [singlePaymentProof]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white mt-5 border border-border rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium">User ID</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {paymentProofs.length > 0 ? (
              paymentProofs.map((element, index) => {
                return (
                  <tr key={index} className="border-b border-border hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{element.userId}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        element.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                        element.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        element.status?.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {element.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm"
                          onClick={() => handleFetchPaymentDetail(element._id)}
                        >
                          Update
                        </button>
                        <button
                          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm"
                          onClick={() => handlePaymentProofDelete(element._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="text-center text-xl text-sky-600 py-8">
                <td colSpan="3">No payment proofs are found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Drawer setOpenDrawer={setOpenDrawer} openDrawer={openDrawer} />
    </>
  );
};

export default PaymentProofs;

export const Drawer = ({ setOpenDrawer, openDrawer }) => {
  const { singlePaymentProof, loading } = useSelector(
    (state) => state.superAdmin
  );
  const [amount, setAmount] = useState(singlePaymentProof.amount || "");
  const [status, setStatus] = useState(singlePaymentProof.status || "");

  const dispatch = useDispatch();
  const handlePaymentProofUpdate = () => {
    try {
      console.log("🔍 Updating payment proof:", {
        id: singlePaymentProof._id,
        status,
        amount: Number(amount)
      });
      
      // Validate data before sending
      if (!status || !amount || amount <= 0) {
        toast.error("Please provide valid status and amount");
        return;
      }
      
      const updateData = {
        status,
        amount: Number(amount)
      };
      
      dispatch(updateProofStatus(singlePaymentProof._id, updateData));
      setOpenDrawer(false); // Close drawer after update
    } catch (error) {
      console.error("❌ Error in handlePaymentProofUpdate:", error);
      toast.error("Failed to update payment proof");
    }
  };

  return (
    <>
      <section
        className={`fixed ${
          openDrawer && singlePaymentProof.userId ? "bottom-0" : "-bottom-full"
        }  left-0 w-full transition-all duration-300 h-full bg-[#00000087] flex items-end`}
      >
        <div className="bg-white h-fit transition-all duration-300 w-full">
          <div className="w-full px-5 py-8 sm:max-w-[640px] sm:m-auto">
            <p className="text-stone-600">
              You can update payment status and amount.
            </p>
            <form className="flex flex-col gap-5 my-5">
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-stone-600 ">User ID</label>
                <input
                  type="text"
                  value={singlePaymentProof.userId || ""}
                  disabled
                  onChange={(e) => e.target.value}
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none  text-stone-600"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-stone-600">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-stone-600">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Settled">Settled</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-stone-600">Comment</label>
                <textarea
                  rows={5}
                  value={singlePaymentProof.comment || ""}
                  onChange={(e) => e.target.value}
                  disabled
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none text-stone-600"
                />
              </div>
              <div>
                <Link
                  to={singlePaymentProof.proof?.url || ""}
                  className="bg-[#D6482B] flex justify-center w-full py-2 rounded-md text-white font-semibold text-xl transition-all duration-300 hover:bg-[#b8381e]"
                  target="_blank"
                >
                  Payment Proof (SS)
                </Link>
              </div>
              <div>
                <button
                  type="button"
                  className="bg-blue-500 flex justify-center w-full py-2 rounded-md text-white font-semibold text-xl transition-all duration-300 hover:bg-blue-700"
                  onClick={handlePaymentProofUpdate}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="bg-yellow-500 flex justify-center w-full py-2 rounded-md text-white font-semibold text-xl transition-all duration-300 hover:bg-yellow-700"
                  onClick={() => setOpenDrawer(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
