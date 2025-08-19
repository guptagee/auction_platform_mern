import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FeaturedAuctions from "./home-sub-components/FeaturedAuctions";
import UpcomingAuctions from "./home-sub-components/UpcomingAuctions";
import Leaderboard from "./home-sub-components/Leaderboard";
import Spinner from "@/custom-components/Spinner";

const Home = () => {
  const howItWorks = [
    { title: "Post Items", description: "Auctioneer posts items for bidding." },
    { title: "Place Bids", description: "Bidders place bids on listed items." },
    {
      title: "Win Notification",
      description: "Highest bidder receives a winning email.",
    },
    {
      title: "Payment & Fees",
      description: "Bidder pays; auctioneer pays 5% fee.",
    },
  ];

  const { isAuthenticated } = useSelector((state) => state.user);
  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen bg-gradient-to-br from-dashboard-bg to-background">
      <div className="p-6 lg:p-8">
        <div className="mb-12">
          <p className="text-muted-foreground font-semibold text-xl mb-8">
            Transparency Leads to Your Victory
          </p>
          <h1
            className={`text-foreground text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
          >
            Transparent Auctions
          </h1>
          <h1
            className={`text-primary text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
          >
            Be The Winner
          </h1>
          <div className="flex gap-4 my-8">
            {!isAuthenticated && (
              <>
                <Link
                  to="/sign-up"
                  className="bg-primary font-semibold hover:bg-primary/90 rounded-lg px-8 flex items-center py-3 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className="text-primary bg-transparent border-2 border-primary hover:bg-primary/10 font-semibold text-xl rounded-lg px-8 flex items-center py-3 transition-all duration-300"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-foreground text-xl font-semibold mb-4 min-[480px]:text-xl md:text-2xl lg:text-3xl">
            How it works
          </h3>
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap w-full">
            {howItWorks.map((element) => {
              return (
                <div
                  key={element.title}
                  className="bg-card border border-border flex flex-col gap-3 p-4 rounded-xl h-auto justify-center md:w-[48%] lg:w-[47%] 2xl:w-[24%] hover:shadow-lg transition-all duration-300 hover:border-primary/20"
                >
                  <h5 className="font-bold text-foreground">{element.title}</h5>
                  <p className="text-muted-foreground">{element.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <FeaturedAuctions />
        <UpcomingAuctions />
        <Leaderboard />
      </div>
    </section>
  );
};

export default Home;
