import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Fab from '@material-ui/core/Fab';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import useStyles from './constants';
import paidPhoto from './images/images.png';
import freePhoto from './images/depositphotos_80079898-stock-illustration-free-icon.jpg';
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined';

import './Home.css';

function Home() {
  const [confDetails, setConfDetails] = useState([]);
  const [allConfDetails, setAllConfDetails] = useState([]);
  const [confInfo, setConfInfo] = useState(1);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [loading , setLoading ] = useState(true);
  const open = Boolean(anchorEl);

  const id = open ? 'filters-popover' : undefined;

  const handleChange = (event) => {
    setFilterValue(event.target.value);
  };

  useEffect(() => {
    const apiData = async () => {
      const response = await fetch('https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences');
      const responseJSON = await response.json();
      let existConf = [];
      existConf = responseJSON.free.concat(responseJSON.paid);
      setConfDetails(existConf);
      setAllConfDetails(existConf);
      setLoading(false);
    }
    apiData();
    
  }, [confInfo]);

  const handleAnchorClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAnchorClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e) => {
    const filteredArray = allConfDetails.filter((conf) => {
      return (conf.confName.toLowerCase().startsWith(e.target.value.toLowerCase())
        || conf.city.toLowerCase().startsWith(e.target.value.toLowerCase()));
    })
    setConfDetails(filteredArray);
  }
  const sortByCity = () => {
    const sortedArray = allConfDetails.sort((a, b) => a.city.localeCompare(b.city));
    setConfDetails(sortedArray);
  }
  const sortByCountry = () => {
    const sortedArray = allConfDetails.sort((a, b) => a.country.localeCompare(b.country));
    setConfDetails(sortedArray);
  }
  const filterByFree = () => {
    const filteredArray = allConfDetails.filter((conf) => {
      return (conf.entryType == 'Free');
    })
    setConfDetails(filteredArray);
  }
  const filterByPaid = () => {
    const filteredArray = allConfDetails.filter((conf) => {
      return (conf.entryType == 'Paid');
    })
    setConfDetails(filteredArray);
  }

  return (
    <div className="home">
      <div className="home__title__container flex">
        <div className="home__title">KonfO</div>
        <div className="home__filters__container">
          <Fab
            className="fab__filter"
            aria-label="add"
            aria-describedby={id}
            onClick={handleAnchorClick}>
            <FilterListOutlinedIcon />
          </Fab>
          <div>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleAnchorClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <div className="home__filters flex">
                <form className={classes.root} noValidate autoComplete="off">
                  <TextField
                    id="standard-basic"
                    label="Search by Name or City"
                    onChange={(e) => handleSearch(e)} />
                </form>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">Filter</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filterValue}
                    onChange={handleChange}
                  >
                    <MenuItem onClick={sortByCity} value='City'>City</MenuItem>
                    <MenuItem onClick={filterByFree} value='Free'>Free</MenuItem>
                    <MenuItem onClick={filterByPaid} value='Paid'>Paid</MenuItem>
                    <MenuItem onClick={sortByCountry} value='Country'>Country</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </Popover>
          </div>
        </div>
      </div>
     
     {!loading ? <div className="home__conferences flex">
        {
          confDetails ?
            confDetails.map((conf) => {
              return <div className="conference__item">
                <div className="item__fare">
                  <div className="item__fare__inner">
                    <div>
                      {(conf.entryType == 'Free') ? <img src={freePhoto} /> : <img src={paidPhoto} />}
                    </div>
                  </div>
                </div>
                <div className="item__image flex">
                  <img
                    src={(conf.imageURL.includes('"')) ? conf.imageURL.substring(1, conf.imageURL.length - 1) : conf.imageURL}
                    alt="No image available for now" />
                </div>
                <div className="item__description">
                  <div className="item__name" >
                    <p className="item__header"  >Conference Name</p>
                    <p className="item__value" >{conf.confName}</p>
                  </div>
                  <div className="item__name" >
                    <p className="item__header" >Start Date</p>
                    <p className="item__value">{conf.confStartDate}</p>
                  </div>
                  <div className="item__name" >
                    <p className="item__header"  > End Date</p>
                    <p className="item__value">{conf.confEndDate}</p>
                  </div>
                  <div className="item__city flex">
                    <p >{(conf.city) ? `${conf.city} ,${conf.country}` : conf.venue} </p>
                  </div>
                  <div className="item__register">
                    <div className="item__register__inner">
                      <a target="blank" href={conf.confRegUrl}>REGISTER</a>
                    </div>
                  </div>
                </div>
              </div>
            }) : ''
        }
      </div> : <div className="flex loading"><h1>Loading...</h1></div> } 
    </div>
  )
}

export default Home
