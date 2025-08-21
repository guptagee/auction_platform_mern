import { postCommissionProof } from "@/store/slices/commissionSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  RiImageLine, 
  RiUpload2Line, 
  RiCheckLine,
  RiAlertLine,
  RiMoneyRupeeCircleLine,
  RiArrowRightLine,
  RiReceiptLine,
  RiStarLine,
  RiFileTextLine
} from "react-icons/ri";

const SubmitCommission = () => {
  const [proof, setProof] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [proofPreview, setProofPreview] = useState("");
  const [errors, setErrors] = useState({});

  const proofHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProof(file);
      // Create preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setProofPreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    
    if (!proof) {
      newErrors.proof = "Please select a payment proof file";
    }
    
    if (!comment.trim()) {
      newErrors.comment = "Please add a comment";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.commission);
  
  const handlePaymentProof = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formData = new FormData();
    formData.append("proof", proof);
    formData.append("amount", amount);
    formData.append("comment", comment);
    dispatch(postCommissionProof(formData));
    
    // Reset form after successful submission
    setProof("");
    setAmount("");
    setComment("");
    setProofPreview("");
    setErrors({});
  };

  return (
    <div className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen bg-gradient-to-br from-dashboard-bg via-background to-dashboard-bg">
      {/* Beautiful Header Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Enhanced Header with Gradient Background */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/20 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center shadow-2xl">
                    <RiReceiptLine className="text-white text-3xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <RiStarLine className="text-white text-sm" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-3">
                    Submit Commission Proof
                  </h1>
                  <p className="text-muted-foreground text-xl">
                    Upload your payment proof to complete the commission process
                  </p>
                </div>
              </div>
              
              {/* Progress Indicator */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Fill Details</span>
                </div>
                <div className="w-8 h-0.5 bg-muted"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted rounded-full"></div>
                  <span>Upload Proof</span>
                </div>
                <div className="w-8 h-0.5 bg-muted"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted rounded-full"></div>
                  <span>Verification</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Form Container */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500">
            <form onSubmit={handlePaymentProof} className="space-y-8">
              
              {/* Amount Section */}
              <div className="group space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-success/20 to-success/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <RiMoneyRupeeCircleLine className="text-success text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Commission Amount</h2>
                    <p className="text-muted-foreground">Enter the commission amount you're paying</p>
                  </div>
                </div>
                
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (errors.amount) setErrors({ ...errors, amount: "" });
                    }}
                    placeholder="0.00"
                    className={`w-full px-4 py-4 pl-12 bg-background border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-foreground placeholder:text-muted-foreground/60 ${
                      errors.amount 
                        ? "border-red-500 focus:ring-red-500/20" 
                        : "border-border focus:ring-success/20 focus:border-success"
                    }`}
                    min="0"
                    step="0.01"
                    required
                  />
                  <RiMoneyRupeeCircleLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  {amount && !errors.amount && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <RiCheckLine className="text-success" size={20} />
                    </div>
                  )}
                </div>
                
                {errors.amount && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <RiAlertLine size={16} />
                    <span>{errors.amount}</span>
                  </div>
                )}
              </div>

              {/* Payment Proof Section */}
              <div className="group space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <RiImageLine className="text-primary text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Payment Proof</h2>
                    <p className="text-muted-foreground">Upload a screenshot or image of your payment</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* File Upload Area */}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="proof-file"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-2xl cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/5"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {proofPreview ? (
                          <div className="relative mb-4">
                            <img 
                              src={proofPreview} 
                              alt="Proof Preview" 
                              className="w-32 h-24 object-cover rounded-xl border-2 border-success/30 shadow-lg"
                            />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center shadow-lg">
                              <RiCheckLine className="text-white text-sm" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <RiUpload2Line className="text-primary text-3xl" />
                          </div>
                        )}
                        
                        <p className="mb-2 text-lg font-semibold text-foreground">
                          {proofPreview ? "File uploaded successfully!" : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-sm text-muted-foreground text-center">
                          {proofPreview ? "You can click to change the file" : "PNG, JPG, GIF up to 10MB"}
                        </p>
                      </div>
                      <input 
                        id="proof-file" 
                        type="file" 
                        className="hidden" 
                        onChange={proofHandler}
                        accept="image/*"
                        required
                      />
                    </label>
                  </div>
                  
                  {proofPreview && (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full">
                        <RiCheckLine size={16} />
                        <span className="font-medium">File uploaded successfully</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {errors.proof && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <RiAlertLine size={16} />
                    <span>{errors.proof}</span>
                  </div>
                )}
              </div>

              {/* Comment Section */}
              <div className="group space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <RiFileTextLine className="text-accent text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Additional Comments</h2>
                    <p className="text-muted-foreground">Add any relevant details or notes about your payment</p>
                  </div>
                </div>
                
                <div className="relative">
                  <textarea
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                      if (errors.comment) setErrors({ ...errors, comment: "" });
                    }}
                    placeholder="Enter your comments here... (e.g., payment method, transaction ID, etc.)"
                    rows={6}
                    className={`w-full px-4 py-4 bg-background border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-foreground placeholder:text-muted-foreground/60 resize-none ${
                      errors.comment 
                        ? "border-red-500 focus:ring-red-500/20" 
                        : "border-border focus:ring-accent/20 focus:border-accent"
                    }`}
                    required
                  />
                  {comment && !errors.comment && (
                    <div className="absolute bottom-4 right-4">
                      <RiCheckLine className="text-success" size={20} />
                    </div>
                  )}
                </div>
                
                {errors.comment && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <RiAlertLine size={16} />
                    <span>{errors.comment}</span>
                  </div>
                )}
              </div>

              {/* Enhanced Submit Button */}
              <div className="flex justify-center pt-8">
                <button 
                  className="group relative px-16 py-5 text-xl font-bold text-white bg-gradient-to-r from-primary via-accent to-primary rounded-2xl shadow-2xl hover:shadow-primary/25 transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                  type="submit"
                  disabled={loading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-accent/80 to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <RiUpload2Line size={24} />
                        Submit Commission Proof
                        <RiCheckLine size={24} className="group-hover:scale-110 transition-transform duration-300" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>

          
        </div>
      </section>
    </div>
  );
};

export default SubmitCommission;
