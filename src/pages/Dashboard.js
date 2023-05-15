import React, { useState, useEffect } from "react";
import "../assets/css/Dashboard.css";
import { Link } from "react-router-dom";
import { ethers, utils } from "ethers";

import logo from "../assets/images/rentalLogo.png";
import { useSelector } from "react-redux";
import Connect from "../components/Connect";
import ExampleModal from "../components/ExampleModel";


import { Container, Button, Grid } from "@mui/material";
import DecentralAirbnb from "../artifacts/DecentralAirbnb.sol/DecentralAirbnb.json";
import { contractAddress, networkDeployedTo } from "../utils/contracts-config";
import networksMap from "../utils/networksMap.json";


const Dashboard = () => {
  const data = useSelector((state) => state.blockchain.value);

  const [rentalsList, setRentalsList] = useState([]);
  const [propertiesList, setPropertiesList] = useState([]);
  
  const [openModal, setOpenModal] = useState(false);
  const [cur_id, setcur_id] = useState(0);

  const [loading1, setLoading1] = useState(false);



  const [reviews, setReviews] = useState([]);

  const [newReview, setNewReview] = useState({
    user: data.account,
    comment: '',
    rating: 0,
  });


  

  async function handleOpen (_id) {
    console.log('inside this function')
    setcur_id(_id);
    console.log(_id)
    console.log(cur_id)
    await getReviewList(_id)
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };


  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setNewReview((prevReview) => ({ ...prevReview, [name]: value }));
  };

  const handleRatingChange = (event, value) => {
    setNewReview((prevReview) => ({ ...prevReview, rating: value }));
  };

  const handleAddReview = async () => {

    try {
      const id = reviews.length + 1;
      const updatedReviews = [...reviews, { ...newReview, id }];
      await addReviewAndRating();
      setReviews(updatedReviews);
    } catch (e) {
      console.log(e)
    }
    setNewReview({ user: data.account, comment: '', rating: 0 });
  };

  const addReviewAndRating = async () => {
    if (data.network == networksMap[networkDeployedTo]) {
      console.log("addReviewAndRating")
      try {
        setLoading1(true);
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();
        const AirbnbContract = new ethers.Contract(
          contractAddress,
          DecentralAirbnb.abi,
          signer
        );
       
        const add_review_tx = await AirbnbContract.addReview(
          cur_id,
          newReview.comment,
          newReview.rating
        );
        
        await add_review_tx.wait();
       
        setLoading1(false);
      } catch (err) {
        setLoading1(false);
        console.log(err);
        window.alert("An error has occured, please try again");
      }
    } else {
      setLoading1(false);
      window.alert(
        `Please Switch to the ${networksMap[networkDeployedTo]} network`
      );
    }
  };


  const getReviewList = async (_id) => {
    console.log("getReviewList")
    console.log(_id)

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
   
    const signer = provider.getSigner();
    
    const AirbnbContract = new ethers.Contract(
      contractAddress,
      DecentralAirbnb.abi,
      signer
    );
    console.log("1")
    var items=[];
    try{
    const rev = await AirbnbContract.getReviews(_id);
    console.log("2")
    console.log(rev)
    items = await Promise.all(
      rev.map(async (r) => {

        return {
          id: r[0],
          user: r[1],
          comment: r[2],
          rating: Number(r[3])
        };
      })
    );
    }catch(e){
      console.log(e);
    }
    setReviews(items);

  };


  const getRentalsList = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const AirbnbContract = new ethers.Contract(
      contractAddress,
      DecentralAirbnb.abi,
      signer
    );

    const rentals = await AirbnbContract.getRentals();

    const user_properties = rentals.filter((r) => r[1] == data.account);

    const items = await Promise.all(
      user_properties.map(async (r) => {
        const imgUrl = r[7].replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );

        return {
          name: r[2],
          city: r[3],
          description: r[6],
          imgUrl: imgUrl,
          price: utils.formatUnits(r[9], "ether"),
        };
      })
    );
    setPropertiesList(items);

    const myRentals = [];
    await Promise.all(
      rentals.map(async (r) => {
        let _rentalBookings = await AirbnbContract.getRentalBookings(
          Number(r[0])
        );

        const imgUrl = r[7].replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );

        let myBookings = _rentalBookings.filter((b) => b[0] == data.account);
        if (myBookings.length !== 0) {
          const latestBook = myBookings[0];
          const item = {
            id: Number(r[0]),
            name: r[2],
            city: r[3],
            imgUrl: imgUrl,
            startDate: new Date(Number(latestBook[1]) * 1000),
            endDate: new Date(Number(latestBook[2]) * 1000),
            price: utils.formatUnits(r[9], "ether"),
          };
          myRentals.push(item);
        }
      })
    );
    setRentalsList(myRentals);
  };

  useEffect(() => {
    getRentalsList();
  }, [data.account]);

  return (
    <>
      <div className="topBanner">
        <div>
          <Link to="/">
            <img className="logo" src={logo} alt="logo"></img>
          </Link>
        </div>
       
        <div className="lrContainers" style={{ width: "400px" }}>
        <div style={{ marginRight: "20px" }}>
            <a className="btn" href={"/add-rental"} style={{ backgroundColor: "#6161cd", color: "white" }} role="button">
              Add rental
            </a>
          </div>
          <Connect />
        </div>
      </div>

      <hr className="line" />
      <div className="rentalsContent">
        <div className="rentalsContent-box">
          <h3 className="title">Your properties</h3>
          
          <div className="proplist">
          {propertiesList.length !== 0 ? (
            propertiesList.map((e, i) => {
              return (
                <>
                  <div className="rental-div" key={i}>
                    <img className="rental-img" src={e.imgUrl}></img>
                    <div className="rental-info">
                      <div className="rental-title">{e.name}</div>
                      <div className="rental-desc">in {e.city}</div>
                      <div className="rental-desc">{e.description}</div>
                      <br />
                      <br />
                      <div className="price">{e.price}$/day</div>
                    </div>
                  </div>
                   <hr className="line2" /> 
                </>
              );
            })
          ) : (
            <div style={{ textAlign: "center", paddingTop: "50px" }}>
              <p>You have no properties listed</p>
            </div>
          )}
          </div>
        </div>
        <div className="rentalsContent-box">
          {openModal ?
            (<ExampleModal
              reviews={reviews}
              handleClose={handleClose}
              handleAddReview={handleAddReview}
              handleRatingChange={handleRatingChange}
              handleReviewChange={handleReviewChange}
              newReview={newReview}
              loading1={loading1}
              open={openModal}
            />) : ''
          }
          <h3 className="title">Your rentals</h3>
          
          <div className="proplist">
          {rentalsList.length !== 0 ? (
            rentalsList.map((e, i) => {
              return (
                <>
                  <div className="rental-div" key={i}>
                    <img className="rental-img" src={e.imgUrl}></img>
                    <div className="rental-info">
                      <div className="rental-title">{e.name}</div>
                      <div className="rental-desc">in {e.city}</div>
                      <div className="rental-desc">
                        Booked dates:
                        {` ${e.startDate.toLocaleString("default", {
                          month: "short",
                        })} ${e.startDate.toLocaleString("default", {
                          day: "2-digit",
                        })}  -  ${e.endDate.toLocaleString("default", {
                          month: "short",
                        })}  ${e.endDate.toLocaleString("default", {
                          day: "2-digit",
                        })} `}
                      </div>
                      <br />
                      <br />
                      <div className="price">{e.price}$/day</div>
                      <Button variant="contained" sx={{ fontSize: '10px', padding: '3px 10px' }} onClick={() => handleOpen(e.id)}>Reviews</Button>
                    </div>
                  </div>
                  <hr className="line2" /> 
                </>
              );
            })
          ) : (
            <div style={{ textAlign: "center", paddingTop: "45px" }}>
              <p>You have no reservation yet</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
