import { useState } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState({
    data: "",
    pembulatan: "",
  })
  const [sortedNumbers, setSortedNumbers] = useState([]);
  const [rentangan, setRentangan] = useState(0);
  const [jumlahKelas, setJumlahKelas] = useState(0);
  const [panjangKelas, setPanjangKelas] = useState(0);
  const [n, setN] = useState(0);
  const [logN, setLogN] = useState(0);
  const [kelas, setKelas] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sorting()
    hitungRentangan()
    hitungKelas()
    setSubmitted(true)
  }

  const sorting = () => {
    const numbers = input.data
      .split(/\s+/) // Memisahkan input berdasarkan spasi dan enter
      .map(Number) // Mengonversi setiap string menjadi angka
      .filter((n) => !isNaN(n)) // Memfilter nilai yang bukan angka
      .sort((a, b) => a - b); // Mengurutkan angka secara ascending

    setSortedNumbers(numbers);
  }

  const hitungRentangan = () => {
    const min = sortedNumbers[0];
    const max = sortedNumbers[sortedNumbers.length - 1];
    const range = max - min;

    setRentangan(range);
  }

  const hitungKelas = () => {
    const n = sortedNumbers.length;
    const log = Math.log10(n);
    let k = 0;
    if(input.pembulatan == "bawah") {
      k = Math.floor(1 + 3.322 * log);
    }else{
      k = Math.ceil(1 + 3.322 * log);
    }
    const range = rentangan;
    const classWidth = Math.ceil(range / k);
    const min = sortedNumbers[0];
    const max = sortedNumbers[sortedNumbers.length - 1];

    let classes = [];
    let lowerBound = min;
    let upperBound = lowerBound + classWidth - 1;

    for (let i = 1; i <= k; i++) {
      classes.push({
        kelas: i,
        batasBawah: lowerBound,
        batasAtas: upperBound,
      });

      lowerBound = upperBound + 1;
      upperBound = lowerBound + classWidth - 1;

      if (upperBound > max) {
        upperBound = max;
      }
    }

    const frequencies = new Array(k).fill(0);

    for (const num of sortedNumbers) {
      const index = Math.floor((num - min) / (range / k));
      frequencies[index]++;
    }

    setJumlahKelas(k);
    setPanjangKelas(classWidth);
    setN(n);
    setLogN(log);
    setKelas(classes);
    setFrequencies(frequencies);
  }

  function roundNumber(num) {
    const decimal = num - Math.floor(num);
    return decimal < 0.5 ? Math.floor(num) : Math.ceil(num);
  }

  const handleReset = () => {
    setInput({
      data: "",
      pembulatan: "",
    })
    setRentangan(0);
    setJumlahKelas(0);
    setPanjangKelas(0);
    setN(0);
    setLogN(0);
    setKelas([]);
    setFrequencies([]);
    setSubmitted(false);
  }

  return (
    <>
      <h2>Statistika Kalkulator</h2>
      <form onSubmit={handleSubmit}>
        <textarea onChange={handleInput} name="data" id="" rows={8}></textarea>
        <br />
        <div>
          <input onChange={handleInput} type="radio" name="pembulatan" id="r1" value="bawah"/>
          <label htmlFor="r1">Bulat kebawah</label>
          <input onChange={handleInput} type="radio" name="pembulatan" id="r2" value="atas"/>
          <label htmlFor="r2">Bulat keatas</label>
        </div>
        <br />
        <button type='submit'>Hitung</button>
        <button type='reset' onClick={handleReset}>Reset</button>
      </form>

      {submitted && (
      <div>
        <h3>Hasil</h3>
        <div style={{ display: 'grid',gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' }}>
        {sortedNumbers.map((num, index) => (
          <span key={index}>{num}</span>
        ))}
        </div>
        <div>
          <h4>Rentangan</h4>
          <p>R = Xmax - Xmin</p>
          <p>R ={sortedNumbers[sortedNumbers.length - 1]} - {sortedNumbers[0]}</p>
          <p>R = {rentangan}</p>
        </div>
        <div>
          <h4>Jumlah Kelas</h4>
          <p>K = 1 + 3,3 log n</p>
          <p>K = 1 + 3,3 log {n}</p>
          <p>K = 1 + 3,3 ({logN.toFixed(2)})</p>
          <p>K = 1 + {(3.3 * logN).toFixed(3)}</p>
          <p>K = {(1 + 3.3 * logN).toFixed(3)}</p>
          <p>K = {jumlahKelas}</p>
        </div>
        <div>
          <h4>Panjang Kelas</h4>
          <p>P = R / K</p>
          <p>P = {rentangan} / {jumlahKelas}</p>
          <p>P = {panjangKelas}</p>
        </div>
        <div>
          <h4>Batas panjang interval kelas</h4>
          <p>itung Sendiri = batas bawah + ( P – 1) = X</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Rentang</th>
              <th>Frekuensi</th>
              <th>Titik Tengah</th>
            </tr>
          </thead>
          <tbody>
            {kelas.map((item, index) => (
              <tr key={index}>
                <td>{item.batasBawah} - {item.batasAtas}</td>
                <td>{frequencies[index]}</td>
                <td>{((item.batasBawah + item.batasAtas) / 2).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </>
  )
}

export default App
