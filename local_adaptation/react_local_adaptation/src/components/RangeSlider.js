import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: 200,
  },
});

function valuetext(value) {
  return `${value}`;
}

export default function RangeSlider(props, state) {
  const classes = useStyles();
  const [value, setValue] = React.useState([-1, 1]);

  const handleChange = (event, newValue) => {
    props.onSliderChange(newValue);
    setValue(newValue);
  };
  console.log(props);

  return (
    
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        Phenotype range
      </Typography>
      <Slider
        value={value}
        min={props.min}
        max={props.max}
        step={0.1}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </div>
  );
}