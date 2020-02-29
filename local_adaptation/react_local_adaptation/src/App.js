import React, { Component } from 'react'
import './App.css'
import WorldMap from './WorldMap'
import worlddata from './world'
import BarChart from './BarChart'
import StreamGraph from './StreamGraph'
import { range } from 'd3-array'
import { scaleThreshold } from 'd3-scale'
import { geoCentroid} from 'd3-geo'

const appdata = worlddata.features
  .filter(d => geoCentroid(d)[0] < -20);


appdata
  .forEach((d,i) => {
    const offset = Math.random()
    d.launchday = i
    d.data = range(30).map((p,q) => q < i ? 0 : Math.random() * 2 + offset)
  }
);

const colorScale = scaleThreshold().domain([5,10,20,30]).range(["#75739F", "#5EAFC6", "#41A368", "#93C464"])

class App extends Component {
  constructor(props) {
    super(props);
    this.onResize = this.onResize.bind(this);
    this.state = { screenWidth: 1000, screenHeigght: 500};
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth, 
                    screenHeight: window.innerHeight - 70})
  }

   render() {
   return (
     <div className="App">
       <div className="App-header">
         <h2>Dashboard</h2>
       </div>
       <div>
          <StreamGraph colorScale={colorScale} data={appdata} size={[this.state.screenWidth, this.state.screenHeight / 2]} />
          <WorldMap colorScale={colorScale} data={appdata} size={[this.state.screenWidth / 2, this.state.screenHeight / 2]}/>
          <BarChart colorScale={colorScale} data={appdata} size={[this.state.screenWidth / 2, this.state.screenHeight / 2]} />
       </div>
     </div>
   )
   }
}

export default App
