import { createAuction } from "@/store/slices/auctionSlice";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  RiAuctionFill, 
  RiImageLine, 
  RiCalendarLine, 
  RiMoneyDollarCircleLine,
  RiPriceTag3Line,
  RiFileTextLine,
  RiUpload2Line,
  RiArrowRightLine,
  RiCheckLine,
  RiStarLine
} from "react-icons/ri";
import "react-datepicker/dist/react-datepicker.css";

const CreateAuction = () => {
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const auctionCategories = [
    "Electronics",
    "Furniture",
    "Art & Antiques",
    "Jewelry & Watches",
    "Automobiles",
    "Real Estate",
    "Collectibles",
    "Fashion & Accessories",
    "Sports Memorabilia",
    "Books & Manuscripts",
  ];

  const imageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(file);
      setImagePreview(reader.result);
    };
  };

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auction);

  const handleCreateAuction = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("startingBid", startingBid);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    dispatch(createAuction(formData));
  };

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  useEffect(() => {
    if (!isAuthenticated || user.role !== "Auctioneer") {
      navigateTo("/");
    }
  }, [isAuthenticated]);

  return (
    <article className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen bg-gradient-to-br from-dashboard-bg via-background to-dashboard-bg">
      {/* Header Section with Enhanced Design */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto">
          {/* Beautiful Header with Gradient Background */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/20 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center shadow-2xl">
                    <RiAuctionFill className="text-white text-3xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <RiStarLine className="text-white text-sm" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-3">
                    Create New Auction
                  </h1>
                  <p className="text-muted-foreground text-xl">
                    List your item and start receiving bids from eager buyers
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
                  <span>Review & Submit</span>
                </div>
                <div className="w-8 h-0.5 bg-muted"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted rounded-full"></div>
                  <span>Go Live!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Form Container */}
          <form onSubmit={handleCreateAuction} className="space-y-8">
            
            {/* Basic Information Section */}
            <div className="group bg-card border border-border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-primary/30">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <RiFileTextLine className="text-primary text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Basic Information</h2>
                  <p className="text-muted-foreground">Tell us about your auction item</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Enhanced Title Input */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <RiFileTextLine className="text-primary" size={18} />
                    Auction Title
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a descriptive title for your auction"
                      className="w-full px-4 py-4 pl-12 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground/60 group-hover:border-primary/50"
                      required
                    />
                    <RiFileTextLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-300" size={20} />
                    {title && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <RiCheckLine className="text-success" size={20} />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Enhanced Category Select */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <RiPriceTag3Line className="text-primary" size={18} />
                    Category
                  </label>
                  <div className="relative group">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-4 pl-12 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-foreground appearance-none cursor-pointer group-hover:border-primary/50"
                      required
                    >
                      <option value="">Select a category</option>
                      {auctionCategories.map((element) => (
                        <option key={element} value={element}>
                          {element}
                        </option>
                      ))}
                    </select>
                    <RiPriceTag3Line className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-300" size={20} />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Condition Select */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <RiStarLine className="text-primary" size={18} />
                    Item Condition
                  </label>
                  <div className="relative group">
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full px-4 py-4 pl-12 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-foreground appearance-none cursor-pointer group-hover:border-primary/50"
                      required
                    >
                      <option value="">Select condition</option>
                      <option value="New">New - Brand new, never used</option>
                      <option value="Used">Used - Previously owned</option>
                    </select>
                    <RiStarLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-300" size={20} />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Starting Bid Input */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <RiMoneyDollarCircleLine className="text-primary" size={18} />
                    Starting Bid ($)
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      value={startingBid}
                      onChange={(e) => setStartingBid(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-4 pl-12 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground/60 group-hover:border-primary/50"
                      min="0"
                      step="0.01"
                      required
                    />
                    <RiMoneyDollarCircleLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-300" size={20} />
                    {startingBid && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <RiCheckLine className="text-success" size={20} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Description Section */}
            <div className="group bg-card border border-border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-accent/30">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <RiFileTextLine className="text-accent text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Item Description</h2>
                  <p className="text-muted-foreground">Provide detailed information about your item</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-sm font-semibold text-foreground">
                  Detailed Description
                </label>
                <div className="relative group">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your item in detail... Include features, specifications, condition details, history, and any other relevant information that would help bidders make informed decisions."
                    className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all duration-300 text-foreground placeholder:text-muted-foreground/60 min-h-[140px] resize-none group-hover:border-accent/50"
                    rows={6}
                    required
                  />
                  {description && (
                    <div className="absolute bottom-4 right-4">
                      <RiCheckLine className="text-success" size={20} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
                  <RiStarLine size={14} />
                  <span>Be detailed and honest about the item's condition and features</span>
                </div>
              </div>
            </div>

            {/* Enhanced Timing Section */}
            <div className="group bg-card border border-border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-warning/30">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-warning/20 to-warning/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <RiCalendarLine className="text-warning text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Auction Timing</h2>
                  <p className="text-muted-foreground">Set when your auction starts and ends</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Enhanced Start Time */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    Start Date & Time
                  </label>
                  <div className="relative group">
                    <DatePicker
                      selected={startTime}
                      onChange={(date) => setStartTime(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      placeholderText="Select start date and time"
                      className="w-full px-4 py-4 pl-12 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-4 focus:ring-warning/20 focus:border-warning transition-all duration-300 text-foreground group-hover:border-warning/50"
                      minDate={new Date()}
                      required
                    />
                    <RiCalendarLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-warning transition-colors duration-300" size={20} />
                  </div>
                </div>
                
                {/* Enhanced End Time */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    End Date & Time
                  </label>
                  <div className="relative group">
                    <DatePicker
                      selected={endTime}
                      onChange={(date) => setEndTime(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      placeholderText="Select end date and time"
                      className="w-full px-4 py-4 pl-12 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-4 focus:ring-warning/20 focus:border-warning transition-all duration-300 text-foreground group-hover:border-warning/50"
                      minDate={startTime || new Date()}
                      required
                    />
                    <RiCalendarLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-warning transition-colors duration-300" size={20} />
                  </div>
                </div>
              </div>
              
              {/* Enhanced Tip Box */}
              <div className="mt-6 p-6 bg-gradient-to-r from-warning/10 to-warning/5 border border-warning/20 rounded-2xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <RiCalendarLine className="text-warning text-lg" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-warning mb-2">Pro Tips for Auction Timing</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Set your auction to start at least 1 hour from now</li>
                      <li>• Consider ending during peak bidding hours (7-9 PM)</li>
                      <li>• Longer auctions (3-7 days) often get more bids</li>
                      <li>• Avoid ending on major holidays or weekends</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Image Upload Section */}
            <div className="group bg-card border border-border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-success/30">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-success/20 to-success/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <RiImageLine className="text-success text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Item Images</h2>
                  <p className="text-muted-foreground">High-quality images increase bidder interest</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-border rounded-2xl cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all duration-300 group-hover:border-success/50 group-hover:bg-success/5"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {imagePreview ? (
                        <div className="relative mb-4">
                          <img 
                            src={imagePreview} 
                            alt={title || "Preview"} 
                            className="w-56 h-40 object-cover rounded-xl border-2 border-success/30 shadow-lg"
                          />
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center shadow-lg">
                            <RiCheckLine className="text-white text-lg" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-success/20 to-success/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <RiUpload2Line className="text-success text-3xl" />
                        </div>
                      )}
                      
                      <p className="mb-2 text-lg font-semibold text-foreground">
                        {imagePreview ? "Image uploaded successfully!" : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-sm text-muted-foreground text-center">
                        {imagePreview ? "You can click to change the image" : "PNG, JPG, GIF up to 10MB"}
                      </p>
                    </div>
                    <input 
                      id="dropzone-file" 
                      type="file" 
                      className="hidden" 
                      onChange={imageHandler}
                      accept="image/*"
                      required
                    />
                  </label>
                </div>
                
                {imagePreview && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full">
                      <RiCheckLine size={16} />
                      <span className="font-medium">Image uploaded successfully</span>
                    </div>
                  </div>
                )}
              </div>
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
                      Creating Auction...
                    </>
                  ) : (
                    <>
                      <RiAuctionFill size={24} />
                      Create Auction
                      <RiArrowRightLine size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>
      </section>
    </article>
  );
};

export default CreateAuction;
