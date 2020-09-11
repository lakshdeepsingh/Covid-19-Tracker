import React, { useEffect, useState } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
//https://disease.sh/v3/covid-19/all
// USEEFFECT IS A HOOK IN REACT WHICH RUNS A PIECE OF CODE BASED ON A CONDITION
function App() {
  const [countries, setCountries] = useState([]);

  const [country, setCountry] = useState("worldwide");

  const [countryInfo, setCountryInfo] = useState({});

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data); //Al of the data from the country
      });
  };
  //console.log("***********888", countryInfo);       To see whats coming back from API
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United Kingdom, United States
            value: country.countryInfo.iso2, // UK, USA, FR
          }));

          setTableData(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID 19 Live Tracker</h1>
          <FormControl className="app_dropdown_menu">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              {/* Loop through all countries and show a dropdown list of options*/}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_statistics">
          {/*INFOBOX*/}
          {/*INFOBOX*/}
          {/*INFOBOX*/}
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered Cases"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Fatalities"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        <Map />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          {/*<h3>Worldwide new cases</h3>*/}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
