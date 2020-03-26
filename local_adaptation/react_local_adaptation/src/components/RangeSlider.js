import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
    root: {
        color: '#52af77',
        height: 8,
        width: 200,
      },
      thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
          boxShadow: 'inherit',
        },
      },
      active: {},
      valueLabel: {
        left: 'calc(-50% + 4px)',
      },
      track: {
        height: 8,
        borderRadius: 4,
      },
      rail: {
        height: 8,
        borderRadius: 4,
      },
});


function valuetext(value) {
  return `${value}`;
}


export default function RangeSlider(props, state) {
  const classes = useStyles();
  const [value, setValue] = React.useState([props.min, props.max]);

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
        step={0.01}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </div>
  );
}