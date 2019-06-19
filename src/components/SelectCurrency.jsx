import React, { Component } from "react";
import "./selectCurrencyStyle.css";

class SelectCurrency extends Component {
  state = {
    currencyList: this.props.currencies,
    value: "",
    newCurrencyList: []
  };

  render() {
    return (
      <div className="currencies-container">
        <div className="currency-search">
          <input
            className="search"
            name="search"
            type="search"
            placeholder="Search"
            value={this.state.value}
            onChange={this.searchCurency}
          />
        </div>
        {(this.state.newCurrencyList.length
          ? this.state.newCurrencyList
          : this.props.currencies
        ).map(obj => {
          return (
            <div
              className="currency"
              id={obj.id}
              key={obj.id}
              onClick={this.props.onClick}
            >
              <p className="currency-code" id={obj.id}>
                {obj.code}
              </p>
              <p className="currency-desc" id={obj.id}>
                {obj.currency}
              </p>
              <div className="border-currency" id={obj.id}>
                {" "}
              </div>
            </div>
          );
        })}{" "}
      </div>
    );
  }

  searchCurency = e => {
    const value = e.target.value;
    const list = [];
    this.setState(
      {
        value: value
      },
      () => {
        this.state.currencyList.map(obj => {
          if (
            obj.code.toUpperCase().includes(value.toUpperCase()) ||
            obj.currency.toUpperCase().includes(value.toUpperCase())
          )
            list.push(obj);
          this.setState({
            newCurrencyList: list
          });
        });
      }
    );
  };
}

export default SelectCurrency;
