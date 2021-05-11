---
title: Basic example in React
permalink: /next/react-simple-examples
canonicalUrl: /react-simple-examples
---

# Basic examples

[[toc]]

## Get started

::: example #example1 :react --html 1 --js 2
```html
<!-- a root div in which the component is being rendered -->
<div id="example1"></div>
```

```jsx
import ReactDOM from 'react-dom';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';

const hotData = Handsontable.helper.createSpreadsheetData(6, 10);

const App = () => {
  return (
    <div>
      <HotTable
        data={hotData}
        colHeaders={true}
        rowHeaders={true}
        licenseKey="non-commercial-and-evaluation"
      />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('example1'));
```
:::

## A single property configuration

::: example #example2 :react
```jsx
import ReactDOM from 'react-dom';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';

const hotData = Handsontable.helper.createSpreadsheetData(6, 10);

const App = () => {
  return (
    <div>
      <HotTable
        settings={{
          data: hotData,
          colHeaders: true,
          rowHeaders: true,
          licenseKey: 'non-commercial-and-evaluation'
        }}
      />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('example2'));
```
:::

## External control

::: example #example3 :react
```jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';

const App = () => {
  const [settings, setSettings] = useState(() => {
    const initialState = {
      data: Handsontable.helper.createSpreadsheetData(15, 20),
      width: 570,
      height: 220,
      licenseKey: 'non-commercial-and-evaluation'
    }
    return initialState;
  });

  const handleChange = (setting, states) => event => {
    setSettings(prevState => ({
      ...prevState,
      [setting]: states[event.target.checked ? 1 : 0],
    }))
  }

  return (
    <div>
      <div className="controllers">
        <label>
          <input onChange={handleChange('fixedRowsTop', [0, 2])} type="checkbox" />
          Add fixed rows
        </label>
        <br/>

        <label>
          <input onChange={handleChange('fixedColumnsLeft', [0, 2])} type="checkbox" />
          Add fixed columns
        </label>
        <br/>

        <label>
          <input onChange={handleChange('rowHeaders', [false, true])} type="checkbox" />
          Enable row headers
        </label>
        <br/>

        <label>
          <input onChange={handleChange('colHeaders', [false, true])} type="checkbox" />
          Enable column headers
        </label>
        <br/>
      </div>

      <HotTable root="hot" settings={settings}/>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('example3'));
```
:::