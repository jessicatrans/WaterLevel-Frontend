import React, {useState} from 'react';
// an third-party component from NPM
import MonthYearPicker from 'react-month-year-picker';
import "react-month-picker/css/month-picker.css";

function MonthPicker(props) {
let date = props.date;

const [visible,updateVisible] = useState(false);

function showFun () {
  updateVisible(true);
}

function pickedYear (year) {
  updateVisible(false);
  props.yearFun(year);
}

function pickedMonth (month) {
  updateVisible(false);
  props.monthFun(month);
}

  if (visible) {
return (
      <div id="monthDiv" style={{ "margin-bottom": "30px", lineHeight : 0.2 }}>
        <button onClick={showFun}>{date.month+"/"+date.year}</button>
        <MonthYearPicker
          caption=""
          selectedMonth={date.month}
          selectedYear={date.year}
          minYear={2000}
          maxYear={2022}
          onChangeYear = {pickedYear}
          onChangeMonth = {pickedMonth}
        />
      </div> );
  } else {
    return (
      <button onClick={showFun}>{date.month+"/"+date.year}</button>
    )
  }
}

export default MonthPicker;