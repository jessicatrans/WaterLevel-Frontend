import React, {useState, useEffect} from 'react';
import './App.css';
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import MonthPicker from './MonthPicker';
import {sendPostRequest} from './AJAX.jsx';
import ReactMonthPicker from "react-month-picker";
import "react-month-picker/css/month-picker.css";

function App() {
  const [display, setDisplay] = useState(true);
  const [see, setSee] = useState("See more");
  const [date, setDate] = useState({month: 6, year: 2022 });
  const [chart, setChart] = useState([
    {name:"Shasta",capacity:4552000,current:0},
    {name:"Oroville",capacity:3537577,current:0},
    {name:"Trinity Lake",capacity:2447650,current:0},
    {name:"New Melones",capacity:2400000,current:0},
    {name:"San Luis",capacity:1062000,current:0},
    {name:"Don Pedro",capacity:2030000,current:0},
    {name:"Berryessa",capacity:1602000,current:0},
  ]);
  let dates = {
    month: 0,
    year: 0
  };
  const [resData, setResData] = useState({
    labels: chart.map((data) => data.name),
    datasets: [
      {
        data: chart.map((data) => data.current),
        backgroundColor: [
          "rgb(66,145,152)"
        ]
      },
      {
        data: chart.map((data) => data.capacity),
        backgroundColor: [
          "rgb(120,199,227)"
        ]
      }
    ],
  });

  // Function that deals with receiving dates and sending post request to get water level
  function getData(dates) {
    (async function () {
    console.log("getting chart info...");
    sendPostRequest("/query/getWaterData", dates)
    .then(function(returnedData) {
      console.log("returnedData: ",returnedData);
      setChart([
        {name:"Shasta",capacity:4552000,current:returnedData[0]},
        {name:"Oroville",capacity:3537577,current:returnedData[1]},
        {name:"Trinity Lake",capacity:2447650,current:returnedData[2]},
        {name:"New Melones",capacity:2400000,current:returnedData[3]},
        {name:"San Luis",capacity:1062000,current:returnedData[4]},
        {name:"Don Pedro",capacity:2030000,current:returnedData[5]},
        {name:"Berryessa",capacity:1602000,current:returnedData[6]},
      ]);
      setResData({
      labels: chart.map((data) => data.name),
      datasets: [
        {
          data: chart.map((data) => data.current),
          backgroundColor: [
            "rgb(66,145,152)"
          ]
        },
        {
          data: chart.map((data) => data.capacity),
          backgroundColor: [
            "rgb(120,199,227)"
          ]
        }
      ],
    });
    })
    .catch(function(error) {
      console.error("Error:", error);
    });

    }) ();
  }

  function yearChange(newYear) {
      let m = date.month;
      dates.year = newYear;
      dates.month = m;
      console.log("dates: ", dates.year, " ", dates.month);
      getData(dates); // calls getData function which sends a post request
      setDate({year: newYear, month: m });
    }

  function monthChange(newMonth){
      let y = date.year;
      dates.month = newMonth;
      dates.year = y;
      console.log("dates: ", dates.year, " ", dates.month);
      getData(dates); // calls getData function which sends a post request
      setDate({month: newMonth, year: y});
    }
  
  const range = {
    min: { year: 2020, month: 3 },
    max: { year: 2025, month: 2 }
  };

  let options = {
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: false
      }
    },
      responsive: true,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false
          }
  
        },
        y: {
          stacked: true,
          grid: {
            display: false
          },
          ticks: {
            callback: function(value) {
              return value / 1e5;
            }
            
          }
        }
      }
  };
  
  function buttonAction() {
    if (display === true) {
      setDisplay(false);
      setSee("See less");
    }
    else if (display === false) {
      setDisplay(true);
      setSee("See more");
    }
  }

   return (
    <main>
      <hr id="stripe"/>
      <h1 className="title">Water storage in California reservoirs</h1>
      <div className= "container">
        <div className="paragraphs">
          <p> 
          California's reservoirs are part of a <a className="links" href="https://www.ppic.org/wp-content/uploads/californias-water-storing-water-november-  2018.pdf">complex water storage system</a>.  The State has very variable weather, both   seasonally and from year-to-year, so storage and water management is essential.  Natural features - the Sierra snowpack and vast underground aquifers - provide more storage capacity,  but reservoirs are the part of the system that people control on a day-to-day basis.  Managing the flow of surface water through rivers and aqueducts, mostly from North to South, reduces flooding and attempts to provide a steady flow of water to cities and farms, and to maintain natural riparian habitats.  Ideally, it also transfers some water from the seasonal snowpack into long-term underground storage.  Finally, hydro-power from the many dams provides carbon-free electricity.
          </p>
          
          <p>
            California's water managers monitor the reservoirs carefully, and the state publishes daily data on reservoir storage.
          </p>
          <div onClick={() => buttonAction()} className="expandBtn">{see}</div>
        </div>

        <div className = "reservoirIMG">
          <div className = "imgContainer">
            <img src="https://cdn.theatlantic.com/thumbor/HYdYHLTb9lHl5ds-IB0URvpSut0=/900x583/media/img/photo/2014/09/dramatic-photos-of-californias-historic-drought/c01_53834006/original.jpg
    " className="image1"/>
          </div>
          <p className = "caption">
          Lake Oroville in the 2012-2014 drought. Image credit Justin Sullivan, from The Atlatic article Dramatic Photos of California's Historic Drought.
          </p>
        </div>
      </div>
      <div className="popUp" style={{display: display ? 'none' : 'flex'}, {animation: display ? 'fadeOut 0.15s forwards' : 'fadeIn 0.15s forwards'}}>
        <div className = "container">
          <div className = "chart">
            <Bar options={options} data={resData} />
          </div>
          <div className = "box">
            <p>
          Here's a quick look at some of the data on reservoirs from the <a className="links" href="https://cdec.water.ca.gov/index.html">California Data Exchange Center</a>, which consolidates climate and water data from multiple federal and state government agencies, and  electric utilities.  Select a month and year to see storage levels in the eleven largest in-state reservoirs.
            </p>
            <div className = "monthPicker">
              <p className="t">Change month:</p>
              <MonthPicker  
              // props 
              date = {date}
              yearFun = {yearChange}
              monthFun = {monthChange}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
  
}

export default App;