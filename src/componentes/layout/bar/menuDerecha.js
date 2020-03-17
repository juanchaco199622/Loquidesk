import React from 'react';
import { List, Link, ListItem, ListItemText, Avatar } from "@material-ui/core";

export const MenuDerecha = ({
  classes,
  usuario,
  textoUsuario,
  fotoUsuario,
  salirSesion
}) => (
  <div className={classes.list}>
    <List>
      <ListItem button component={Link} to="/auth/registrarUsuario">
        <Avatar classses={{ primary: classes.avatarSize }} src={fotoUsuario} />
        <ListItemText
          classes={{ primary: classes.ListItemText }}
          primary={textoUsuario}
        />
      </ListItem>
      <ListItem button onClick={salirSesion}>
        <ListItemText
          classes={{ primary: classes.ListItemText }}
          primary="salir"
        />
      </ListItem>
    </List>
  </div>
);
