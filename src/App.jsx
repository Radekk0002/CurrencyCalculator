import React, { Component } from "react";
import SelectCurrency from "./components/SelectCurrency";
import "babel-polyfill";
import "./App.css";
require("es6-promise").polyfill();
require("isomorphic-fetch");

class App extends Component {
  state = {
    numberValue: "100.00",
    result: "",
    resultText: "",
    currencies: [
      { id: 0, code: "PLN", currency: "Polski złoty" },
      { id: 1, code: "THB", currency: "Bat (Tajlandia)" }
    ],
    idFrom: 0,
    idTo: 1
  };
  constructor(props) {
    super(props);
    this.currency = React.createRef();
    this.currencyTo = React.createRef();

    this.checkNumber = this.checkNumber.bind(this);
  }

  componentDidMount() {
    let currencyContainer = [
      {
        id: 0,
        code: "PLN",
        currency: "polski złoty"
      }
    ];
    fetch("https://api.nbp.pl/api/exchangerates/tables/a/?format=json", {
      method: "GET"
    })
      .then(resp => resp.json())
      .then(resp => {
        let id = 0;
        resp[0].rates.forEach(obj => {
          id++;
          const currency = obj.currency;
          const code = obj.code;
          let fullCurrency = {};
          fullCurrency.id = id;
          fullCurrency.code = code;
          fullCurrency.currency = currency;
          currencyContainer.push(fullCurrency);
        });
        this.setState({
          activeSelectFrom: false,
          activeSelectTo: false,
          currentCurrencyFrom: this.state.currencies[0].code,
          currentCurrencyTo: this.state.currencies[1].code,
          currencies: currencyContainer
        });
      });
  }

  render() {
    return (
      <div className="wrapper" onClick={this.hideTableSelect}>
        <div className="App">
          <h1> Currency calculator</h1> <div className="border-top"> </div>
          <div className="container-conversion">
            <div className="conversions">
              <div className="currency-from">
                <div ref={this.currency} className="choose-currency-container">
                  <div
                    className="choose-currency"
                    onClick={this.showHideTableSelectFrom}
                  >
                    <span className="currency-code">
                      {this.state.currentCurrencyFrom}
                    </span>
                    <div className="arrow-choose"></div>
                  </div>
                  {this.state.activeSelectFrom ? (
                    <SelectCurrency
                      currencies={this.state.currencies}
                      onClick={this.changeCurrencyFrom}
                    />
                  ) : null}
                </div>
                <div className="type-value result-value">
                  <input
                    type="text"
                    value={this.state.numberValue}
                    onChange={this.setNumber}
                  />
                  <div className="change-value-buttons">
                    <div className="increase-value" onClick={this.increase}>
                      +
                    </div>
                    <div className="decrease-value" onClick={this.decrease}>
                      -
                    </div>
                  </div>
                </div>
              </div>
              <div className="exchange" onClick={this.exchange}></div>
              <div className="currency-to">
                <div
                  ref={this.currencyTo}
                  className="choose-currency-container"
                >
                  <div
                    className="choose-currency"
                    onClick={this.showHideTableSelectTo}
                  >
                    <span className="currency-code">
                      {this.state.currentCurrencyTo}
                    </span>
                    <div className="arrow-choose"> </div>
                  </div>
                  {this.state.activeSelectTo ? (
                    <SelectCurrency
                      currencies={this.state.currencies}
                      onClick={this.changeCurrencyTo}
                    />
                  ) : null}
                </div>
                <div className="result-table result-value">
                  {this.state.result}
                </div>
              </div>
              <div className="submit">
                <button
                  type="submit"
                  className="button"
                  onClick={this.calculate}
                >
                  Calculate
                </button>
              </div>
              <div className="border-bottom"> </div>
            </div>
            <div>
              <p className="result-text">{this.state.resultText}</p>
              <div className="border-bottom-result"> </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  setNumber = e => {
    this.setState({
      numberValue: e.target.value
    });
  };

  showHideTableSelectFrom = () => {
    this.setState({
      activeSelectFrom: !this.state.activeSelectFrom,
      activeSelectTo: false
    });
  };

  showHideTableSelectTo = () => {
    this.setState({
      activeSelectFrom: false,
      activeSelectTo: !this.state.activeSelectTo
    });
  };

  //Hide when clicked outside of box with currencies
  hideTableSelect = e => {
    e.stopPropagation();
    if (
      //Not to close when clicked on .choose-currency divs and .currencies-container divs
      !this.currency.current.contains(e.target) &&
      !this.currencyTo.current.contains(e.target)
    ) {
      this.setState({
        activeSelectFrom: false,
        activeSelectTo: false
      });
    }
  };

  exchange = () => {
    this.setState({
      currentCurrencyFrom: this.state.currentCurrencyTo,
      idFrom: this.state.idTo,
      currentCurrencyTo: this.state.currentCurrencyFrom,
      idTo: this.state.idFrom
    });
  };

  //Prevent from sending number with letters, commas etc.
  checkNumber = () => {
    let value = this.state.numberValue;
    let dot = 0;
    let dotPlace = 0;
    let i = 0;
    let lettBefDot = 0;
    for (i; i < value.length; i++) {
      //Get different signs than number or dots or commas
      if (isNaN(value[i]) && value[i] !== "." && value[i] !== ",") {
        lettBefDot++;
      }
      // First met dot
      if ((value[i] === "." || value[i] === ",") && dot < 1) {
        dotPlace = i;
        dot = 1;
      }
      // Next met dots
      if (value[i] === "." || value[i] === ",") {
        value = value.replace(/\D/g, "");

        // Place first met dot
        if (dotPlace)
          value =
            value.slice(0, dotPlace - lettBefDot) +
            "." +
            value.slice(dotPlace - lettBefDot);

        break;
      }
    }

    //Remove all zeros from beggining of number
    if (
      value.length > 1 &&
      (value[0] === "0" || value[0].match(/[a-zA-Z]/g)) &&
      !value[1].match(/[1-9.,]/g)
    ) {
      let x = 0;
      for (x; x < value.length; x++) {
        if (value[x].match(/[1-9.,]/g)) {
          break;
        }
      }
      value = value.slice(x);
    }

    if (value === "." || value === "," || value === "" || isNaN(value))
      value = "0";

    if (value[value.length - 1] === "." || value[value.length - 1] === ",")
      value += "00";

    value = parseFloat(value).toFixed(2);
    if (value < 0) value = 0;

    this.setState({
      numberValue: value
    });
  };

  increase = () => {
    this.checkNumber();
    if (
      this.state.numberValue !== "." &&
      this.state.numberValue !== "," &&
      this.state.numberValue !== ""
    ) {
      this.setState({
        numberValue: parseFloat(this.state.numberValue) + 1
      });
    }
  };

  decrease = () => {
    if (this.state.numberValue === "") this.setState({ numberValue: 0 });
    if (this.state.numberValue >= 1) {
      this.checkNumber();
      if (
        this.state.numberValue !== "." &&
        this.state.numberValue !== "," &&
        this.state.numberValue !== ""
      ) {
        this.setState({
          numberValue: parseFloat(this.state.numberValue) - 1
        });
      }
    }
  };

  calculate = () => {
    this.checkNumber();
    if (this.state.currentCurrencyFrom === this.state.currentCurrencyTo) {
      return this.setState({
        result: this.state.numberValue,
        resultText:
          "" +
          this.state.numberValue +
          " " +
          this.state.currentCurrencyFrom +
          " = " +
          this.state.numberValue +
          " " +
          this.state.currentCurrencyTo
      });
    }
    fetch("https://api.nbp.pl/api/exchangerates/tables/a/?format=json")
      .then(resp => resp.json())
      .then(resp => {
        let value = this.state.numberValue;
        let idFrom = this.state.idFrom;
        let idTo = this.state.idTo;
        let rateFrom;
        let rateTo;

        // It is set because I have added PLN currency to list and every id is increased by 1
        if (idFrom > 0) rateFrom = resp[0].rates[idFrom - 1].mid;
        else {
          rateFrom = 1;
        }

        // It is set because I have added PLN currency to list and every id is increased by 1
        if (idTo > 0) rateTo = resp[0].rates[idTo - 1].mid;
        else {
          rateTo = 1;
        }

        let ratio = rateFrom / rateTo;

        let result = value * ratio;
        result = result.toFixed(2);
        this.setState({
          result: result,
          resultText:
            this.state.numberValue +
            " " +
            this.state.currentCurrencyFrom +
            " = " +
            result +
            " " +
            this.state.currentCurrencyTo
        });
      });
  };

  changeCurrencyFrom = e => {
    const ID = e.target.id;
    this.setState({
      currentCurrencyFrom: this.state.currencies[ID].code,
      activeSelectFrom: false,
      activeSelectTo: false,
      idFrom: ID
    });
  };

  changeCurrencyTo = e => {
    const ID = e.target.id;
    this.setState({
      currentCurrencyTo: this.state.currencies[ID].code,
      activeSelectFrom: false,
      activeSelectTo: false,
      idTo: ID
    });
  };
}

export default App;
