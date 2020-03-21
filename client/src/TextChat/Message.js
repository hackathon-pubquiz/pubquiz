import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";

export default function Message(props) {
  let { id, message, ownMessage } = props;
  let icon = (
    <ListItemIcon>
      <Avatar alt={message.nickname} src="/static/images/avatar/1.jpg" />
    </ListItemIcon>
  );
  return (
    <ListItem key={id}>
      {ownMessage ? "" : icon}
      <ListItemText primary={message.message} />
      {ownMessage ? icon : ""}
    </ListItem>
  );
}
