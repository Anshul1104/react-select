import { useState } from 'react'
import './App.css'
import Select, { SelectOption } from './Select'

function App() {

  const options = [
    { label: 'First', value: 1 },
    { label: 'Second', value: 2 },
    { label: 'Third', value: 3 },
    { label: 'Fourth', value: 4 },
    { label: 'Fifth', value: 5 },
    { label: 'Sixth', value: 6 },
  ]

  const [value, setValue] = useState<SelectOption | undefined>(options[0])
  const [multiValue, setMultiValue] = useState<SelectOption[]>([options[0]])

  return (
    <main>
      <div className="heading-container">
        <h1>React Select {" "}<span>(Keyboard accessible)</span></h1>
      </div>
      <h3>Single</h3>
      <Select options={options} value={value} onChange={o => setValue(o)} />
      <br />
      <h3>Multi</h3>
      <Select multiple options={options} value={multiValue} onChange={o => setMultiValue(o)} />
    </main>
  )
}

export default App
