import { createMuiTheme } from "@material-ui/core/styles";
import {  orange } from '@material-ui/core/colors';
const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      main: "#FFF633"
    },
    common: {
      white: "white"
    },
    secondary: {
      main: "#02c59b"
    },
    status: {
      main: orange[500],
    }
  },
  spacing: 10
 
});

export default theme;
